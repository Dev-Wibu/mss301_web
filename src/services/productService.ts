import { USE_MOCK_API } from "@/constants/app.const";
import { mockProducts } from "@/mocks/products.mock";
import type { Product, ProductListResponse } from "@/interfaces/product.types";
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api.config";
import { PAGINATION } from "@/constants/app.const";

interface GetProductsParams {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "rating" | "sold";
}

export const productService = {
  getProducts: async (params: GetProductsParams = {}): Promise<ProductListResponse> => {
    let allProducts: Product[] = [];

    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 500));
      // Ép kiểu tạm thời để tránh lỗi TypeScript khi mock data cũ không khớp interface mới
      allProducts = [...mockProducts].filter((p) => p.active) as unknown as Product[];
    } else {
      // 1. Gọi API lấy toàn bộ sản phẩm active
      const response = await apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.LIST);
      allProducts = response.data;
    }

    // 2. Xử lý Lọc (Filter) ở Frontend
    let filtered = [...allProducts];

    // Lọc theo tìm kiếm tên
    if (params.search) {
      const query = params.search.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(query));
    }
    // Lọc theo khoảng giá
    if (params.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= params.maxPrice!);
    }
    // Sắp xếp
    if (params.sortBy) {
      switch (params.sortBy) {
        case "price_asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
      }
    }

    // 3. Xử lý Phân trang (Pagination) ở Frontend
    const page = params.page || 1;
    const pageSize = params.pageSize || PAGINATION.DEFAULT_PAGE_SIZE;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    // Trả về đúng cấu trúc mà các trang danh sách đang đợi
    return {
      items,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  },

  // Sửa tên từ getProductBySlug thành getProductById cho đúng với API BE
  getProductById: async (id: string | number): Promise<Product> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      const product = mockProducts.find((p) => p.id === Number(id));
      if (!product) throw new Error("Sản phẩm không tồn tại");
      return product as unknown as Product;
    }
    const response = await apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.DETAIL(String(id)));
    return response.data;
  },

  getFlashSaleProducts: async (): Promise<Product[]> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      return mockProducts.filter((p) => p.active) as unknown as Product[];
    }
    const response = await apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.FLASH_SALE);
    return response.data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      return mockProducts.filter((p) => p.active).slice(0, 8) as unknown as Product[];
    }
    const response = await apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.FEATURED);
    // Trả về 8 sản phẩm đầu tiên cho nổi bật
    return response.data.slice(0, 8);
  },
};
