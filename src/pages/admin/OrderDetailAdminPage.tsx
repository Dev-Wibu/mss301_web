import { OrderStatusBadge } from "@/components/common/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { orderService } from "@/services/orderService";
import { formatDate } from "@/utils/formatDate";
import { formatVND } from "@/utils/formatPrice";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export function OrderDetailAdminPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading } = useQuery({
    queryKey: ["admin", "order", orderId],
    queryFn: () => orderService.getOrderById(Number(orderId)),
    enabled: !!orderId,
  });

  if (isLoading) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => (<div key={i} className="h-32 animate-pulse rounded-lg bg-gray-200" />))}</div>;
  }

  if (!order) return <p className="text-gray-500">Đơn hàng không tồn tại</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link to="/admin/orders"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{order.orderCode}</h1>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Sản phẩm</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.thumbnailUrl} alt={item.productName} className="h-14 w-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900">{item.productName}</p>
                    <p className="text-xs text-gray-400">{item.variantLabel} × {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">{formatVND(item.subtotal)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Lịch sử trạng thái</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {order.statusHistory.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-teal-500" />
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{h.note}</p>
                    <p className="text-xs text-gray-400">{formatDate(h.timestamp)}{h.updatedBy && ` · ${h.updatedBy}`}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Thông tin giao hàng</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p className="font-medium">{order.shippingInfo.recipientName}</p>
              <p className="text-gray-500">{order.shippingInfo.phone}</p>
              <p className="mt-1 text-gray-500">{order.shippingInfo.streetAddress}, {order.shippingInfo.ward}, {order.shippingInfo.district}, {order.shippingInfo.province}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Thanh toán</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Phương thức</span><span className="uppercase">{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tạm tính</span><span>{formatVND(order.subtotal)}</span></div>
              {order.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Giảm giá</span><span>-{formatVND(order.discountAmount)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Phí ship</span><span>{order.shippingFee === 0 ? "Miễn phí" : formatVND(order.shippingFee)}</span></div>
              <Separator />
              <div className="flex justify-between font-bold"><span>Tổng cộng</span><span>{formatVND(order.total)}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
