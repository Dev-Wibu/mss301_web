import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { promotionService } from "@/services/promotionService";
import { formatDate } from "@/utils/formatDate";
import { formatVND } from "@/utils/formatPrice";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

export function PromotionManagerPage() {
  const { data: vouchers } = useQuery({ queryKey: ["vouchers"], queryFn: promotionService.getVouchers });
  const { data: flashSales } = useQuery({ queryKey: ["flash-sales"], queryFn: promotionService.getFlashSales });
  const { data: promotions } = useQuery({ queryKey: ["promotions"], queryFn: promotionService.getPromotions });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Quản lý khuyến mãi</h1>
        <Button className="bg-teal-500 hover:bg-teal-600"><Plus className="mr-2 h-4 w-4" /> Tạo mới</Button>
      </div>

      <Tabs defaultValue="vouchers">
        <TabsList><TabsTrigger value="vouchers">Voucher</TabsTrigger><TabsTrigger value="flash-sales">Flash Sale</TabsTrigger><TabsTrigger value="promotions">Khuyến mãi</TabsTrigger></TabsList>

        <TabsContent value="vouchers">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Mã</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Loại</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Giá trị</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Sử dụng</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Hết hạn</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Trạng thái</th>
                </tr></thead>
                <tbody>
                  {vouchers?.map((v) => (
                    <tr key={v.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-medium">{v.code}</td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{v.type.replace("_", " ")}</td>
                      <td className="px-4 py-3">{v.type === "fixed_amount" ? formatVND(v.discountValue) : `${v.discountValue}%`}</td>
                      <td className="px-4 py-3">{v.usedCount}/{v.usageLimit}</td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(v.expiresAt)}</td>
                      <td className="px-4 py-3"><Badge className={v.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>{v.isActive ? "Hoạt động" : "Tắt"}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flash-sales">
          <Card>
            <CardContent className="space-y-4 p-6">
              {flashSales?.map((fs) => (
                <div key={fs.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-zinc-900">{fs.name}</h3>
                    <Badge className={fs.isActive ? "bg-red-400 text-white" : "bg-gray-100 text-gray-500"}>{fs.isActive ? "Đang diễn ra" : "Kết thúc"}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{formatDate(fs.startAt)} - {formatDate(fs.endAt)}</p>
                  <p className="mt-1 text-sm text-gray-600">{fs.products.length} sản phẩm tham gia</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions">
          <Card>
            <CardContent className="space-y-4 p-6">
              {promotions?.map((p) => (
                <div key={p.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-zinc-900">{p.name}</h3>
                    <Badge className={p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>{p.isActive ? "Hoạt động" : "Tắt"}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{p.description}</p>
                  <p className="mt-1 text-xs text-gray-400">{formatDate(p.startAt)} - {formatDate(p.endAt)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
