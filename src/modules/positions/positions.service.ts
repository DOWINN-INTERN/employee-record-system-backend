import { ConflictException, Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { EnStatus } from 'src/common/enum/status.enum';
import { StringHelper } from 'src/common/helper/string.helper';
import { DataSource, Not, Repository } from 'typeorm';
import { DepartmentsResponseDto } from '../departments/dto/departments-response.dto';
import { Departments } from '../departments/entity/departments.entity';
import { InDepartmentsResponse } from '../departments/interface/departments.interface';
import { PositionRequestDto } from './dto/position-request.dto';
import { PositionResponseDto } from './dto/position-response.dto';
import { Positions } from './entity/positions.entity';
import { InPositionResponse } from './interface/positions.interface';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Positions) private positionsRepo: Repository<Positions>,
    @InjectRepository(Departments) private departmentsRepo: Repository<Departments>,
    private dataSource: DataSource,
    private stringHelper: StringHelper,
  ) {}

  async getAllPositions(): Promise<InDepartmentsResponse[]> {
    // prettier-ignore
    const departments = await this.departmentsRepo
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.branch', 'b')
      .leftJoinAndSelect('d.positions', 'p')
      .loadRelationCountAndMap('d.posCount', 'd.positions')
      .getMany();

    return plainToInstance(DepartmentsResponseDto, departments);
  }

  async getDepartmentPositions(balias: string, dalias: string): Promise<InPositionResponse[]> {
    if (!balias || !dalias || typeof balias !== 'string' || typeof dalias !== 'string') {
      throw new UnprocessableEntityException();
    }

    const department = await this.departmentsRepo.findOne({ relations: { branch: true }, where: { alias: dalias, branch: { alias: balias } } });

    if (!department) {
      throw new UnprocessableEntityException();
    }

    const positions = await this.positionsRepo.find({ relations: { department: true }, where: { department: { id: department.id } } });

    if (!positions) {
      throw new UnprocessableEntityException();
    }

    return plainToInstance(PositionResponseDto, positions);
  }

  async addPosition(balias: string, dalias: string, positionRequestDto: PositionRequestDto): Promise<InPositionResponse> {
    if (!balias || !dalias || typeof balias !== 'string' || typeof dalias !== 'string') {
      throw new UnprocessableEntityException();
    }

    const { did, name, hierarchy } = positionRequestDto;

    if (!did || !name || !hierarchy) {
      throw new UnprocessableEntityException();
    }

    if (typeof did !== 'number' || typeof name !== 'string' || typeof hierarchy !== 'number') {
      throw new UnprocessableEntityException();
    }

    const department = await this.departmentsRepo.findOne({ relations: { branch: true }, where: { alias: dalias, branch: { alias: balias } } });

    if (!department) {
      throw new UnprocessableEntityException();
    }

    if (department.status !== EnStatus.ACTIVE) {
      throw new UnprocessableEntityException();
    }

    if (did !== department.id) {
      throw new UnprocessableEntityException();
    }

    const nameCase = await this.stringHelper.firstLetterCase(name);
    const isName = await this.positionsRepo.findOne({ relations: { department: true }, where: { name: nameCase, department: { id: did } } });

    if (isName) {
      throw new ConflictException();
    }

    const metrics = await this.stringHelper.stringMetrics(nameCase);
    const isMetrics = await this.positionsRepo.findOne({ relations: { department: true }, where: { metrics: metrics, department: { id: did } } });

    if (isMetrics) {
      throw new ConflictException();
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const position = queryRunner.manager.create(Positions, {
        name: nameCase,
        hierarchy: hierarchy,
        department: department,
        metrics: metrics,
      });

      const finalQuery = await queryRunner.manager.save(Positions, position);

      await queryRunner.commitTransaction();

      return plainToInstance(PositionResponseDto, finalQuery);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async editPosition(balias: string, dalias: string, positionRequestDto: PositionRequestDto): Promise<InPositionResponse> {
    if (!balias || !dalias || typeof balias !== 'string' || typeof dalias !== 'string') {
      throw new UnprocessableEntityException();
    }

    const { did, pid, name, hierarchy } = positionRequestDto;

    if (!did || !pid || !name || !hierarchy) {
      throw new UnprocessableEntityException();
    }

    if (typeof did !== 'number' || typeof pid !== 'number' || typeof name !== 'string' || typeof hierarchy !== 'number') {
      throw new UnprocessableEntityException();
    }

    const department = await this.departmentsRepo.findOne({ relations: { branch: true }, where: { alias: dalias, branch: { alias: balias } } });

    if (!department) {
      throw new UnprocessableEntityException();
    }

    if (department.status !== EnStatus.ACTIVE) {
      throw new UnprocessableEntityException();
    }

    if (did !== department.id) {
      throw new UnprocessableEntityException();
    }

    const position = await this.positionsRepo.findOne({ relations: { department: true }, where: { id: pid, department: { id: did } } });

    if (!position) {
      throw new UnprocessableEntityException();
    }

    const nameCase = await this.stringHelper.firstLetterCase(name);
    const isName = await this.positionsRepo.findOne({ relations: { department: true }, where: { name: nameCase, id: Not(pid), department: { id: did } } });

    if (isName) {
      throw new ConflictException();
    }

    const metrics = await this.stringHelper.stringMetrics(nameCase);
    const isMetrics = await this.positionsRepo.findOne({ relations: { department: true }, where: { metrics: metrics, id: Not(pid), department: { id: did } } });

    if (isMetrics) {
      throw new ConflictException();
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      position.name = nameCase;
      position.hierarchy = hierarchy;

      const finalQuery = await queryRunner.manager.save(Positions, position);

      await queryRunner.commitTransaction();

      return plainToInstance(PositionResponseDto, finalQuery);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
