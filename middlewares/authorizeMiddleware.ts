import { Response, NextFunction, Request } from "express";
import { getCookie, verifyAccessToken } from "../utils";
import { UnauthorizedError } from "../models/error";

export function authorizeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cookies = getCookie(req);

  if (cookies.length === 0) {
    throw new UnauthorizedError("You are not logged in");
  }

  let user = null;

  cookies.forEach((cookie) => {
    const [key, value] = cookie.split("=");
    if (key === "access-token") {
      user = verifyAccessToken(value);
    }
  });

  if (!user) {
    throw new UnauthorizedError("You are not logged in");
  }

  res.locals.user = user;
  next();
}
