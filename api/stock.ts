import { Router } from "express";
import { use } from "../utils";
import { authorizeMiddleware } from "../middlewares/authorizeMiddleware";
import { stockValidatorMiddleware } from "../middlewares/roleValidatorMiddlware";
import {
  stocks,
  stock,
  removeStock,
  stockReport,
  stockReports,
  createStock,
  updateStock,
  addItemToStock,
  removeItemFromStock,
  updateStockItem,
  stockItems,
} from "../controllers/stock";

const api = Router();

api.get("/", use(authorizeMiddleware), use(stocks));
api.get("/:id", use(authorizeMiddleware), use(stock));
api.get("/:id/items", use(authorizeMiddleware), use(stockItems));

api.get("/reports", use(authorizeMiddleware), use(stockReports));
api.get("/:id/reports", use(authorizeMiddleware), use(stockReport));

api.post(
  "/",
  use(authorizeMiddleware),
  use(stockValidatorMiddleware),
  use(createStock)
);
api.post("/:id/items", use(authorizeMiddleware), use(addItemToStock));

api.put(
  "/:id",
  use(authorizeMiddleware),
  use(stockValidatorMiddleware),
  use(updateStock)
);
api.put("/:id/items", use(authorizeMiddleware), use(updateStockItem));

api.delete("/:id", use(authorizeMiddleware), use(removeStock));
api.delete("/:id/items", use(authorizeMiddleware), use(removeItemFromStock));

export default api;
