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

export const userLocalsSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email().nullable(),
  role: z.enum(["USER", "ADMIN", "STOCK", "CASHIER"]),
});

export const updateUserSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email().nullable(),
  role: z.enum(["USER", "ADMIN", "STOCK", "CASHIER"]).default("USER"),
  oldPassword: z.string().min(6).max(100).optional(),
  newPassword: z.string().min(6).max(100).optional(),
});

export const createMenuSchema = z.object({
  name: z.string().min(3).max(100),
  picture: z.string().url(),
  price: z.number().min(0),
  cupSize: z.enum(["SMALL", "MEDIUM", "LARGE"]),
});

export const updateMenuSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(100),
  picture: z.string().url(),
  price: z.number().min(0),
  cupSize: z.enum(["SMALL", "MEDIUM", "LARGE"]),
});
