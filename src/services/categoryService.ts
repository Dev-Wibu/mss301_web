import { USE_MOCK_API } from "@/constants/app.const";
import { mockCategories } from "@/mocks/categories.mock";
import type { Category } from "@/interfaces/product.types";
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api.config";

export const categoryService = {
  getCategories: async (): Promise<any[]> => {
    // Tạm thời nếu vẫn còn code Mock cũ thì chặn nó lại
    if (USE_MOCK_API) {
      return []; 
    }
    try {
      // Đường dẫn API_ENDPOINTS.CATEGORIES.LIST lúc nãy mình đã thêm là "/api/products/categories"
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.LIST);
      return response.data; 
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
      return [];
    }
  },
};
