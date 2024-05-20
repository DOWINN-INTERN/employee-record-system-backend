import { Transform } from 'class-transformer';
import { IsAlphanumeric, IsEmail, IsIn, IsInt, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword, Matches, Max, Min } from 'class-validator';
import { HasConsecutiveLetters } from 'src/common/validator/consecutive-letters.validator';
import { HasMinLetters } from 'src/common/validator/minimum-letters.validator';
import { IsNumberAtEnd } from 'src/common/validator/number-at-end.validator';
import { InSignupRequest } from '../interface/auth.interface';

export class SignupRequestDto implements InSignupRequest {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @IsNumberAtEnd(3)
  @HasMinLetters(3)
  @HasConsecutiveLetters(3)
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({ minLength: 8, minNumbers: 1, minSymbols: 0 })
  password: string;

  @IsNotEmpty()
  @IsString()
  @HasMinLetters(2)
  @HasConsecutiveLetters(2)
  @Matches(/^[\p{L}\s]+$/u, { message: 'First name only accepts letters and spaces.' })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @HasMinLetters(2)
  @HasConsecutiveLetters(2)
  @Matches(/^[\p{L}\s]+$/u, { message: 'Last name only accepts letters and spaces.' })
  lastName: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(31)
  day: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('PH')
  phone: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['Male', 'Female'])
  sex: string;
}
