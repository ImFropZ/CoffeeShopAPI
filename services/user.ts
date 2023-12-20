import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";

type UpdateUser = {
  fullName?: string;
  username?: string;
  password?: string;
};

class UserService {
  prisma = prisma;

  UserService() {}

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async updateUser(id: string, user: UpdateUser) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...(user.fullName ? { fullName: user.fullName } : {}),
        ...(user.username ? { username: user.username } : {}),
        ...(user.password
          ? { password: await bcrypt.hash(user.password, 10) }
          : {}),
      },
    });
  }
}

export default new UserService();
