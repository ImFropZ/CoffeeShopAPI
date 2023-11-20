import { Router } from "express";
import auth from "./auth";
import menu from "./menu";

const api = Router();

api.use("/auth", auth);
api.use("/menus", menu);

export default api;
