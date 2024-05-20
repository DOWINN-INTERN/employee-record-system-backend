import { Exclude, Expose, Type } from 'class-transformer';
import { InAuthConstants, InSignupResponse, InUserInfo } from '../interface/auth.interface';

@Exclude()
class AuthConstantsDto implements InAuthConstants {
  @Exclude()
  id: number;

  @Expose()
  name: string;
}

@Exclude()
class UserInfoDto implements InUserInfo {
  @Exclude()
  id: number;

  @Expose()
  image: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  birthDate: string;

  @Expose()
  phone: string;

  @Expose()
  sex: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

@Exclude()
export class SignupResponseDto implements InSignupResponse {
  @Exclude()
  id: string;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Exclude()
  password: string;

  @Expose({ toClassOnly: true })
  @Type(() => AuthConstantsDto)
  userAccess: AuthConstantsDto;

  @Expose({ name: 'access' })
  get accessName() {
    return this.userAccess.name;
  }

  @Expose({ toClassOnly: true })
  @Type(() => AuthConstantsDto)
  userStatus: AuthConstantsDto;

  @Expose({ name: 'status' })
  get statusName() {
    return this.userStatus.name;
  }

  @Expose({ toClassOnly: true })
  @Type(() => UserInfoDto)
  userInfo: UserInfoDto;

  @Expose({ name: 'image' })
  get image() {
    return this.userInfo.image;
  }

  @Expose({ name: 'firstName' })
  get firstName() {
    return this.userInfo.firstName;
  }

  @Expose({ name: 'lastName' })
  get lastName() {
    return this.userInfo.lastName;
  }

  @Expose({ name: 'birthDate' })
  get birthDate() {
    return this.userInfo.birthDate;
  }

  @Expose({ name: 'phone' })
  get phone() {
    return this.userInfo.phone;
  }

  @Expose({ name: 'sex' })
  get sex() {
    return this.userInfo.sex;
  }

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
