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

export const orderSchema = z.object({
  menus: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().min(1),
      sugar: z.number(),
      attribute: z.string(),
    })
  ),
  customerId: z.string().optional(),
});

export const createCustomerSchema = z.object({
  name: z.string().min(3).max(100),
  phone: z.string().min(3).max(100).optional(),
  address: z.string().min(3).max(100).optional(),
});

export const updateCustomerSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  phone: z.string().min(3).max(100).optional(),
  address: z.string().min(3).max(100).optional(),
});

export const createStockSchema = z.object({
  name: z.string().min(3).max(100),
});

export const updateStockSchema = z.object({
  name: z.string().min(3).max(100),
});

export const stockItemSchema = z.object({
  quantity: z.number().min(1).int(),
  price: z.number().min(0),
  expiresDate: z.coerce.date(),
});

export const updateStockItemSchema = z.array(
  z.object({
    id: z.string().uuid(),
    quantity: z.number().int().min(0),
  })
);
