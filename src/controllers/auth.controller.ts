import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser, UserAuth, UserLoginResponse, UserLoginRequest, UserSignUpRequest } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: UserSignUpRequest = req.body;

      const signUpUserData: UserLoginResponse = await this.auth.signup(userData);

      res.status(201).json({ data: signUpUserData, status: 'success' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginRequest: UserLoginRequest = req.body;
      const { cookie, userData } = await this.auth.login(loginRequest);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: userData, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: UserAuth = req.user;
      await this.auth.logout(userData, req);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ message: 'Logged out' });
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cookie, accessToken } = await this.auth.refreshToken(req.cookies);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  };
}
