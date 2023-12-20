import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";
import { updateUserSchema } from "../schema";
import { z } from "zod";

class UserService {
  prisma = prisma;

  UserService() {}

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async updateUser(username: string, user: z.infer<typeof updateUserSchema>) {
    return await this.prisma.user.update({
      where: {
        username,
      },
      data: {
        ...(user.fullName ? { fullName: user.fullName } : {}),
        ...(user.username ? { username: user.username } : {}),
        ...(user.password
          ? { password: await bcrypt.hash(user.password, 10) }
          : {}),
        ...(user.email ? { email: user.email } : {}),
        ...(user.role ? { role: user.role } : {}),
      },
    });
  }
}

export default new UserService();
