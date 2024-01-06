import { Prisma, PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RefreshToken, RequestWithUser } from '@interfaces/auth.interface';
import { getRefreshToken, revokeAllRefreshToken } from '@/utils/authToken';

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const prisma = new PrismaClient();

  try {
    const userAuth = prisma.userAuth;
    const refreshToken = getRefreshToken(req);

    if (refreshToken) {
      const { userId } = verify(refreshToken, SECRET_KEY) as DataStoredInToken;
      const findUserAuth = await userAuth.findUnique({ where: { userId: userId } });

      if (findUserAuth) {
        req.user = findUserAuth;
        next();
      } else {
        next(new HttpException(401, 'Unauthorized'));
      }
    } else {
      next(new HttpException(404, 'Authentication token not found'));
    }
  } catch (error) {
    next(new HttpException(401, 'Unauthorized'));
  } finally {
    prisma.$disconnect();
  }
};

/**
 * @description Check is the refresh token has been used or hijacked
 */
export const TokenRotationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const prisma = new PrismaClient();

  try {
    const refreshToken = getRefreshToken(req);

    if (refreshToken) {
      const { userId } = verify(refreshToken, SECRET_KEY) as DataStoredInToken;
      const userAuth = prisma.userAuth;

      const userAuthData = await userAuth.findUnique({ where: { userId }, include: { refreshToken: true } });

      const refreshTokenList: RefreshToken[] = userAuthData.refreshToken;

      if (refreshTokenList.length == 0) {
        next(new HttpException(401, 'Unauthorized'));
      }

      const isRefreshTokenUsed = refreshTokenList.some(({ refreshToken: refreshTokenFromList }, index) => {
        if (refreshTokenFromList === refreshToken && index !== refreshTokenList.length - 1) return true;
        return false;
      });

      if (isRefreshTokenUsed) {
        await revokeAllRefreshToken(userId);
        next(new HttpException(401, 'Unauthorized'));
      } else {
        next();
      }
    } else {
      next(new HttpException(404, 'Authentication token not found'));
    }
  } catch (error) {
    next(new HttpException(401, 'Unauthorized'));
  } finally {
    prisma.$disconnect();
  }
};
