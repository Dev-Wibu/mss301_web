import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, Shield } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export function UserDetailAdminPage() {
  const { userId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link to="/admin/users"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <h1 className="text-2xl font-bold text-zinc-900">Chi tiết người dùng #{userId}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Thông tin cá nhân</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /><span className="text-sm">user@example.com</span></div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /><span className="text-sm">0901234567</span></div>
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-gray-400" /><Badge variant="outline">customer</Badge></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Thống kê</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Tổng đơn hàng</span><span className="font-medium">15</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Điểm thưởng</span><span className="font-medium">1,250</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Trạng thái</span><Badge className="bg-green-100 text-green-700">Hoạt động</Badge></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
