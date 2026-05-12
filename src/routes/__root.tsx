import { Outlet, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { Header, Footer } from "../components/Header";
import { AuthProvider } from "../hooks/use-auth";
import { Toaster } from "../components/ui/sonner";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Drumstick — Your AI study sidekick" },
      { name: "description", content: "Drumstick keeps your assignments, grades, and an AI tutor in one quiet place." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Caveat:wght@500;700&family=Permanent+Marker&family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-7xl">404</h1>
        <p className="mt-2 text-muted-foreground">That page flew the coop.</p>
      </div>
    </div>
  ),
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Shell />
      <Toaster />
    </AuthProvider>
  );
}

function Shell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const hideChrome = path === "/auth" || path === "/";
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {!hideChrome && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}
