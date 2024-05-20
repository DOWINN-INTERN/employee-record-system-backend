import { PartialType } from '@nestjs/mapped-types';
import { RequirementsDto } from './requirements.dto';

export class RequirementsRequestDto extends PartialType(RequirementsDto) {}
