import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export function generateAccessToken(username: string) {
  return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET ?? "", {
    expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  });
}

export function verifyAccessToken(accessToken: string) {
  try {
    var decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET ?? ""
    );

    return decoded as { username: string };
  } catch (err) {
    return null;
  }
}

export const use =
  (fn: (req: Request, res: Response, next: NextFunction) => void) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export function getcookie(req: Request) {
  var cookie = req.headers.cookie;
  if (!cookie) return [];
  return cookie.split("; ");
}

export function generateToken(length = 3) {
  return crypto.randomBytes(length).toString("hex");
}
