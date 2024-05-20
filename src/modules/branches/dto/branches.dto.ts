import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { EnStatus } from 'src/common/enum/status.enum';
import { HasConsecutiveLetters } from 'src/common/validator/consecutive-letters.validator';
import { HasMinLetters } from 'src/common/validator/minimum-letters.validator';
import { DepartmentsDto } from 'src/modules/departments/dto/departments.dto';
import { InBranches } from '../interface/branches.interface';

export class branchesDto implements InBranches {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  bid: number;

  @IsOptional()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsEnum(EnStatus)
  status: EnStatus;

  @IsNotEmpty()
  @IsString()
  @HasMinLetters(2)
  @HasConsecutiveLetters(2)
  @Matches(/^[\p{L}\p{N}\s.,-_]+$/u, { message: 'Name only accepts letters, numbers, spaces, dots, commas, hypens, and underscores.' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @HasMinLetters(2)
  @HasConsecutiveLetters(2)
  @Matches(/^[\p{L}\p{N}\s.,-_]+$/u, { message: 'Address only accepts letters, numbers, spaces, dots, commas, hypens, and underscores.' })
  address: string;

  @IsOptional()
  @IsString()
  alias: string;

  departments: DepartmentsDto[];
}
