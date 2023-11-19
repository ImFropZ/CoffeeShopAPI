import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateAccessToken, generateToken } from "../utils";
import { BadRequestError, UnauthorizedError } from "../models/error";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyTokenSchema,
} from "../schema";
import * as z from "zod";
import { transporter } from "../config/nodemailer";

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

    const isCorrectPassword = bcrypt.compareSync(password, user.hashedPassword);

    if (!isCorrectPassword)
      throw new UnauthorizedError("Password is not correct");

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

  async forgotPassword({ username }: z.infer<typeof forgotPasswordSchema>) {
    const user = await this.prisma.user
      .findUnique({
        where: {
          username,
        },
      })
      .catch((err) => {
        throw new BadRequestError("User is not found");
      });

    if (!user) {
      throw new BadRequestError("User is not found");
    }

    if (!user.email) {
      throw new BadRequestError("Email is not found");
    }

    const token = generateToken();

    transporter.sendMail(
      {
        from: process.env.FROM_EMAIL,
        to: user.email,
        subject: "Coffee Shop - Forgot password",
        text: `
        Hi ${user.username},
        You have requested to reset your password.
        Your token is ${token}. This token will expire in 1 hour.
        
        If you did not request this, please ignore this email and your password will remain unchanged`,
      },
      (err, info) => {
        if (err) {
          throw new BadRequestError("Email is not sent");
        }
      }
    );

    const passwordReset = await this.prisma.passwordReset.findFirst({
      where: {
        user: {
          username,
        },
      },
    });

    if (passwordReset) {
      await this.prisma.passwordReset.update({
        data: {
          token,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
        where: { id: passwordReset.id },
      });
    } else {
      await this.prisma.passwordReset.create({
        data: {
          token,
          user: {
            connect: {
              username,
            },
          },
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });
    }

    return true;
  }

  async verifyToken({
    token,
    username,
    newPassword,
  }: z.infer<typeof verifyTokenSchema>) {
    const passwordReset = await this.prisma.passwordReset
      .findFirstOrThrow({
        where: {
          user: {
            username,
          },
        },
      })
      .catch((_) => {
        throw new BadRequestError("User doesn't have reset token");
      });

    if (passwordReset.expiresAt < new Date()) {
      throw new BadRequestError("Token is expired");
    }

    if (passwordReset.token !== token) {
      throw new BadRequestError("Invalid token");
    }

    await this.prisma.passwordReset.delete({
      where: {
        id: passwordReset.id,
      },
    });

    await this.prisma.user.update({
      where: {
        username,
      },
      data: {
        hashedPassword: await bcrypt.hash(newPassword, 10),
      },
    });

    return true;
  }
}

export default new AuthService();
