import { USE_MOCK_API } from "@/constants/app.const";
import { mockVouchers, mockFlashSales, mockPromotions } from "@/mocks/promotions.mock";
import type { Voucher, FlashSale, Promotion } from "@/interfaces/promotion.types";
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api.config";

export const promotionService = {
  getVouchers: async (): Promise<Voucher[]> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      return mockVouchers;
    }
    const response = await apiClient.get(API_ENDPOINTS.PROMOTIONS.VOUCHERS);
    return response.data.data;
  },

  validateVoucher: async (code: string): Promise<Voucher> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 500));
      const voucher = mockVouchers.find((v) => v.code === code && v.isActive);
      if (!voucher) throw new Error("Mã giảm giá không hợp lệ");
      return voucher;
    }
    const response = await apiClient.post(API_ENDPOINTS.PROMOTIONS.VALIDATE_VOUCHER, { code });
    return response.data.data;
  },

  getFlashSales: async (): Promise<FlashSale[]> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      return mockFlashSales;
    }
    const response = await apiClient.get(API_ENDPOINTS.PROMOTIONS.FLASH_SALES);
    return response.data.data;
  },

  getPromotions: async (): Promise<Promotion[]> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      return mockPromotions;
    }
    const response = await apiClient.get(API_ENDPOINTS.PROMOTIONS.LIST);
    return response.data.data;
  },
};
