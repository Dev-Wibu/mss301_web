import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import type { Product, ProductListResponse } from "@/interfaces/product.types";

interface UseProductsParams {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "rating" | "sold";
}

export function useProducts(params: UseProductsParams = {}) {
  return useQuery<ProductListResponse>({
    queryKey: ["products", params],
    queryFn: () => productService.getProducts(params),
  });
}

export function useProductDetail(slug: string) {
  return useQuery<Product>({
    queryKey: ["products", "detail", slug],
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useFlashSaleProducts() {
  return useQuery<Product[]>({
    queryKey: ["products", "flash-sale"],
    queryFn: productService.getFlashSaleProducts,
  });
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ["products", "featured"],
    queryFn: productService.getFeaturedProducts,
  });
}

export function useSearchProducts(query: string) {
  return useQuery<ProductListResponse>({
    queryKey: ["products", "search", query],
    queryFn: () => productService.getProducts({ search: query }),
    enabled: query.trim().length > 0,
  });
}
