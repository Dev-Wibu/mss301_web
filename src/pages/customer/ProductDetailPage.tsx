import { PriceDisplay } from "@/components/common/PriceDisplay";
import { QuantityStepper } from "@/components/common/QuantityStepper";
import { RatingBreakdown } from "@/components/common/RatingBreakdown";
import { ReviewCard } from "@/components/common/ReviewCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productService } from "@/services/productService";
import { reviewService } from "@/services/reviewService";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useQuery } from "@tanstack/react-query";
import { Heart, ShoppingCart, Star, Truck } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggle: toggleWishlist } = useWishlistStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.getProductBySlug(slug!),
    enabled: !!slug,
  });

  const { data: reviewData } = useQuery({
    queryKey: ["reviews", product?.id],
    queryFn: () => reviewService.getProductReviews(product!.id),
    enabled: !!product?.id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-64 rounded bg-gray-200" />
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-square rounded-lg bg-gray-200" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-gray-200" />
              <div className="h-6 w-32 rounded bg-gray-200" />
              <div className="h-10 w-48 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-500">Sản phẩm không tồn tại</p>
        <Button asChild className="mt-4"><Link to="/products">Quay lại</Link></Button>
      </div>
    );
  }

  const selectedVariant = selectedVariantId
    ? product.variants.find((v) => v.id === selectedVariantId)
    : product.variants[0];

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      id: Date.now(),
      productId: product.id,
      variantId: selectedVariant.id,
      product: { id: product.id, slug: product.slug, name: product.name, thumbnailUrl: product.thumbnailUrl },
      variant: { id: selectedVariant.id, sku: selectedVariant.sku, color: selectedVariant.color, size: selectedVariant.size, price: selectedVariant.price, originalPrice: selectedVariant.originalPrice, stockQuantity: selectedVariant.stockQuantity },
      quantity,
      subtotal: selectedVariant.price * quantity,
    });
    toast.success("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-teal-500">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to={`/category/${product.category.slug}`} className="hover:text-teal-500">
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
          <img
            src={selectedVariant?.images[0]?.url || product.thumbnailUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="space-y-4">
          <p className="text-sm text-gray-400">{product.brand.name}</p>
          <h1 className="text-2xl font-bold text-zinc-900">{product.name}</h1>

          <div className="flex items-center gap-3">
            {product.isFlashSale && <Badge className="bg-red-400 text-white">SALE</Badge>}
            {product.soldCount > 500 && <Badge variant="outline">Bán chạy</Badge>}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= Math.round(product.rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating} ({product.reviewCount} đánh giá) | Đã bán {product.soldCount}
            </span>
          </div>

          <PriceDisplay
            price={selectedVariant?.price || product.defaultPrice}
            originalPrice={selectedVariant?.originalPrice || product.defaultOriginalPrice}
            size="lg"
          />

          {/* Variant Selection */}
          {product.variants.length > 1 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-900">Phân loại:</Label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`rounded-lg border-2 px-4 py-2 text-sm ${
                      (selectedVariant?.id || product.variants[0].id) === variant.id
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {[variant.color, variant.size].filter(Boolean).join(" - ")}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          {selectedVariant && (
            <p className={`text-sm ${selectedVariant.stockQuantity > 0 ? "text-green-600" : "text-gray-400"}`}>
              {selectedVariant.stockQuantity > 0
                ? `Còn hàng (${selectedVariant.stockQuantity} sản phẩm)`
                : "Hết hàng"}
            </p>
          )}

          {/* Quantity + Actions */}
          <div className="flex items-center gap-4">
            <QuantityStepper
              value={quantity}
              max={selectedVariant?.stockQuantity || 1}
              onChange={setQuantity}
            />
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-teal-500 hover:bg-teal-600"
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Thêm vào giỏ hàng
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart
                className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-teal-500 text-teal-500" : ""}`}
              />
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Truck className="h-4 w-4" />
            Giao hàng dự kiến: 2-5 ngày
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Tabs */}
      <Tabs defaultValue="description" className="space-y-4">
        <TabsList>
          <TabsTrigger value="description">Mô tả</TabsTrigger>
          <TabsTrigger value="specs">Thông số</TabsTrigger>
          <TabsTrigger value="reviews">
            Đánh giá ({product.reviewCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="prose max-w-none">
          <p className="text-gray-600">{product.description}</p>
        </TabsContent>

        <TabsContent value="specs">
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <tr key={key} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-3 font-medium text-zinc-900">{key}</td>
                    <td className="px-4 py-3 text-gray-600">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {reviewData && <RatingBreakdown breakdown={reviewData.breakdown} />}
          <Separator />
          {reviewData?.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {(!reviewData || reviewData.reviews.length === 0) && (
            <p className="py-8 text-center text-gray-500">
              Chưa có đánh giá nào cho sản phẩm này
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={className}>{children}</span>;
}
