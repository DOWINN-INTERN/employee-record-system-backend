import { OmitType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { PositionResponseDto } from 'src/modules/positions/dto/position-response.dto';

@Exclude()
export class DepartmentsRelationDto extends OmitType(PositionResponseDto, ['department', 'branchId', 'branchName', 'branchAlias', 'departmentId', 'departmentName', 'departmentAlias', 'createdAt', 'updatedAt'] as const) {}
