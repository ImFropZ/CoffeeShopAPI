import { userSchema } from "./../schema";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateAccessToken, generateToken } from "../utils";
import { BadRequestError, InternalError } from "../models/error";
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
      .catch((_) => {
        throw new InternalError("Something went wrong");
      });

    if (!user) {
      throw new BadRequestError("User is not found");
    }

    const isCorrectPassword = bcrypt.compareSync(password, user.hashedPassword);

    if (!isCorrectPassword)
      throw new BadRequestError("Password is not correct");

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
        throw new InternalError("Something went wrong");
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

  async forgotPassword({ data }: z.infer<typeof forgotPasswordSchema>) {
    // Check if data is email or username
    const username = data.includes("@") ? undefined : data;

    let user = null;

    if (username === undefined) {
      user = await this.prisma.user
        .findUnique({
          where: {
            email: data,
          },
        })
        .catch((_) => {
          throw new InternalError("Something went wrong");
        });
    } else {
      user = await this.prisma.user
        .findUnique({
          where: {
            username,
          },
        })
        .catch((_) => {
          throw new InternalError("Something went wrong");
        });
    }

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
    data,
    newPassword,
  }: z.infer<typeof verifyTokenSchema>) {
    const username = data.includes("@") ? undefined : data;

    let passwordReset;

    if (username === undefined) {
      passwordReset = await this.prisma.passwordReset
        .findFirstOrThrow({
          where: {
            user: {
              email: data,
            },
          },
        })
        .catch((_) => {
          throw new BadRequestError("User doesn't have reset token");
        });
    } else {
      passwordReset = await this.prisma.passwordReset
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
    }

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

  async profile({ username }: z.infer<typeof userSchema>) {
    const user = await this.prisma.user
      .findUnique({
        where: {
          username,
        },
      })
      .catch((_) => {
        throw new InternalError("Something went wrong");
      });

    if (!user) {
      throw new BadRequestError("User is not found");
    }

    return {
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}

export default new AuthService();
