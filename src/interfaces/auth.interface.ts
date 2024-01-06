import { Request } from 'express';
import { User } from '@interfaces/users.interface';

enum EmailValidationStatusDesc {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
}

export interface AuthCookie {
  Authorization: string
}

export interface DataStoredInToken {
  userId: number;
  email: string;
  username: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface EmailValidationStatus {
  emailValidationStatusId?: number;
  status?: EmailValidationStatusDesc | string;
}

export interface RefreshToken {
  refreshTokenId: number;
  userId: number;
  refreshToken: string;
}

export interface RequestWithUser extends Request {
  user: UserAuth;
}

export interface UserAuth extends EmailValidationStatus {
  userId: number;
  email: string;
  passwordHash: string;
  refreshTokens?: RefreshToken[];
  emailValidationStatus?: EmailValidationStatus;
}

export interface UserSignUpRequest extends UserAuth, User {
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse extends User {
  email: string;
  accessToken?: string;
}
