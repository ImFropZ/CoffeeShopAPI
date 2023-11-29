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
api.get("/reports", use(authorizeMiddleware), use(stockReports));

api.get("/:id", use(authorizeMiddleware), use(stock));
api.get("/:id/items", use(authorizeMiddleware), use(stockItems));
api.get("/:id/reports", use(authorizeMiddleware), use(stockReport));

api.post(
  "/",
  use(authorizeMiddleware),
  use(stockValidatorMiddleware),
  use(createStock)
);

api.post(
  "/:id/items",
  use(authorizeMiddleware),
  use(stockValidatorMiddleware),
  use(addItemToStock)
);

api.put(
  "/items",
  use(authorizeMiddleware),
  use(stockValidatorMiddleware),
  use(updateStockItem)
);

api.put(
  "/:id",
  use(authorizeMiddleware),
  use(stockValidatorMiddleware),
  use(updateStock)
);

api.delete(
  "/:id",
  use(authorizeMiddleware),
  use(stockValidatorMiddleware),
  use(removeStock)
);
api.delete(
  "/:stockId/items/:id",
  use(authorizeMiddleware),
  use(stockValidatorMiddleware),
  use(removeItemFromStock)
);

export default api;
