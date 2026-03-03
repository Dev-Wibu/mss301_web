import { USE_MOCK_API } from "@/constants/app.const";
import type { PaymentMethod } from "@/interfaces/order.types";
import type { PaymentInitiateResponse } from "@/interfaces/payment.types";
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api.config";

export const paymentService = {
  initiatePayment: async (
    orderId: number,
    method: PaymentMethod,
  ): Promise<PaymentInitiateResponse> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 800));
      if (method === "cod") {
        return { transactionId: `COD-${orderId}` };
      }
      return {
        paymentUrl: `https://sandbox.${method}.vn/pay?orderId=${orderId}`,
        transactionId: `${method.toUpperCase()}-${orderId}-${Date.now()}`,
      };
    }
    const response = await apiClient.post(API_ENDPOINTS.PAYMENTS.INITIATE, {
      orderId,
      method,
      returnUrl: `${window.location.origin}/order/success`,
    });
    return response.data.data;
  },

  verifyPayment: async (
    transactionId: string,
  ): Promise<{ status: "paid" | "failed" }> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 500));
      return { status: "paid" };
    }
    const response = await apiClient.get(
      API_ENDPOINTS.PAYMENTS.VERIFY(transactionId),
    );
    return response.data.data;
  },
};
