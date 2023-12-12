import { BadRequestError } from "./../models/error";
import { Request, Response } from "express";
import stockService from "../services/stock";
import * as z from "zod";
import {
  createStockSchema,
  stockItemSchema,
  updateStockItemSchema,
  updateStockSchema,
} from "../schema";
import { Moment } from "moment";

export async function stocks(req: Request, res: Response) {
  const stocks = await stockService.getStocks();
  res.json({ data: stocks });
}

export async function stock(req: Request, res: Response) {
  const id = req.params.id;

  const stock = await stockService.getStock(id);
  res.json({ data: stock });
}

export async function stockReport(req: Request, res: Response) {
  const id = await z
    .string()
    .uuid()
    .parseAsync(req.params.id)
    .catch((_) => {
      throw new BadRequestError("Stock id is invalid");
    });

  const reportStock = await stockService.getStockReport(id);
  res.json({ data: reportStock });
}

export async function stockReports(req: Request, res: Response) {
  const dateRange = res.locals.dateRange as
    | { start: Moment; end: Moment }
    | undefined;

  const reports = await stockService.getStockReports(dateRange);
  res.json({ data: reports });
}

export async function createStock(req: Request, res: Response) {
  const stock = await createStockSchema.parseAsync(req.body).catch((_) => {
    throw new BadRequestError("Invalid stock data");
  });
  const createdStock = await stockService.createStock(stock);
  res.json({ data: createdStock });
}

export async function updateStock(req: Request, res: Response) {
  const stock = await updateStockSchema.parseAsync(req.body).catch((_) => {
    throw new BadRequestError("Invalid stock data");
  });

  const id = await z
    .string()
    .uuid()
    .parseAsync(req.params.id)
    .catch((_) => {
      throw new BadRequestError("Stock id is invalid");
    });

  const updatedStock = await stockService.updateStock(id, stock);
  res.json({ data: updatedStock });
}

export async function removeStock(req: Request, res: Response) {
  const id = await z
    .string()
    .uuid()
    .parseAsync(req.params.id)
    .catch((_) => {
      throw new BadRequestError("Invalid stock id");
    });

  await stockService.removeStock(id).catch((_) => {
    throw new BadRequestError("Invalid stock id");
  });
  res.json({ data: `Stock id(${id}) has been removed` });
}

export async function stockItems(req: Request, res: Response) {
  const id = await z
    .string()
    .uuid()
    .parseAsync(req.params.id)
    .catch((_) => {
      throw new BadRequestError("Invalid stock id");
    });

  const stockItems = await stockService.getStockItems(id);
  res.json({ data: stockItems });
}

export async function addItemToStock(req: Request, res: Response) {
  const stockItem = await stockItemSchema.parseAsync(req.body).catch((_) => {
    throw new BadRequestError("Invalid stock item data");
  });

  const id = await z
    .string()
    .uuid()
    .parseAsync(req.params.id)
    .catch((_) => {
      throw new BadRequestError("Invalid stock id");
    });

  const createdStockItem = await stockService
    .addStockItem(id, stockItem)
    .catch((_) => {
      throw new BadRequestError("Invalid stock id");
    });

  res.json({ data: createdStockItem });
}

export async function removeItemFromStock(req: Request, res: Response) {
  const stockId = await z
    .string()
    .uuid()
    .parseAsync(req.params.stockId)
    .catch((_) => {
      throw new BadRequestError("Invalid stock id");
    });

  const stockItemId = await z
    .string()
    .uuid()
    .parseAsync(req.params.id)
    .catch((_) => {
      throw new BadRequestError("Invalid stock item id");
    });

  const removedStockItem = await stockService.removeStockItem(
    stockId,
    stockItemId
  );

  res.json({ data: removedStockItem });
}

export async function updateStockItem(req: Request, res: Response) {
  const stockItems = await updateStockItemSchema
    .parseAsync(req.body)
    .catch((_) => {
      throw new BadRequestError("Invalid stock items data");
    });

  const updatedStockItem = await stockService.updateStockItem(stockItems);

  res.json({ data: updatedStockItem });
}
