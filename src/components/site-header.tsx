import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-4">
        <div className="glass rounded-full flex items-center justify-between px-5 py-2.5 shadow-soft">
          <Link to="/" className="flex items-center gap-2">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-coral shadow-glow">
              <Heart className="h-4 w-4 text-white" strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">Bond</span>
            <span className="hidden sm:inline text-xs text-muted-foreground ml-1">/ Laço</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="/#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="/#circles" className="hover:text-foreground transition-colors">Circles</a>
            <a href="/#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <Link to="/app" className="hover:text-foreground transition-colors">Open app</Link>
          </nav>
          <Link
            to="/app"
            className="rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get early access
          </Link>
        </div>
      </div>
    </header>
  );
}
