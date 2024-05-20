import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { DateTime, Duration } from 'luxon';
import { StringHelper } from 'src/common/helper/string.helper';
import { RequestDetailsService } from 'src/common/service/request-details.service';
import { acccessConfig } from 'src/config/tokens/access.config';
import { refreshConfig } from 'src/config/tokens/refresh.config';
import { DataSource, Repository } from 'typeorm';
import { UAResult } from 'ua-parser-js';
import { v4 as uuidv4 } from 'uuid';
import { LoginRequestDto } from './dto/login-request.dto';
import { SignupRequestDto } from './dto/signup-request.dto';
import { SignupResponseDto } from './dto/signup-response.dto';
import { UserAccess } from './entity/user-access.entity';
import { UserAuth } from './entity/user-auth.entity';
import { UserInfo } from './entity/user-info.entity';
import { UserStatus } from './entity/user-status.entity';
import { UserToken } from './entity/user-token.entity';
import { EnMonths } from './enum/months.enum';
import { EnUserAccess } from './enum/user-access.enum';
import { EnUserStatus } from './enum/user-status.enum';
import { InSignupResponse } from './interface/auth.interface';
import { InJwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAccess) private accessRepo: Repository<UserAccess>,
    @InjectRepository(UserStatus) private statusRepo: Repository<UserStatus>,
    @InjectRepository(UserInfo) private infoRepo: Repository<UserInfo>,
    @InjectRepository(UserAuth) private authRepo: Repository<UserAuth>,
    @InjectRepository(UserToken) private tokenRepo: Repository<UserToken>,
    private jwtService: JwtService,
    private dataSource: DataSource,
    private configService: ConfigService,
    private requestDetailsService: RequestDetailsService,
    private stringHelper: StringHelper,
  ) {}

  async signUp(signupRequestDto: SignupRequestDto): Promise<InSignupResponse> {
    const defaultUserAccess = await this.accessRepo.findOne({ where: { name: EnUserAccess.NONE } });
    const defaultUserStatus = await this.statusRepo.findOne({ where: { name: EnUserStatus.PENDING } });

    if (!defaultUserAccess || !defaultUserStatus) {
      throw new UnprocessableEntityException();
    }

    const { email, username, password, firstName, lastName, phone, sex, month, day, year } = signupRequestDto;

    const usernameCase = username.toLowerCase();
    const emailCase = email.toLowerCase();

    if (await this.authRepo.existsBy({ username: usernameCase })) {
      throw new ConflictException();
    }

    if (await this.authRepo.existsBy({ email: emailCase })) {
      throw new ConflictException();
    }

    if (await this.infoRepo.existsBy({ phone: phone })) {
      throw new ConflictException();
    }

    const firstnameCase = await this.stringHelper.firstLetterCase(firstName);
    const lastnameCase = await this.stringHelper.firstLetterCase(lastName);

    const monthName = Object.values(EnMonths);
    const formattedDate = `${monthName[month - 1]} ${day}, ${year}`;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userInfo = queryRunner.manager.create(UserInfo, {
        firstName: firstnameCase,
        lastName: lastnameCase,
        phone,
        sex,
        birthDate: formattedDate,
      });

      const info = await queryRunner.manager.save(UserInfo, userInfo);

      const userAuth = queryRunner.manager.create(UserAuth, {
        email: emailCase,
        username: usernameCase,
        password: hashedPassword,
        userAccess: defaultUserAccess,
        userStatus: defaultUserStatus,
        userInfo: info,
      });

      const auth = await queryRunner.manager.save(UserAuth, userAuth);

      await queryRunner.commitTransaction();

      return plainToInstance(SignupResponseDto, auth);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async signIn(loginRequestDto: LoginRequestDto, userAgent: UAResult): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = loginRequestDto;

    const uun = username.toLowerCase();
    const user = await this.authRepo.findOne({ where: { username: uun } });

    if (!(user && (await bcrypt.compare(password, user.password)))) {
      throw new BadRequestException();
    }

    if (!(user.userStatus.name === EnUserStatus.PENDING)) {
      throw new ForbiddenException();
    }

    if (!(user.userAccess.name === EnUserAccess.NONE)) {
      throw new ForbiddenException();
    }

    const uid = user.id;
    const sub = uuidv4();

    const payload: InJwtPayload = { uun, uid, sub };

    const { secret: accessSecret, signOptions: accessOpt } = await acccessConfig(this.configService);
    const { secret: refreshSecret, signOptions: refreshOpt } = await refreshConfig(this.configService);

    const accessToken = await this.jwtService.signAsync(payload, { secret: accessSecret, expiresIn: accessOpt.expiresIn });
    const refreshToken = await this.jwtService.signAsync(payload, { secret: refreshSecret, expiresIn: refreshOpt.expiresIn });

    const expiration = DateTime.now().plus(Duration.fromMillis(+refreshOpt.expiresIn)).toJSDate();

    const salt = await bcrypt.genSalt();
    const hashedRefresh = await bcrypt.hash(refreshToken, salt);

    const requestDetails = await this.requestDetailsService.getRequestDetails(userAgent);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userToken = queryRunner.manager.create(UserToken, {
        sub: sub,
        refreshToken: hashedRefresh,
        ipAddress: requestDetails.ipAddress,
        location: requestDetails.location,
        browser: requestDetails.browser,
        osystem: requestDetails.osystem,
        device: requestDetails.device,
        expiresAt: expiration,
        userAuth: user,
      });

      await queryRunner.manager.save(UserToken, userToken);

      await queryRunner.commitTransaction();

      return { accessToken, refreshToken };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async authRefresh(user: UserAuth, oldsub: string, userAgent: UAResult): Promise<{ accessToken: string; refreshToken: string }> {
    if (!user || !oldsub) {
      throw new InternalServerErrorException();
    }

    const uun = user.username;
    const uid = user.id;
    const sub = uuidv4();

    const payload: InJwtPayload = { uun, uid, sub };

    const { secret: accessSecret, signOptions: accessOpt } = await acccessConfig(this.configService);
    const { secret: refreshSecret, signOptions: refreshOpt } = await refreshConfig(this.configService);

    const accessToken = await this.jwtService.signAsync(payload, { secret: accessSecret, expiresIn: accessOpt.expiresIn });
    const refreshToken = await this.jwtService.signAsync(payload, { secret: refreshSecret, expiresIn: refreshOpt.expiresIn });

    const expiration = DateTime.now().plus(Duration.fromMillis(+refreshOpt.expiresIn)).toJSDate();

    const salt = await bcrypt.genSalt();
    const hashedRefresh = await bcrypt.hash(refreshToken, salt);

    const requestDetails = await this.requestDetailsService.getRequestDetails(userAgent);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newToken = queryRunner.manager.create(UserToken, {
        sub: sub,
        refreshToken: hashedRefresh,
        ipAddress: requestDetails.ipAddress,
        location: requestDetails.location,
        browser: requestDetails.browser,
        osystem: requestDetails.osystem,
        device: requestDetails.device,
        expiresAt: expiration,
        userAuth: user,
      });

      await queryRunner.manager.save(UserToken, newToken);

      await queryRunner.manager.delete(UserToken, { sub: oldsub, userAuth: user });

      await queryRunner.commitTransaction();

      return { accessToken, refreshToken };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async signOut(user: UserAuth, oldsub: string): Promise<void> {
    if (!user || !oldsub) {
      throw new InternalServerErrorException();
    }

    try {
      await this.tokenRepo.delete({ sub: oldsub, userAuth: user });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
