import { Router } from "express";
import { use } from "../utils";
import { authorizeMiddleware } from "../middlewares/authorizeMiddleware";
import { cashierValidatorMiddleware } from "../middlewares/roleValidatorMiddlware";
import { order } from "../controllers/order";

const api = Router();

api.post(
  "/",
  use(authorizeMiddleware),
  use(cashierValidatorMiddleware),
  use(order)
);

export default api;
