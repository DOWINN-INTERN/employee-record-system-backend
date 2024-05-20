import { Exclude, Expose, Transform, Type, plainToInstance } from 'class-transformer';
import { EnStatus } from 'src/common/enum/status.enum';
import { BranchesResponseDto } from 'src/modules/branches/dto/branches-response.dto';
import { InDepartmentsResponse } from '../interface/departments.interface';
import { DepartmentsRelationDto } from './departments-relation.dto';

@Exclude()
export class DepartmentsResponseDto implements InDepartmentsResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  alias: string;

  @Expose()
  status: EnStatus;

  @Expose({ toClassOnly: true })
  @Type(() => BranchesResponseDto)
  branch: BranchesResponseDto;

  @Expose({ name: 'branchId' })
  get branchId() {
    return this.branch.id;
  }

  @Expose({ name: 'branchName' })
  get branchName() {
    return this.branch.name;
  }

  @Expose({ name: 'branchAlias' })
  get branchAlias() {
    return this.branch.alias;
  }

  @Expose()
  posCount: number;

  @Expose()
  @Transform(({ value }) => plainToInstance(DepartmentsRelationDto, value))
  positions: DepartmentsRelationDto[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
