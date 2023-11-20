import * as z from "zod";

export const loginSchema = z.object({
  data: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/)
    .or(z.string().email()),
  password: z.string().min(6).max(100),
});

export const registerSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(6).max(100),
  email: z.string().email().optional(),
});

export const forgotPasswordSchema = z.object({
  data: z
    .string()
    .email()
    .or(z.string().regex(/^[a-zA-Z0-9_]+$/)),
});

export const verifyTokenSchema = z.object({
  data: z
    .string()
    .email()
    .or(z.string().regex(/^[a-zA-Z0-9_]+$/)),
  newPassword: z.string().min(6).max(100),
  token: z.string().length(6),
});

export const userSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9_]+$/),
});