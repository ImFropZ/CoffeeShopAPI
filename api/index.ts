import { Router } from "express";
import auth from "./auth";
import menu from "./menu";
import order from "./order";
import customer from "./customer";

const api = Router();

api.use("/auth", auth);
api.use("/menus", menu);
api.use("/orders", order);
api.use("/customers", customer);

export default api;
