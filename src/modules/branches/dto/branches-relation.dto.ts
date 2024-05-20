import { OmitType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { DepartmentsResponseDto } from 'src/modules/departments/dto/departments-response.dto';

@Exclude()
export class BranchesRelationDto extends OmitType(DepartmentsResponseDto, ['branch', 'branchId', 'branchName', 'branchAlias', 'posCount', 'positions', 'createdAt', 'updatedAt'] as const) {}
