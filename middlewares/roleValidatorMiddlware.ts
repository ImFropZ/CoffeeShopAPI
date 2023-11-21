import { Response, NextFunction, Request } from "express";
import { UnauthorizedError } from "../models/error";

export async function adminValidatorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isAdmin = res.locals.user === "ADMIN";

  if (!isAdmin) {
    throw new UnauthorizedError("You are not authorized");
  }

  next();
}

export async function cashierValidatorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isCashier =
    res.locals.user === "CASHIER" || res.locals.user === "ADMIN";

  if (!isCashier) {
    throw new UnauthorizedError("You are not authorized");
  }

  next();
}

export async function stockValidatorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isStock = res.locals.user === "STOCK" || res.locals.user === "ADMIN";

  if (!isStock) {
    throw new UnauthorizedError("You are not authorized");
  }

  next();
}
