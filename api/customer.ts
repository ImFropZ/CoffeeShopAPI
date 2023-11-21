import { Router } from "express";
import { use } from "../utils";
import { authorizeMiddleware } from "../middlewares/authorizeMiddleware";
import { adminValidatorMiddleware } from "../middlewares/roleValidatorMiddlware";
import {
  customers,
  customer,
  invoices,
  createCustomer,
  updateCustomer,
} from "../controllers/customer";

const api = Router();

api.get("/", use(authorizeMiddleware), use(customers));
api.get("/:id", use(authorizeMiddleware), use(customer));
api.get("/:id/invoices", use(authorizeMiddleware), use(invoices));

api.post(
  "/",
  use(authorizeMiddleware),
  use(adminValidatorMiddleware),
  use(createCustomer)
);

api.put(
  "/:id",
  use(authorizeMiddleware),
  use(adminValidatorMiddleware),
  use(updateCustomer)
);

export default api;
