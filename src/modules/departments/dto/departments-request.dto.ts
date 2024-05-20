import { PartialType } from '@nestjs/mapped-types';
import { DepartmentsDto } from './departments.dto';

export class DepartmentsRequestDto extends PartialType(DepartmentsDto) {}
