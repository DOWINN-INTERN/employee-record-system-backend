import { Exclude, Expose, Type } from 'class-transformer';
import { DepartmentsResponseDto } from 'src/modules/departments/dto/departments-response.dto';
import { InPositionResponse } from '../interface/positions.interface';

@Exclude()
export class PositionResponseDto implements InPositionResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  hierarchy: number;

  @Expose({ toClassOnly: true })
  @Type(() => DepartmentsResponseDto)
  department: DepartmentsResponseDto;

  @Expose({ name: 'branchId' })
  get branchId() {
    return this.department.branch.id;
  }
  @Expose({ name: 'branchName' })
  get branchName() {
    return this.department.branch.name;
  }

  @Expose({ name: 'branchAlias' })
  get branchAlias() {
    return this.department.branch.alias;
  }

  @Expose({ name: 'departmentId' })
  get departmentId() {
    return this.department.id;
  }

  @Expose({ name: 'departmentName' })
  get departmentName() {
    return this.department.name;
  }

  @Expose({ name: 'departmentAlias' })
  get departmentAlias() {
    return this.department.alias;
  }

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
