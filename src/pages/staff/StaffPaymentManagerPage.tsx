import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { orderService } from "@/services/orderService";
import { formatDate } from "@/utils/formatDate";
import { formatVND } from "@/utils/formatPrice";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function StaffPaymentManagerPage() {
  const { data } = useQuery({
    queryKey: ["staff", "payments"],
    queryFn: () => orderService.getAllOrders(),
  });

  const handleConfirmCOD = (orderCode: string) => {
    toast.success(`Đã xác nhận thanh toán COD cho đơn ${orderCode}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900">Quản lý thanh toán</h1>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Mã đơn</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Khách hàng</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Phương thức</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Số tiền</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Trạng thái</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Ngày</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-zinc-900">{order.orderCode}</td>
                    <td className="px-4 py-3 text-gray-600">{order.shippingInfo.recipientName}</td>
                    <td className="px-4 py-3 uppercase text-gray-600">{order.paymentMethod}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatVND(order.total)}</td>
                    <td className="px-4 py-3">
                      <Badge className={
                        order.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                        order.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-700" :
                        order.paymentStatus === "refunded" ? "bg-gray-100 text-gray-500" :
                        "bg-red-100 text-red-700"
                      }>
                        {order.paymentStatus === "paid" ? "Đã thanh toán" :
                         order.paymentStatus === "pending" ? "Chờ thanh toán" :
                         order.paymentStatus === "refunded" ? "Đã hoàn tiền" : "Thất bại"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {order.paymentMethod === "cod" && order.paymentStatus === "pending" && (
                        <Button size="sm" variant="outline" onClick={() => handleConfirmCOD(order.orderCode)}>
                          Xác nhận nhận tiền
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
