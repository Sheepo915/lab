import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@interfaces/users.interface';

@Service()
export class UserService {
  public user = new PrismaClient().userAccount;

  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await this.user.findMany();
    return allUser;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { userId: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async updateUser(userId: number, userData: User): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { userId: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const updateUserData = await this.user.update({ where: { userId: userId }, data: { ...userData } });
    return updateUserData;
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { userId: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const deleteUserData = await this.user.delete({ where: { userId: userId } });
    return deleteUserData;
  }
}
