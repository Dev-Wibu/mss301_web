import { USE_MOCK_API } from "@/constants/app.const";
import { mockCategories } from "@/mocks/categories.mock";
import type { Category } from "@/interfaces/product.types";
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api.config";

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      return mockCategories;
    }
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.LIST);
    return response.data.data;
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 200));
      const category = mockCategories.find((c) => c.slug === slug);
      if (!category) throw new Error("Danh mục không tồn tại");
      return category;
    }
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.DETAIL(0));
    return response.data.data;
  },
};
