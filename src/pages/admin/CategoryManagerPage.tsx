import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categoryService } from "@/services/categoryService";
import { useQuery } from "@tanstack/react-query";
import { FolderTree, Pencil, Plus, Trash2 } from "lucide-react";

export function CategoryManagerPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Quản lý danh mục</h1>
        <Button className="bg-teal-500 hover:bg-teal-600">
          <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Tên danh mục</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Slug</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Số sản phẩm</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}><td colSpan={4} className="px-4 py-3"><div className="h-8 animate-pulse rounded bg-gray-100" /></td></tr>
                  ))
                ) : (
                  categories?.map((cat) => (
                    <tr key={cat.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FolderTree className="h-4 w-4 text-teal-500" />
                          <span className="font-medium text-zinc-900">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                      <td className="px-4 py-3 text-right">{cat.productCount}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
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
