import { cn } from "@/lib/utils";
import { LayoutDashboard, Settings, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/users", icon: Users },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const location = useLocation();
  return (
    <aside className="bg-sidebar w-64 overflow-y-auto border-r">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>
      <nav className="space-y-1 px-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              location.pathname === item.href
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
