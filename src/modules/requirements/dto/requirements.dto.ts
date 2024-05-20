import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { HasConsecutiveLetters } from 'src/common/validator/consecutive-letters.validator';
import { HasMinLetters } from 'src/common/validator/minimum-letters.validator';
import { InRequirementType, InRequirements } from '../interface/requirements.interface';

export class RequirementsDto implements InRequirements {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  rid: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  tid: number;

  @IsNotEmpty()
  @IsString()
  @HasMinLetters(2)
  @HasConsecutiveLetters(2)
  @Matches(/^[\p{L}\p{N}\s.,-_]+$/u, { message: 'Name only accepts letters, numbers, spaces, dots, commas, hypens, and underscores.' })
  name: string;

  requirementType: InRequirementType;
}
