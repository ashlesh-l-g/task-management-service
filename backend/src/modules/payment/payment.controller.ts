import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

export class PaymentController {
  static async createOrder(req: Request, res: Response) {
    const data = await PaymentService.createOrder();
    res.status(200).json(data);
  }
}