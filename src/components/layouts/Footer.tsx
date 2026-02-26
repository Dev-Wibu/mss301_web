export function Footer() {
  return (
    <footer className="bg-background border-t py-6">
      <div className="text-muted-foreground container mx-auto px-4 text-center text-sm">
        &copy; {new Date().getFullYear()} MSS301. All rights reserved.
      </div>
    </footer>
  );
}
