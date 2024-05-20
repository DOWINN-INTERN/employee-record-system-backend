import { PartialType } from '@nestjs/mapped-types';
import { branchesDto } from './branches.dto';

export class BranchesRequestDto extends PartialType(branchesDto) {}
