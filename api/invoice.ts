import { Router } from "express";
import { use } from "../utils";
import { authorizeMiddleware } from "../middlewares/authorizeMiddleware";
import { invoices, deleteInvoice } from "../controllers/invoice";
import { queryMiddleware } from "../middlewares/queryMiddleware";
import { adminValidatorMiddleware } from "../middlewares/roleValidatorMiddlware";

const api = Router();

api.get("/", use(authorizeMiddleware), use(queryMiddleware), use(invoices));

api.delete(
  "/:id",
  use(authorizeMiddleware),
  use(adminValidatorMiddleware),
  use(deleteInvoice)
);

export default api;
