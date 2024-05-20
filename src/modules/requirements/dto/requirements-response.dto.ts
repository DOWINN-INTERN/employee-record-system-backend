import { Exclude, Expose, Type } from 'class-transformer';
import { EnRequirementType } from '../enum/requirements.enum';
import { InRequirementType, InRequirementsResponse } from '../interface/requirements.interface';

@Exclude()
class RequirementTypeDto implements InRequirementType {
  @Expose()
  id: number;

  @Expose()
  name: EnRequirementType;
}

@Exclude()
export class RequirementsResponseDto implements InRequirementsResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Exclude()
  metrics: string;

  @Expose({ toClassOnly: true })
  @Type(() => RequirementTypeDto)
  requirementType: RequirementTypeDto;

  @Expose({ name: 'type' })
  get type() {
    return this.requirementType.name;
  }
}
