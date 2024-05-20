import { IsNotEmpty, IsString } from 'class-validator';
import { InLoginRequest } from '../interface/auth.interface';

export class LoginRequestDto implements InLoginRequest {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
