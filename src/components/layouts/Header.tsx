import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="bg-background/95 sticky top-0 z-50 border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold">
          MSS301
        </Link>
        <nav className="flex items-center gap-4">
          {/* Add navigation items here */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
