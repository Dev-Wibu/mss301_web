import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { userService } from "@/services/userService";
import { formatDate } from "@/utils/formatDate";
import { useQuery } from "@tanstack/react-query";
import { Eye, Search } from "lucide-react";
import { Link } from "react-router-dom";

export function UserManagerPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: userService.getUsers,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900">Quản lý khách hàng</h1>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Tìm kiếm khách hàng..." className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Tên</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Email</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Vai trò</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Trạng thái</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Ngày tham gia</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-10 animate-pulse rounded bg-gray-100" /></td></tr>
                  ))
                ) : (
                  users?.map((user) => (
                    <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-zinc-900">{user.fullName}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="capitalize">{user.role}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={user.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>
                          {user.isActive ? "Hoạt động" : "Khóa"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link to={`/admin/users/${user.id}`}><Eye className="h-3.5 w-3.5" /></Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
