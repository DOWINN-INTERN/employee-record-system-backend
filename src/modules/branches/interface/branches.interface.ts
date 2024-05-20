import { EnStatus } from 'src/common/enum/status.enum';
import { InDepartments } from 'src/modules/departments/interface/departments.interface';

export interface InBranchesResponse {
  id: number;
  branchImage: InBranchImage;
  name: string;
  address: string;
  alias: string;
  status: EnStatus;
  deptCount: number;
  departments: InBranchesRelation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InBranchImage {
  id: number;
  imageId: string;
  thumbnail: string;
  original: string;
  public: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InBranches {
  bid: number;
  image: string;
  status: EnStatus;
  name: string;
  address: string;
  alias: string;
  departments: InDepartments[];
}

export interface InBranchesRelation {
  id: number;
  name: string;
  email: string;
  phone: string;
  alias: string;
  status: EnStatus;
}
