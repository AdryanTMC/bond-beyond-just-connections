import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Heart, Home, Compass, MessageCircle, User, Crown, Search, Bell, Plus, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Bond — Your relationships" },
      { name: "description", content: "Your circles, discoveries, conversations and capsules — in one calm place." },
    ],
  }),
  component: AppLayout,
});

const nav = [
  { to: "/app", label: "Home", icon: Home, exact: true },
  { to: "/app/discover", label: "Discover", icon: Compass },
  { to: "/app/messages", label: "Messages", icon: MessageCircle },
  { to: "/app/profile", label: "Profile", icon: User },
  { to: "/app/premium", label: "Premium", icon: Crown },
] as const;

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border/60 min-h-screen p-5 sticky top-0 self-start">
          <Link to="/" className="flex items-center gap-2 mb-9">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-coral shadow-glow">
              <Heart className="h-4 w-4 text-white" strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl font-semibold">Bond</span>
          </Link>

          <nav className="space-y-1 text-sm">
            {nav.map((n) => {
              const active = isActive(n.to, "exact" in n ? n.exact : false);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    active ? "bg-foreground text-background" : "hover:bg-foreground/5 text-foreground/80"
                  }`}
                >
                  <n.icon className="h-4 w-4" strokeWidth={1.75} />
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <Link
            to="/app/premium"
            className="mt-auto rounded-2xl bg-gradient-hero p-4 text-ivory block hover:opacity-95 transition-opacity"
          >
            <div className="flex items-center gap-1.5 text-xs opacity-80"><Sparkles className="h-3 w-3" /> Bond Infinity</div>
            <div className="font-display text-base mt-1">Unlock the full premium</div>
            <div className="mt-3 w-full rounded-full bg-ivory text-midnight text-xs py-2 font-medium text-center">Upgrade</div>
          </Link>
        </aside>

        <main className="flex-1 min-w-0">
          {/* Topbar */}
          <div className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
            <div className="px-4 sm:px-6 lg:px-10 py-3.5 flex items-center gap-3">
              <div className="flex-1 max-w-md flex items-center gap-2 rounded-full bg-muted px-4 py-2.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search people, memories, moments…"
                  className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
                />
              </div>
              <button className="relative h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-coral" />
              </button>
              <button className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2.5 text-sm font-medium">
                <Plus className="h-4 w-4" /> New bond
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-7xl pb-28 lg:pb-10">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="grid grid-cols-5">
          {nav.map((n) => {
            const active = isActive(n.to, "exact" in n ? n.exact : false);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <n.icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}