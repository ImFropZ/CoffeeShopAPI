import { Request, Response } from "express";
import { Moment } from "moment";
import invoiceService from "../services/invoice";
import { BadRequestError } from "../models/error";
import { z } from "zod";

export async function invoices(req: Request, res: Response) {
  const dateRange = res.locals.dateRange as
    | { start: Moment; end: Moment }
    | undefined;

  const invoices = await invoiceService.getInvoices(dateRange);
  res.json({ data: invoices });
}

export async function deleteInvoice(req: Request, res: Response) {
  const id = await z
    .string()
    .uuid()
    .parseAsync(req.params.id)
    .catch(() => {
      throw new BadRequestError("Invoice id is invalid");
    });

  const result = await invoiceService.deleteInvoice(id);
  res.json({ data: result });
}
