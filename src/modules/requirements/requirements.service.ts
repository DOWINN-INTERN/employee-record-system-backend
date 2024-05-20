import { ConflictException, Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { StringHelper } from 'src/common/helper/string.helper';
import { DataSource, Repository } from 'typeorm';
import { RequirementsRequestDto } from './dto/requirements-request.dto';
import { RequirementsResponseDto } from './dto/requirements-response.dto';
import { TypeResponseDto } from './dto/type-response.dto';
import { RequirementType } from './entity/requirement-type.entity';
import { Requirements } from './entity/requirements.entity';
import { InRequirementsResponse, InTypeResponse } from './interface/requirements.interface';

@Injectable()
export class RequirementsService {
  constructor(
    @InjectRepository(Requirements) private requirementsRepo: Repository<Requirements>,
    @InjectRepository(RequirementType) private typeRepo: Repository<RequirementType>,
    private stringHelper: StringHelper,
    private dataSource: DataSource,
  ) {}

  async getRequirements(): Promise<InTypeResponse[]> {
    // prettier-ignore
    const types = await this.typeRepo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.requirements', 'r')
      .getMany();

    return plainToInstance(TypeResponseDto, types);
  }

  async addRequirement(requirementsRequestDto: RequirementsRequestDto): Promise<InRequirementsResponse> {
    const { tid, name } = requirementsRequestDto;

    if (!tid || !name) {
      throw new UnprocessableEntityException();
    }

    if (typeof tid !== 'number' || typeof name !== 'string') {
      throw new UnprocessableEntityException();
    }

    const requirementType = await this.typeRepo.findOne({ where: { id: tid } });

    if (!requirementType) {
      throw new UnprocessableEntityException();
    }

    const nameCase = name.toUpperCase();
    const isName = await this.requirementsRepo.findOne({ where: { name: nameCase } });

    if (isName) {
      throw new ConflictException();
    }

    const metrics = await this.stringHelper.stringMetrics(nameCase);
    const isMetrics = await this.requirementsRepo.findOne({ where: { metrics: metrics } });

    if (isMetrics) {
      throw new ConflictException();
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const requirement = queryRunner.manager.create(Requirements, {
        name: nameCase,
        metrics: metrics,
        requirementType: requirementType,
      });

      const finalQuery = await queryRunner.manager.save(Requirements, requirement);

      await queryRunner.commitTransaction();

      return plainToInstance(RequirementsResponseDto, finalQuery);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async editRequirement(requirementsRequestDto: RequirementsRequestDto): Promise<void> {
    const { rid, tid, name } = requirementsRequestDto;

    if (!rid || !tid || !name) {
      throw new UnprocessableEntityException();
    }

    if (typeof rid !== 'number' || typeof tid !== 'number' || typeof name !== 'string') {
      throw new UnprocessableEntityException();
    }
  }
}
