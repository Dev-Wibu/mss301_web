import type { PaymentMethod } from "./order.types";

export interface PaymentInitiateRequest {
  orderId: number;
  method: PaymentMethod;
  returnUrl: string;
}

export interface PaymentInitiateResponse {
  paymentUrl?: string;
  qrCode?: string;
  transactionId: string;
}
