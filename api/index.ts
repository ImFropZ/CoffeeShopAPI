import { Router } from "express";
import auth from "./auth";
import menu from "./menu";
import order from "./order";
import customer from "./customer";
import stock from "./stock";

const api = Router();

api.use("/auth", auth);
api.use("/menus", menu);
api.use("/orders", order);
api.use("/customers", customer);
api.use("/stocks", stock);

export default api;
