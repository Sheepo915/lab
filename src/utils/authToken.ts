import { Request } from 'express';
import { HttpException } from '@/exceptions/httpException';
import { PrismaClient } from '@prisma/client';

export const getAccessToken = (req: Request) => {
  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const getRefreshToken = (req: Request): string => {
  const cookie = req.cookies['Authorization'];
  if (cookie) return cookie;

  return null;
};

export const saveNewRefreshToken = async (userId: number, refreshToken: string): Promise<void> => {
  try {
    const refreshTokens = new PrismaClient().refreshTokens;

    const updateRefreshToken = await refreshTokens.create({ data: { refreshToken, userId } });
  } catch (error) {
    throw new HttpException(500, `Internal server error: ${error}`);
  }
};

export const revokeAllRefreshToken = async (userId: number) => {
  try {
    const refreshTokens = new PrismaClient().refreshTokens;

    const deleteRefreshToken = await refreshTokens.deleteMany({ where: { userId } });
  } catch (error) {
    throw new HttpException(500, `Internal server error: ${error}`);
  }
};
