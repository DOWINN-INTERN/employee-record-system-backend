export interface InAuthConstants {
  id: number;
  name: string;
}

export interface InLoginRequest {
  username: string;
  password: string;
}

export interface InSignupRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  month: number;
  day: number;
  year: number;
  phone: string;
  sex: string;
}

export interface InSignupResponse {
  id: string;
  email: string;
  username: string;
  password: string;
  userAccess: InAuthConstants;
  userStatus: InAuthConstants;
  userInfo: InUserInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface InUserInfo {
  id: number;
  image: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  sex: string;
  createdAt: Date;
  updatedAt: Date;
}
