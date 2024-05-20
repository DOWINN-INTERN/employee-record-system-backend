import { OmitType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { RequirementsResponseDto } from './requirements-response.dto';

@Exclude()
export class RequirementsRelationDto extends OmitType(RequirementsResponseDto, ['type'] as const) {}
