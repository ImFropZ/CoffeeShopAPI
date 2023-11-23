import { Response, NextFunction, Request } from "express";
import { getCookie, verifyAccessToken } from "../utils";
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

  const cookies = getCookie(req);

  if (cookies.length === 0) {
    throw new UnauthorizedError("You are not logged in");
  }

  let token = null;

  cookies.forEach((cookie) => {
    const [key, value] = cookie.split("=");
    if (key === "access-token") {
      token = value;
    }
  });

  const { username } = verifyAccessToken(token ?? "") ?? { username: "" };

  if (!username) {
    throw new ForbiddenError("The token is invalid or expired");
  }

  const user = await prisma.user
    .findFirstOrThrow({
      where: {
        username,
      },
    })
    .catch((_) => {
      throw new ForbiddenError("User not found");
    });

  res.locals.user = {
    username: user.username,
    email: user.email,
    role: user.role,
  };
  next();
}
