import { Router } from "express";
import auth from "./auth";

const api = Router();

api.use("/auth", auth);

export default api;
