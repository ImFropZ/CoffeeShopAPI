import { Router } from "express";
import { login, logout, register } from "../controllers/auth";
import { use } from "../utils";
const api = Router();

api.post("/login", use(login));
api.post("/register", use(register));
api.post("/logout", use(logout));

export default api;
