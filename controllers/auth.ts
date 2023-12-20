import { updateProfileSchema, userLocalsSchema } from "./../schema";
import { Response, Request } from "express";
import authService from "../services/auth";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  verifyTokenSchema,
} from "../schema";
import { BadRequestError } from "../models/error";

export async function login(req: Request, res: Response) {
  const loginCredentials = await loginSchema.parseAsync(req.body).catch((_) => {
    throw new BadRequestError("Invalid login credentials");
  });

  const { token, role } = await authService.login(loginCredentials);

  res.json({
    accessToken: token,
    tokenType: "Bearer",
    expiresIn: 1000 * 60 * 60 * 24 * 7, // 7 days
    role: role,
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

export async function forgotPassword(req: Request, res: Response) {
  const forgotPasswordCredentials = await forgotPasswordSchema
    .parseAsync(req.body)
    .catch((_) => {
      throw new BadRequestError("Invalid forgot password credentials");
    });

  const isSend = await authService.forgotPassword(forgotPasswordCredentials);

  if (!isSend) {
    throw new BadRequestError("Unable to send email");
  }

  res.json({ message: "The token has been to your email." });
}

export async function verifyToken(req: Request, res: Response) {
  const verifyTokenCredentials = await verifyTokenSchema
    .parseAsync(req.body)
    .catch((_) => {
      throw new BadRequestError("Invalid verify token credentials");
    });

  const isVerified = await authService.verifyToken(verifyTokenCredentials);

  if (!isVerified) {
    throw new BadRequestError("Invalid token");
  }

  res.json({ message: "Your password has been updated." });
}

export async function profile(req: Request, res: Response) {
  const user = await userLocalsSchema.parseAsync(res.locals.user).catch((_) => {
    throw new BadRequestError("Invalid user");
  });

  const userDetails = await authService.profile(user);

  res.json(userDetails);
}

export async function updateProfile(req: Request, res: Response) {
  const user = await userLocalsSchema.parseAsync(res.locals.user).catch((_) => {
    throw new BadRequestError("Invalid user");
  });

  const userUpdate = await updateProfileSchema.parseAsync(req.body).catch((_) => {
    throw new BadRequestError("Invalid user update");
  });

  const userDetails = await authService.updateProfile(user, userUpdate);

  res.json(userDetails);
}
