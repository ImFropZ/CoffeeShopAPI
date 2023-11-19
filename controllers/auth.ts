import { Response, Request } from "express";
import authService from "../services/auth";
import { loginSchema, registerSchema } from "../schema";
import { BadRequestError } from "../models/error";
import { getcookie } from "../utils";

export async function login(req: Request, res: Response) {
  const loginCredentials = await loginSchema.parseAsync(req.body).catch((_) => {
    throw new BadRequestError("Invalid login credentials");
  });

  const token = await authService.login(loginCredentials);

  res.cookie("access-token", token, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
  });

  res.json({
    message: "Lgoged in",
  });
}

export async function register(req: Request, res: Response) {
  const registerCredentials = await registerSchema
    .parseAsync(req.body)
    .catch((_) => {
      throw new BadRequestError("Invalid register credentials");
    });

  const user = await authService.register(registerCredentials);

  return res.json(user);
}

export async function logout(req: Request, res: Response) {
  let isLogin = false;
  const cookies = getcookie(req);

  if (cookies.length === 0) {
    throw new BadRequestError("You are not logged in");
  }

  cookies.forEach((cookie) => {
    const [key, _] = cookie.split("=");
    if (key === "access-token") {
      isLogin = true;
    }
  });

  if (!isLogin) {
    throw new BadRequestError("You are not logged in");
  }

  res.clearCookie("access-token");
  res.json({ message: "Logged out" });
}
