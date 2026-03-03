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
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 500));
      let filtered = [...mockProducts].filter((p) => p.isActive);

      if (params.categoryId) {
        filtered = filtered.filter((p) => p.categoryId === params.categoryId);
      }
      if (params.brandId) {
        filtered = filtered.filter((p) => p.brandId === params.brandId);
      }
      if (params.minPrice !== undefined) {
        filtered = filtered.filter((p) => p.defaultPrice >= params.minPrice!);
      }
      if (params.maxPrice !== undefined) {
        filtered = filtered.filter((p) => p.defaultPrice <= params.maxPrice!);
      }
      if (params.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.tags.some((t) => t.toLowerCase().includes(query)),
        );
      }

      if (params.sortBy) {
        switch (params.sortBy) {
          case "price_asc":
            filtered.sort((a, b) => a.defaultPrice - b.defaultPrice);
            break;
          case "price_desc":
            filtered.sort((a, b) => b.defaultPrice - a.defaultPrice);
            break;
          case "newest":
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case "rating":
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case "sold":
            filtered.sort((a, b) => b.soldCount - a.soldCount);
            break;
        }
      }

      const page = params.page || 1;
      const pageSize = params.pageSize || PAGINATION.DEFAULT_PAGE_SIZE;
      const start = (page - 1) * pageSize;
      const items = filtered.slice(start, start + pageSize);

      return {
        items,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize),
      };
    }
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
    return response.data.data;
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      const product = mockProducts.find((p) => p.slug === slug);
      if (!product) throw new Error("Sản phẩm không tồn tại");
      return product;
    }
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.DETAIL(slug));
    return response.data.data;
  },

  getFlashSaleProducts: async (): Promise<Product[]> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      return mockProducts.filter((p) => p.isFlashSale);
    }
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.FLASH_SALE);
    return response.data.data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      return mockProducts.filter((p) => p.isActive).sort((a, b) => b.soldCount - a.soldCount).slice(0, 8);
    }
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.FEATURED);
    return response.data.data;
  },
};
