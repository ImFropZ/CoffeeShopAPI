import { BadRequestError } from "./../models/error";
import { Request, Response } from "express";
import stockService from "../services/stock";
import * as z from "zod";

export async function stocks(req: Request, res: Response) {
  res.json({ data: "Stocks" });
}

export async function stock(req: Request, res: Response) {
  res.json({ data: "Stock" });
}

export async function stockReport(req: Request, res: Response) {
  res.json({ data: "Stock Report" });
}

export async function stockReports(req: Request, res: Response) {
  res.json({ data: "Stock Reports" });
}

export async function createStock(req: Request, res: Response) {
  res.json({ data: "Create Stock" });
}

export async function updateStock(req: Request, res: Response) {
  res.json({ data: "Update Stock" });
}

export async function removeStock(req: Request, res: Response) {
  res.json({ data: "Remove Stock" });
}

export async function stockItems(req: Request, res: Response) {
  res.json({ data: "Stock Items" });
}

export async function addItemToStock(req: Request, res: Response) {
  res.json({ data: "Add Item To Stock" });
}

export async function removeItemFromStock(req: Request, res: Response) {
  res.json({ data: "Remove Item From Stock" });
}

export async function updateStockItem(req: Request, res: Response) {
  res.json({ data: "Update Stock Item" });
}
