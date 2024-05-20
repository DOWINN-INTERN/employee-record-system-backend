import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';
import { EnStatus } from 'src/common/enum/status.enum';
import { InBranchImage, InBranchesResponse } from '../interface/branches.interface';
import { BranchesRelationDto } from './branches-relation.dto';

@Exclude()
export class BranchImageDto implements InBranchImage {
  @Expose()
  id: number;

  @Exclude()
  imageId: string;

  @Expose()
  thumbnail: string;

  @Expose()
  original: string;

  @Expose()
  public: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

@Exclude()
export class BranchesResponseDto implements InBranchesResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  address: string;

  @Expose()
  alias: string;

  @Expose()
  status: EnStatus;

  @Expose()
  @Transform(({ value }) => plainToInstance(BranchImageDto, value))
  branchImage: BranchImageDto;

  @Expose()
  deptCount: number;

  @Expose()
  @Transform(({ value }) => plainToInstance(BranchesRelationDto, value))
  departments: BranchesRelationDto[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
