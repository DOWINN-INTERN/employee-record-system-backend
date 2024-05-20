import { EnStatus } from 'src/common/enum/status.enum';
import { InBranches, InBranchesResponse } from 'src/modules/branches/interface/branches.interface';
import { InPositions } from 'src/modules/positions/interface/positions.interface';

export interface InDepartmentsResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
  alias: string;
  status: EnStatus;
  branch: InBranchesResponse;
  posCount: number;
  positions: InDepartmentsRelation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InDepartments {
  did: number;
  bid: number;
  status: EnStatus;
  name: string;
  email: string;
  phone: string;
  alias: string;
  branch: InBranches;
  positions: InPositions[];
}

export interface InDepartmentsRelation {
  id: number;
  name: string;
  hierarchy: number;
}
