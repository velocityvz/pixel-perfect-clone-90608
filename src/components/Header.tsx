import { Link, useNavigate } from "@tanstack/react-router";
import chickenLogo from "../assets/chicken-logo.png";
import { useAuth } from "../hooks/use-auth";
import { LogOut } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/calendar", label: "Calendar" },
  { to: "/ai", label: "AI" },
  { to: "/grades", label: "Grades" },
] as const;

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/auth" });
  };
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <img src={chickenLogo} alt="Drumstick" width={40} height={40} className="h-10 w-10 object-contain" />
          <span className="font-display text-2xl tracking-tight leading-none">
            Drumstick<span className="text-brand">.</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/60 p-1 shadow-soft md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{
                className:
                  "rounded-full px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground shadow-soft",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        {user && (
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 py-8">
      <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
        <span className="font-display text-base text-foreground">Drumstick</span> — don't wing it.
      </div>
    </footer>
  );
}
