import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/calendar", label: "Calendar" },
  { to: "/cluck", label: "Cluck" },
  { to: "/grades", label: "Grades" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-brand-foreground font-display text-lg font-bold">
            C
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Cluck<span className="text-brand">.</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 rounded-full border border-border/60 bg-card/60 p-1 shadow-soft">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
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
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-muted-foreground sm:flex-row">
        <p>
          <span className="font-display text-base text-foreground">Cluck</span> — a calmer way to study.
        </p>
        <p>© {new Date().getFullYear()} Cluck AI. Mock UI.</p>
      </div>
    </footer>
  );
}
