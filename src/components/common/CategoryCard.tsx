import type { Category } from "@/interfaces/product.types";
import { Gamepad2, HardDrive, Headphones, Home, Laptop, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  category: Category;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  Laptop,
  Headphones,
  Home,
  Gamepad2,
  HardDrive,
};

export function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon] || Smartphone;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="flex flex-col items-center gap-3 rounded-xl p-4 transition-colors hover:bg-sky-50">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
        <IconComponent className="h-7 w-7 text-teal-500" />
      </div>
      <span className="text-center text-sm font-medium text-zinc-900">{category.name}</span>
    </Link>
  );
}
