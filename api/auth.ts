import { Router } from "express";
import {
  verifyToken,
  forgotPassword,
  login,
  logout,
  register,
  profile,
  updateProfile,
} from "../controllers/auth";
import { use } from "../utils";
import { authorizeMiddleware } from "../middlewares/authorizeMiddleware";
const api = Router();

api.get("/me", authorizeMiddleware, use(profile));

api.post("/login", use(login));
api.post("/register", use(register));
api.post("/logout", use(logout));
api.post("/forgot-password", use(forgotPassword));
api.post("/verify-token", use(verifyToken));

api.put("/me", authorizeMiddleware, use(updateProfile));

export default api;
