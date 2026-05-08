import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Header, Footer } from "../components/Header";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page flew the coop.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Cluck — Your AI study sidekick" },
      { name: "description", content: "Cluck helps students stay organized, plan study time, and crush tests with an AI assistant, calendar, and grade tracker." },
      { property: "og:title", content: "Cluck — Your AI study sidekick" },
      { name: "twitter:title", content: "Cluck — Your AI study sidekick" },
      { property: "og:description", content: "Cluck helps students stay organized, plan study time, and crush tests with an AI assistant, calendar, and grade tracker." },
      { name: "twitter:description", content: "Cluck helps students stay organized, plan study time, and crush tests with an AI assistant, calendar, and grade tracker." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/94ab6afa-7cac-464d-9586-58616fb7dc5a/id-preview-50b25303--6664ae2e-ac5d-450a-be5d-aa50a7cab06a.lovable.app-1778083839513.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/94ab6afa-7cac-464d-9586-58616fb7dc5a/id-preview-50b25303--6664ae2e-ac5d-450a-be5d-aa50a7cab06a.lovable.app-1778083839513.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
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
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
