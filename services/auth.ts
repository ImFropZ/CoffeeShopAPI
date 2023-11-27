import { updateUserSchema, userLocalsSchema } from "./../schema";
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

  async login({ data, password }: z.infer<typeof loginSchema>) {
    const username = data.includes("@") ? undefined : data;

    let user = null;

    if (username) {
      user = await this.prisma.user
        .findUnique({
          where: {
            username,
          },
        })
        .catch((error: Error) => {
          console.log(error);
          throw new InternalError("Something went wrong");
        });
    } else {
      user = await this.prisma.user
        .findUnique({
          where: {
            email: data,
          },
        })
        .catch((error: Error) => {
          console.log(error);
          throw new InternalError("Something went wrong");
        });
    }

    if (!user) {
      throw new BadRequestError("User is not found");
    }

    const isCorrectPassword = bcrypt.compareSync(password, user.hashedPassword);

    if (!isCorrectPassword)
      throw new BadRequestError("Password is not correct");

    return { token: generateAccessToken(user.username), role: user.role };
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
      .catch(() => {
        throw new BadRequestError("User is already exist");
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

    if (username) {
      user = await this.prisma.user
        .findUnique({
          where: {
            username,
          },
        })
        .catch((error: Error) => {
          console.log(error);
          throw new InternalError("Something went wrong");
        });
    } else {
      user = await this.prisma.user
        .findUnique({
          where: {
            email: data,
          },
        })
        .catch((error: Error) => {
          console.log(error);
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
        .catch(() => {
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
        .catch(() => {
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

  async profile({ username }: z.infer<typeof userLocalsSchema>) {
    const user = await this.prisma.user
      .findUnique({
        where: {
          username,
        },
        include: {
          invoices: true,
        },
      })
      .catch((error: Error) => {
        console.log(error);
        throw new InternalError("Something went wrong");
      });

    if (!user) {
      throw new BadRequestError("User is not found");
    }

    return {
      username: user.username,
      email: user.email,
      role: user.role,
      invoices: user.invoices,
    };
  }

  async updateProfile(
    user: z.infer<typeof userLocalsSchema>,
    userToUpdate: z.infer<typeof updateUserSchema>
  ) {
    // Update the password if oldPassword and newPassword is provided
    if (userToUpdate.oldPassword && userToUpdate.newPassword) {
      const { hashedPassword } = await this.prisma.user
        .findFirstOrThrow({
          where: { username: user.username },
          select: { hashedPassword: true },
        })
        .catch(() => {
          throw new BadRequestError("User is not found");
        });

      const isCorrectPassword = bcrypt.compareSync(
        userToUpdate.oldPassword,
        hashedPassword
      );

      if (!isCorrectPassword) {
        throw new BadRequestError("Old password is incorrect");
      }

      await this.prisma.user.update({
        where: {
          username: userToUpdate.username,
        },
        data: {
          hashedPassword: await bcrypt.hash(userToUpdate.newPassword, 10),
        },
      });
    }

    if (user.role === "ADMIN") {
      const updatedUser = await this.prisma.user
        .update({
          where: {
            username: user.username,
          },
          data: {
            username: userToUpdate.username,
            email: userToUpdate.email,
            role: userToUpdate.role,
          },
        })
        .catch((error: Error) => {
          console.log(error);
          throw new InternalError("Something went wrong");
        });

      if (!updatedUser) {
        throw new BadRequestError("User is not updated");
      }

      return {
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      };
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        username: user.username,
      },
      data: {
        username: userToUpdate.username,
        email: userToUpdate.email,
      },
    });

    return {
      username: updatedUser.username,
      email: updatedUser.email,
      role: user.role,
    };
  }
}

export default new AuthService();
