import { createFileRoute, Link } from "@tanstack/react-router";
import { assignments, courses } from "../data/mock";
import drumstickImg from "../assets/drumstick.png";

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
                to="/cluck"
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

          {/* Mascot card */}
          <div className="relative">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div
                className="flex flex-col items-center justify-center rounded-2xl px-6 py-10 text-center"
                style={{ background: "oklch(0.96 0.04 80)" }}
              >
                <p className="font-display text-5xl font-bold tracking-tight" style={{ color: "oklch(0.55 0.21 28)" }}>
                  DRUMSTICK
                </p>
                <p className="mt-1 text-sm italic text-muted-foreground">"don't wing it."</p>
                <div className="my-6 grid h-32 w-32 place-items-center rounded-full bg-background text-6xl shadow-soft">
                  🐔
                </div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Powered by Cluck AI
                </p>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <Stat label="GPA" value={(avg / 25).toFixed(2)} />
                <Stat label="Due soon" value={String(upcoming.length)} />
                <Stat label="Classes" value={String(courses.length)} />
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted px-3 py-3">
      <p className="font-display text-2xl font-semibold">{value}</p>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
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
