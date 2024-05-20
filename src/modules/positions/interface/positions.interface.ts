import { InDepartments, InDepartmentsResponse } from 'src/modules/departments/interface/departments.interface';

export interface InPositionResponse {
  id: number;
  name: string;
  hierarchy: number;
  department: InDepartmentsResponse;
}

export interface InPositions {
  did: number;
  pid: number;
  name: string;
  hierarchy: number;
  department: InDepartments;
}
