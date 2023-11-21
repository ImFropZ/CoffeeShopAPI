import { Router } from "express";
import auth from "./auth";
import menu from "./menu";
import order from "./order";

const api = Router();

api.use("/auth", auth);
api.use("/menus", menu);
api.use("/order", order);

export default api;
