import { EnRequirementType } from '../enum/requirements.enum';

export interface InRequirementType {
  id: number;
  name: EnRequirementType;
}

export interface InRequirements {
  rid: number;
  name: string;
  requirementType: InRequirementType;
}

export interface InRequirementsResponse {
  id: number;
  name: string;
  metrics: string;
  requirementType: InRequirementType;
}

export interface InTypeResponse {
  id: number;
  name: EnRequirementType;
  requirements: InRequirementsResponse[];
}
