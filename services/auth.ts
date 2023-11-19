import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils";
import { BadRequestError, UnauthorizedError } from "../models/error";
import { registerSchema, loginSchema } from "../schema";
import * as z from "zod";

class AuthService {
  prisma = new PrismaClient();

  async login({ username, password }: z.infer<typeof loginSchema>) {
    const user = await this.prisma.user
      .findUnique({
        where: {
          username,
        },
      })
      .catch((err) => {
        throw new Error(err);
      });

    if (!user) {
      throw new UnauthorizedError("User is not found");
    }

    bcrypt.compare(password, user.hashedPassword, function (err, result) {
      if (err || !result) {
        throw new UnauthorizedError("Invalid password");
      }
    });

    return generateAccessToken(username);
  }

  async register({
    username,
    password,
    email,
  }: z.infer<typeof registerSchema>) {
    const user = await this.prisma.user
      .create({
        data: {
          username,
          hashedPassword: await bcrypt.hash(password, 10),
          email,
          role: "USER",
        },
      })
      .catch((_) => {
        throw new BadRequestError("User is already created");
      });

    if (!user) {
      throw new BadRequestError("User is not created");
    }

    return {
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}

export default new AuthService();
