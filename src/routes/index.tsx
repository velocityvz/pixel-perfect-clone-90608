import { createFileRoute, Link } from "@tanstack/react-router";
import { assignments, courses } from "../data/mock";
import chickenLogo from "../assets/chicken-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cluck — Your AI study sidekick" },
      { name: "description", content: "Plan smarter, study calmer. Cluck brings your assignments, grades, and an AI tutor into one tidy place." },
      { property: "og:title", content: "Cluck — Your AI study sidekick" },
      { property: "og:description", content: "Plan smarter, study calmer with Cluck." },
    ],
  }),
  component: Index,
});

function Index() {
  const upcoming = [...assignments]
    .filter((a) => new Date(a.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);
  const avg = Math.round(courses.reduce((s, c) => s + c.grade, 0) / courses.length);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 80% 0%, oklch(0.93 0.06 28 / 0.45), transparent 60%), radial-gradient(50% 40% at 0% 10%, oklch(0.9 0.05 80 / 0.6), transparent 60%)",
          }}
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-20 pb-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Built for high-school students
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Study calmer. <br />
              <span className="text-brand">Crush more.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Cluck pulls your assignments, tests, and grades into one quiet
              place — then nudges you with a friendly AI sidekick when it's time
              to lock in.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/drumstick"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
              >
                Talk to Cluck →
              </Link>
              <Link
                to="/calendar"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                See this week
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] opacity-60 blur-2xl"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.9 0.08 28 / 0.5), oklch(0.92 0.07 80 / 0.4))",
              }}
            />
            <div className="grid gap-4">
              <StatCard label="GPA" value={(avg / 25).toFixed(2)} hint="Weighted avg" accent="oklch(0.7 0.16 28)" />
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Due soon" value={String(upcoming.length)} hint="This week" accent="oklch(0.75 0.14 80)" />
                <StatCard label="Classes" value={String(courses.length)} hint="Enrolled" accent="oklch(0.7 0.12 200)" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you'd hope for, nothing you don't.
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Four small tools, working together — so school stops feeling like 47 open tabs.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Feature title="Smart calendar" body="See every assignment and test laid out clearly. No more last-minute surprises." />
          <Feature title="AI summaries" body="Cluck distills chapters, lectures, and notes into the parts that actually matter." />
          <Feature title="Gentle reminders" body="A nudge the night before — never a guilt trip." />
          <Feature title="Live grades" body="Watch your average move in real time as scores roll in." />
        </div>
      </section>

      {/* Up next */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-semibold">Up next</h3>
              <p className="text-sm text-muted-foreground">A peek at what's coming.</p>
            </div>
            <Link to="/calendar" className="text-sm font-medium text-brand hover:underline">
              Full calendar →
            </Link>
          </div>
          <ul className="mt-6 divide-y divide-border">
            {upcoming.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.course} · {a.type}</p>
                </div>
                <time className="text-sm text-muted-foreground">
                  {new Date(a.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                </time>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, hint, accent }: { label: string; value: string; hint: string; accent: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-6 shadow-card backdrop-blur transition-transform hover:-translate-y-1">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: accent }}
      />
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-5xl font-semibold leading-none tracking-tight">{value}</p>
      <p className="mt-3 text-xs text-muted-foreground">{hint}</p>
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        style={{ background: accent }}
      />
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-transform hover:-translate-y-1">
      <div className="mb-4 h-1 w-8 rounded-full bg-brand" />
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
