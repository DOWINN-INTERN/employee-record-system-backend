import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Matches, Max, Min } from 'class-validator';
import { HasConsecutiveLetters } from 'src/common/validator/consecutive-letters.validator';
import { HasMinLetters } from 'src/common/validator/minimum-letters.validator';
import { InDepartments } from 'src/modules/departments/interface/departments.interface';
import { InPositions } from '../interface/positions.interface';

export class positionsDto implements InPositions {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  did: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  pid: number;

  @IsNotEmpty()
  @IsString()
  @HasMinLetters(2)
  @HasConsecutiveLetters(2)
  @Matches(/^[\p{L}\p{N}\s.,-_]+$/u, { message: 'Name only accepts letters, numbers, spaces, dots, commas, hypens, and underscores.' })
  name: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(10)
  hierarchy: number;

  department: InDepartments;
}
