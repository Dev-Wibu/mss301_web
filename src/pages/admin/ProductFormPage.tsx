import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { createProductSchema, type CreateProductFormData, type ProductVariantFormData } from "@/validations/product.validation";
import { generateSlug } from "@/utils/generateSlug";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/router/routes.const";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/categoryService";
import { productService } from "@/services/productService";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";

export function ProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [variants, setVariants] = useState<ProductVariantFormData[]>([
    { sku: "", color: "", size: "", price: 0, originalPrice: 0, stockQuantity: 0 },
  ]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
  });

  const { data: existingProduct } = useQuery({
    queryKey: ["products", "detail", id],
    queryFn: () => productService.getProductBySlug(id!),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      categoryId: 0,
      brandId: 0,
      tags: "",
      isFlashSale: false,
    },
  });

  useEffect(() => {
    if (existingProduct) {
      setValue("name", existingProduct.name);
      setValue("shortDescription", existingProduct.shortDescription);
      setValue("description", existingProduct.description);
      setValue("categoryId", existingProduct.categoryId);
      setValue("brandId", existingProduct.brandId);
      setValue("tags", existingProduct.tags.join(", "));
      setValue("isFlashSale", existingProduct.isFlashSale);
      setValue("flashSaleEndAt", existingProduct.flashSaleEndAt ?? "");
      setVariants(
        existingProduct.variants.map((v) => ({
          sku: v.sku,
          color: v.color ?? "",
          size: v.size ?? "",
          price: v.price,
          originalPrice: v.originalPrice,
          stockQuantity: v.stockQuantity,
        })),
      );
    }
  }, [existingProduct, setValue]);

  const productName = watch("name");
  const slug = generateSlug(productName || "");

  const addVariant = useCallback(() => {
    setVariants((prev) => [
      ...prev,
      { sku: "", color: "", size: "", price: 0, originalPrice: 0, stockQuantity: 0 },
    ]);
  }, []);

  const removeVariant = useCallback((index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateVariant = useCallback((index: number, field: keyof ProductVariantFormData, value: string | number) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  }, []);

  const onSubmit = async (_data: CreateProductFormData) => {
    try {
      toast.success(isEdit ? "Cập nhật sản phẩm thành công!" : "Tạo sản phẩm thành công!");
      navigate(ROUTES.ADMIN_PRODUCTS);
    } catch {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={ROUTES.ADMIN_PRODUCTS}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="text-2xl font-bold text-zinc-900">
          {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="basic">
          <TabsList>
            <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
            <TabsTrigger value="variants">Biến thể</TabsTrigger>
            <TabsTrigger value="images">Hình ảnh</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Thông tin sản phẩm</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên sản phẩm</Label>
                    <Input id="name" placeholder="Nhập tên sản phẩm" {...register("name")} />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input value={slug} placeholder="tu-dong-tao" disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Mô tả ngắn</Label>
                  <Input id="shortDescription" placeholder="Mô tả ngắn gọn..." {...register("shortDescription")} />
                  {errors.shortDescription && <p className="text-xs text-red-500">{errors.shortDescription.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả chi tiết</Label>
                  <Textarea id="description" rows={5} placeholder="Mô tả chi tiết sản phẩm..." {...register("description")} />
                  {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Danh mục</Label>
                    <select
                      id="categoryId"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                      {...register("categoryId", { valueAsNumber: true })}
                    >
                      <option value={0}>Chọn danh mục</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brandId">Thương hiệu</Label>
                    <Input id="brandId" type="number" placeholder="ID thương hiệu" {...register("brandId", { valueAsNumber: true })} />
                    {errors.brandId && <p className="text-xs text-red-500">{errors.brandId.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input id="tags" placeholder="tag1, tag2, tag3" {...register("tags")} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variants">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Danh sách biến thể</CardTitle>
                <Button type="button" size="sm" className="bg-teal-500 hover:bg-teal-600" onClick={addVariant}>
                  <Plus className="mr-1 h-4 w-4" /> Thêm biến thể
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={index} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-700">Biến thể {index + 1}</span>
                      {variants.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-1">
                        <Label className="text-xs">SKU</Label>
                        <Input
                          value={variant.sku}
                          onChange={(e) => updateVariant(index, "sku", e.target.value)}
                          placeholder="SKU-001"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Màu sắc</Label>
                        <Input
                          value={variant.color}
                          onChange={(e) => updateVariant(index, "color", e.target.value)}
                          placeholder="Đen"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Kích thước</Label>
                        <Input
                          value={variant.size}
                          onChange={(e) => updateVariant(index, "size", e.target.value)}
                          placeholder="M"
                        />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Giá bán (VNĐ)</Label>
                        <Input
                          type="number"
                          value={variant.price || ""}
                          onChange={(e) => updateVariant(index, "price", Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Giá gốc (VNĐ)</Label>
                        <Input
                          type="number"
                          value={variant.originalPrice || ""}
                          onChange={(e) => updateVariant(index, "originalPrice", Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Tồn kho</Label>
                        <Input
                          type="number"
                          value={variant.stockQuantity || ""}
                          onChange={(e) => updateVariant(index, "stockQuantity", Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader><CardTitle className="text-base">Hình ảnh sản phẩm</CardTitle></CardHeader>
              <CardContent>
                <div className="flex h-40 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-teal-400">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Kéo thả hoặc click để tải ảnh lên</p>
                    <p className="text-xs text-gray-400">PNG, JPG tối đa 5MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex gap-3">
          <Button type="submit" className="bg-teal-500 hover:bg-teal-600" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Tạo sản phẩm"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to={ROUTES.ADMIN_PRODUCTS}>Hủy</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
