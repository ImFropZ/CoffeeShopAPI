import { Response, NextFunction, Request } from "express";
import { ForbiddenError } from "../models/error";

export async function adminValidatorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isAdmin = res.locals.user.role === "ADMIN";

  if (!isAdmin) {
    throw new ForbiddenError("You are not allowed to access this resource");
  }

  next();
}

export async function cashierValidatorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isCashier =
    res.locals.user.role === "CASHIER" || res.locals.user.role === "ADMIN";

  if (!isCashier) {
    throw new ForbiddenError("You are not allowed to access this resource");
  }

  next();
}

export async function stockValidatorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isStock = res.locals.user.role === "STOCK" || res.locals.user.role === "ADMIN";

  if (!isStock) {
    throw new ForbiddenError("You are not allowed to access this resource");
  }

  next();
}
