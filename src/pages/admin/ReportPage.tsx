import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportService } from "@/services/reportService";
import { formatVND } from "@/utils/formatPrice";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

export function ReportPage() {
  const { data: report } = useQuery({
    queryKey: ["admin", "revenue-report"],
    queryFn: reportService.getRevenueReport,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900">Báo cáo & Thống kê</h1>

      {report && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-lg bg-teal-50 p-3"><DollarSign className="h-6 w-6 text-teal-500" /></div>
                <div>
                  <p className="text-sm text-gray-500">Tổng doanh thu</p>
                  <p className="text-xl font-bold">{formatVND(report.totalRevenue)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-lg bg-blue-50 p-3"><ShoppingCart className="h-6 w-6 text-blue-500" /></div>
                <div>
                  <p className="text-sm text-gray-500">Tổng đơn hàng</p>
                  <p className="text-xl font-bold">{report.totalOrders.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-lg bg-orange-50 p-3"><TrendingUp className="h-6 w-6 text-orange-500" /></div>
                <div>
                  <p className="text-sm text-gray-500">Giá trị TB/đơn</p>
                  <p className="text-xl font-bold">{formatVND(report.averageOrderValue)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Doanh thu 7 ngày qua</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {report.data.map((point) => (
                  <div key={point.date} className="flex items-center gap-4">
                    <span className="w-24 text-sm text-gray-500">{point.date}</span>
                    <div className="flex-1">
                      <div className="h-6 overflow-hidden rounded bg-gray-100">
                        <div
                          className="h-full rounded bg-teal-500"
                          style={{ width: `${(point.revenue / 25000000) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-32 text-right text-sm font-medium">{formatVND(point.revenue)}</span>
                    <span className="w-16 text-right text-xs text-gray-400">{point.orderCount} đơn</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
