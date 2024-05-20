import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';
import { EnRequirementType } from '../enum/requirements.enum';
import { InTypeResponse } from '../interface/requirements.interface';
import { RequirementsRelationDto } from './requirements-relation.dto';

@Exclude()
export class TypeResponseDto implements InTypeResponse {
  @Expose()
  id: number;

  @Expose()
  name: EnRequirementType;

  @Expose()
  @Transform(({ value }) => plainToInstance(RequirementsRelationDto, value))
  requirements: RequirementsRelationDto[];
}
