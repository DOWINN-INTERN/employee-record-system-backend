import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { EnStatus } from 'src/common/enum/status.enum';
import { HasConsecutiveLetters } from 'src/common/validator/consecutive-letters.validator';
import { HasMinLetters } from 'src/common/validator/minimum-letters.validator';
import { branchesDto } from 'src/modules/branches/dto/branches.dto';
import { positionsDto } from 'src/modules/positions/dto/positions.dto';
import { InDepartments } from '../interface/departments.interface';

export class DepartmentsDto implements InDepartments {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  did: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  bid: number;

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
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  alias: string;

  branch: branchesDto;

  positions: positionsDto[];
}
