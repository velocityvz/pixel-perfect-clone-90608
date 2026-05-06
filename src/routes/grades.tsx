import { createFileRoute } from "@tanstack/react-router";
import { courses, courseColor } from "../data/mock";

export const Route = createFileRoute("/grades")({
  head: () => ({
    meta: [
      { title: "Grades — Cluck" },
      { name: "description", content: "Track your class averages, weighted breakdowns, and GPA." },
      { property: "og:title", content: "Grades — Cluck" },
      { property: "og:description", content: "Your grades at a glance." },
    ],
  }),
  component: GradesPage,
});

function GradesPage() {
  const avg = courses.reduce((s, c) => s + c.grade, 0) / courses.length;
  const gpa = (avg / 25).toFixed(2);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Grades</h1>
          <p className="mt-1 text-muted-foreground">Quarter snapshot · {courses.length} classes</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Summary label="Average" value={`${avg.toFixed(1)}%`} />
          <Summary label="GPA (4.0)" value={gpa} />
          <Summary label="Trend" value="▲ +1.2" />
        </div>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {courses.map((c) => (
          <article key={c.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <header className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: courseColor[c.name] ?? "oklch(0.5 0.05 260)" }}
                  />
                  <h2 className="truncate font-display text-xl font-semibold">{c.name}</h2>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{c.teacher}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl font-bold">{c.letter}</p>
                <p className="text-sm text-muted-foreground">{c.grade}%</p>
              </div>
            </header>

            <div className="mt-5 space-y-3">
              {c.categories.map((cat) => (
                <div key={cat.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {cat.name} <span className="text-xs">· {cat.weight}%</span>
                    </span>
                    <span className="font-medium">{cat.score}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${cat.score}%`,
                        background: courseColor[c.name] ?? "oklch(0.5 0.05 260)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 text-center shadow-soft">
      <p className="font-display text-xl font-semibold">{value}</p>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
