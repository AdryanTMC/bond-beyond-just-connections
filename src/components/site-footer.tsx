export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl font-semibold">Bond</div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            The social layer for real human connections. Available globally as Bond, and as Laço in Brazil.
          </p>
        </div>
        <div>
          <div className="text-sm font-medium mb-3">Product</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/#features" className="hover:text-foreground">Features</a></li>
            <li><a href="/#circles" className="hover:text-foreground">Inner circles</a></li>
            <li><a href="/#pricing" className="hover:text-foreground">Pricing</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium mb-3">Languages</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>English</li>
            <li>Português (BR)</li>
            <li>Español</li>
            <li>Français</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Bond. Relationships that stay.
      </div>
    </footer>
  );
}
