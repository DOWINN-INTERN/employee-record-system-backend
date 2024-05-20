import { ConflictException, Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { EnStatus } from 'src/common/enum/status.enum';
import { StringHelper } from 'src/common/helper/string.helper';
import { DataSource, Not, Repository } from 'typeorm';
import { Branches } from '../branches/entity/branches.entity';
import { DepartmentsRequestDto } from './dto/departments-request.dto';
import { DepartmentsResponseDto } from './dto/departments-response.dto';
import { Departments } from './entity/departments.entity';
import { InDepartmentsResponse } from './interface/departments.interface';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Branches) private branchesRepo: Repository<Branches>,
    @InjectRepository(Departments) private departmentsRepo: Repository<Departments>,
    private dataSource: DataSource,
    private stringHelper: StringHelper,
  ) {}

  async getAllDepartment(): Promise<InDepartmentsResponse[]> {
    // prettier-ignore
    const departments = await this.departmentsRepo
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.branch', 'b')
      .leftJoinAndSelect('d.positions', 'p')
      .loadRelationCountAndMap('d.posCount', 'd.positions')
      .getMany();

    return plainToInstance(DepartmentsResponseDto, departments);
  }

  async addDepartment(departmentsRequestDto: DepartmentsRequestDto): Promise<InDepartmentsResponse> {
    const { bid, name, email, phone } = departmentsRequestDto;

    if (!bid || !name || !email || !phone) {
      throw new UnprocessableEntityException();
    }

    if (typeof bid !== 'number' || typeof name !== 'string') {
      throw new UnprocessableEntityException();
    }

    const branch = await this.branchesRepo.findOne({ where: { id: bid } });

    if (!branch) {
      throw new UnprocessableEntityException();
    }

    if (branch.status !== EnStatus.ACTIVE) {
      throw new UnprocessableEntityException();
    }

    const nameCase = await this.stringHelper.firstLetterCase(name);
    const isName = await this.departmentsRepo.findOne({ relations: { branch: true }, where: { name: nameCase, branch: { id: bid } } });

    if (isName) {
      throw new ConflictException();
    }

    const alias = await this.stringHelper.createAlias(nameCase);
    const isAlias = await this.departmentsRepo.findOne({ relations: { branch: true }, where: { alias: alias, branch: { id: bid } } });

    if (isAlias) {
      throw new ConflictException();
    }

    const metrics = await this.stringHelper.stringMetrics(nameCase);
    const isMetrics = await this.departmentsRepo.findOne({ relations: { branch: true }, where: { metrics: metrics, branch: { id: bid } } });

    if (isMetrics) {
      throw new ConflictException();
    }

    const emailCase = email.toLowerCase();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const department = queryRunner.manager.create(Departments, {
        status: EnStatus.ACTIVE,
        name: nameCase,
        email: emailCase,
        phone: phone,
        alias: alias,
        metrics: metrics,
        branch: branch,
      });

      const finalQuery = await queryRunner.manager.save(Departments, department);

      await queryRunner.commitTransaction();

      return plainToInstance(DepartmentsResponseDto, finalQuery);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async editDepartment(departmentsRequestDto: DepartmentsRequestDto): Promise<InDepartmentsResponse> {
    const { did, bid, name, email, phone } = departmentsRequestDto;

    if (!did || !bid || !name || !email || !phone) {
      throw new UnprocessableEntityException();
    }

    if (typeof did !== 'number' || typeof bid !== 'number' || typeof name !== 'string') {
      throw new UnprocessableEntityException();
    }

    const department = await this.departmentsRepo.findOne({ where: { id: did } });

    if (!department) {
      throw new UnprocessableEntityException();
    }

    if (department.status !== EnStatus.ACTIVE) {
      throw new UnprocessableEntityException();
    }

    let branch: Branches;

    if (department.branch.id !== bid) {
      branch = await this.branchesRepo.findOne({ where: { id: bid } });

      if (!branch) {
        throw new UnprocessableEntityException();
      }

      if (branch.status !== EnStatus.ACTIVE) {
        throw new UnprocessableEntityException();
      }
    } else {
      branch = null;
    }

    const nameCase = await this.stringHelper.firstLetterCase(name);
    const isName = await this.departmentsRepo.findOne({ relations: { branch: true }, where: { name: nameCase, id: Not(did), branch: { id: bid } } });

    if (isName) {
      throw new ConflictException();
    }

    const alias = await this.stringHelper.createAlias(nameCase);
    const isAlias = await this.departmentsRepo.findOne({ relations: { branch: true }, where: { alias: alias, id: Not(did), branch: { id: bid } } });

    if (isAlias) {
      throw new ConflictException();
    }

    const metrics = await this.stringHelper.stringMetrics(nameCase);
    const isMetrics = await this.departmentsRepo.findOne({ relations: { branch: true }, where: { metrics: metrics, id: Not(did), branch: { id: bid } } });

    if (isMetrics) {
      throw new ConflictException();
    }

    const emailCase = email.toLowerCase();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      department.name = nameCase;
      department.email = emailCase;
      department.phone = phone;
      department.alias = alias;
      department.metrics = metrics;

      if (branch) {
        department.branch = branch;
      }

      const finalQuery = await queryRunner.manager.save(Departments, department);

      await queryRunner.commitTransaction();

      return plainToInstance(DepartmentsResponseDto, finalQuery);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async editStatus(departmentsRequestDto: DepartmentsRequestDto): Promise<InDepartmentsResponse> {
    const { did, status } = departmentsRequestDto;

    if (!did || !status) {
      throw new UnprocessableEntityException();
    }

    if (typeof did !== 'number') {
      throw new UnprocessableEntityException();
    }

    const department = await this.departmentsRepo.findOne({ where: { id: did } });

    if (!department) {
      throw new UnprocessableEntityException();
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      department.status = status;

      const finalQuery = await queryRunner.manager.save(Departments, department);

      await queryRunner.commitTransaction();

      return plainToInstance(DepartmentsResponseDto, finalQuery);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
