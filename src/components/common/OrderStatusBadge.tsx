import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/interfaces/order.types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: { label: "Chờ xác nhận", className: "bg-yellow-500 text-white" },
  confirmed: { label: "Đã xác nhận", className: "bg-blue-500 text-white" },
  processing: { label: "Đang xử lý", className: "bg-blue-500 text-white" },
  shipping: { label: "Đang giao hàng", className: "bg-teal-500 text-white" },
  delivered: { label: "Đã giao hàng", className: "bg-green-600 text-white" },
  cancelled: { label: "Đã hủy", className: "bg-gray-400 text-white" },
  return_requested: { label: "Yêu cầu trả hàng", className: "bg-orange-500 text-white" },
  returned: { label: "Đã trả hàng", className: "bg-gray-400 text-white" },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge className={config.className}>{config.label}</Badge>;
}
