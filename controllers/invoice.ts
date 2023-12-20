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

  const response = invoices.map((invoice) => {
    return {
      id: invoice.id,
      discount: invoice.discount,
      subTotal: invoice.subTotal,
      total: invoice.total,
      cashier: {
        ...invoice.user,
        hashedPassword: undefined,
        role: undefined,
        username: undefined,
        picture: undefined,
        roleId: undefined,
      },
      customer: invoice.customer,
      createdAt: invoice.createdAt,
      items: invoice.items.map((item) => {
        return {
          id: item.id,
          name: item.menuItem.menu.name,
          cupSize: item.menuItem.cupSize,
          price: item.price,
          quantity: item.quantity,
          sugar: item.sugar,
          ice: item.ice,
          attributes: item.attributes,
        };
      }),
    };
  });

  res.json({ data: response });
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
