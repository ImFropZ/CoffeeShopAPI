import { Response, NextFunction, Request } from "express";
import { verifyAccessToken } from "../utils";
import { ForbiddenError, UnauthorizedError } from "../models/error";
import { prisma } from "../config/prisma";

export async function authorizeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.headers["super-token"] === process.env.SUPER_USER_TOKEN) {
    res.locals.user = {
      username: "superuser",
      email: "",
      role: "ADMIN",
    };
    return next();
  }

  const authorization = req.headers["authorization"];

  if (!authorization) {
    throw new UnauthorizedError("You are not logged in");
  }

  const { username } = verifyAccessToken(authorization.split(" ")[1] ?? "") ?? {
    username: "",
  };

  if (!username) {
    throw new ForbiddenError("The token is invalid or expired");
  }

  const user = await prisma.user
    .findFirstOrThrow({
      where: {
        username,
      },
    })
    .catch(() => {
      throw new ForbiddenError("User not found");
    });

  res.locals.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
  next();
}
