import { PrismaClient } from '@prisma/client';
import { compare, genSalt, hash } from 'bcrypt';
import { decode, sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/httpException';
import { AuthCookie, DataStoredInToken, TokenData, UserAuth, UserLoginResponse } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { getRefreshToken, saveNewRefreshToken } from '@/utils/authToken';
import { Request } from 'express';

@Service()
export class AuthService {
  public prismaClient = new PrismaClient();
  public userAuth = this.prismaClient.userAuth;
  public userAccount = this.prismaClient.userAccount;
  public refreshTokens = this.prismaClient.refreshTokens;

  public async signup(userData: CreateUserDto): Promise<UserLoginResponse> {
    const findUser: UserAuth = await this.userAuth.findUnique({ where: { email: userData.email } });

    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const salt = await genSalt(userData.password.length);

    const hashedPassword = await hash(userData.password, salt);
    const createdUserAccount: User = await this.userAccount.create({
      data: {
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth,
        profilePic: userData.profilePic || '',
      },
    });
    const createdUserAuth: UserAuth = await this.userAuth.create({
      data: {
        userId: createdUserAccount.userId,
        email: userData.email,
        passwordHash: hashedPassword,
        emailValidationStatusId: 2,
      },
      include: { emailValidationStatus: true },
    });

    return this.sanitizeUserData(createdUserAccount, createdUserAuth);
  }

  public async login(loginRequest: LoginUserDto): Promise<{ cookie: string; userData: UserLoginResponse }> {
    const findUserAuth: UserAuth = await this.userAuth.findUnique({ where: { email: loginRequest.email }, include: { emailValidationStatus: true } });

    if (!findUserAuth) throw new HttpException(409, `Email does not exist`);

    const isPasswordMatching: boolean = await compare(loginRequest.password, findUserAuth.passwordHash);

    if (!isPasswordMatching) throw new HttpException(409, 'Invalid credentials');

    const findUserAccount: User = await this.userAccount.findUnique({ where: { userId: findUserAuth.userId } });

    const sanitizedData = this.sanitizeUserData(findUserAccount, findUserAuth);

    var { token: accessToken }: TokenData = this.createAccessToken(sanitizedData);
    var refreshToken: TokenData = await this.createRefreshToken(sanitizedData);
    // Create cookie for refreshToken
    var cookie: string = this.createCookie(refreshToken);

    return { cookie, userData: { ...sanitizedData, accessToken } };
  }

  public async logout(userData: UserAuth, req: Request): Promise<void> {
    const revokeRefreshToken = await this.invalidateRefreshToken(userData, req);

    if (!revokeRefreshToken) throw new HttpException(500, 'Internal server error');
  }

  public async refreshToken(requestCookie: AuthCookie): Promise<{ cookie: string; accessToken: TokenData }> {
    const decodedCookie = decode(requestCookie.Authorization);

    const newAccessToken = this.createAccessToken(decodedCookie as DataStoredInToken);
    const newRefreshToken = await this.createRefreshToken(decodedCookie as DataStoredInToken);

    const cookie: string = this.createCookie(newRefreshToken);

    return { cookie, accessToken: newAccessToken };
  }

  public createAccessToken(user: UserLoginResponse | DataStoredInToken): TokenData {
    // 5 minutes
    const expiresIn = Math.floor(Date.now() / 1000) + 5 * 60;

    const token = sign(
      {
        userId: user.userId,
        email: user.email,
        username: user.username,
      },
      SECRET_KEY,
      { algorithm: 'HS256', expiresIn },
    );

    return { expiresIn, token };
  }

  public async createRefreshToken(user: UserLoginResponse | DataStoredInToken): Promise<TokenData> {
    // 7 days
    const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

    const token = sign(
      {
        userId: user.userId,
        email: user.email,
        username: user.username,
      },
      SECRET_KEY,
      { algorithm: 'HS256', expiresIn },
    );

    try {
      await saveNewRefreshToken(user.userId, token);
    } catch (error) {
      console.error(error);
    }

    return { expiresIn, token };
  }

  public async invalidateRefreshToken(user: UserAuth, req: Request): Promise<boolean> {
    const refreshToken = getRefreshToken(req);

    const updateRefreshToken = await this.refreshTokens.create({ data: { refreshToken, userId: user.userId } });

    if (!updateRefreshToken) throw new HttpException(500, 'Internal server error');

    return true;
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }

  public sanitizeUserData(userAccount: User, userAuth: UserAuth): UserLoginResponse {
    const returnObject = { ...userAccount, ...userAuth, emailValidationStatus: userAuth.emailValidationStatus.status };
    delete returnObject.passwordHash;
    delete returnObject.emailValidationStatusId;
    delete returnObject.refreshTokens;

    return returnObject;
  }
}
