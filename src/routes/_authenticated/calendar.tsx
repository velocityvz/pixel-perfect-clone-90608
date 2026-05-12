import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { assignments, courseColor } from "../../data/mock";

export const Route = createFileRoute("/_authenticated/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Cluck" },
      { name: "description", content: "Your assignments, tests, and projects laid out in one calm monthly view." },
      { property: "og:title", content: "Calendar — Cluck" },
      { property: "og:description", content: "See every assignment and test in one place." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const { weeks, monthLabel } = useMemo(() => buildMonth(cursor), [cursor]);

  const byDate = useMemo(() => {
    const m = new Map<string, typeof assignments>();
    for (const a of assignments) {
      const arr = m.get(a.date) ?? [];
      arr.push(a);
      m.set(a.date, arr);
    }
    return m;
  }, []);

  const todayISO = new Date().toISOString().slice(0, 10);
  const upcoming = [...assignments]
    .filter((a) => a.date >= todayISO)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Calendar</h1>
          <p className="mt-1 text-muted-foreground">{monthLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
          >
            ←
          </button>
          <button
            onClick={() => {
              const d = new Date();
              setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
            }}
            className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:bg-accent"
          >
            Today
          </button>
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="grid grid-cols-7 border-b border-border bg-muted/60 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="px-2 py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {weeks.flat().map((cell, i) => {
              const items = byDate.get(cell.iso) ?? [];
              const isToday = cell.iso === todayISO;
              return (
                <div
                  key={i}
                  className={`min-h-[96px] border-b border-r border-border p-2 text-left ${
                    cell.outside ? "bg-background/40 text-muted-foreground/60" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${isToday ? "grid h-6 w-6 place-items-center rounded-full bg-brand text-brand-foreground" : ""}`}>
                      {cell.day}
                    </span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {items.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        className="truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium text-white"
                        style={{ background: courseColor[a.course] ?? "oklch(0.5 0.05 260)" }}
                        title={`${a.title} (${a.course})`}
                      >
                        {a.title}
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div className="text-[11px] text-muted-foreground">+{items.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="font-display text-xl font-semibold">Upcoming</h2>
          <ul className="mt-4 space-y-3">
            {upcoming.map((a) => (
              <li key={a.id} className="flex gap-3">
                <span
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: courseColor[a.course] ?? "oklch(0.5 0.05 260)" }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.course} · {new Date(a.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function buildMonth(cursor: Date) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const start = new Date(year, month, 1 - startWeekday);

  const weeks: { day: number; iso: string; outside: boolean }[][] = [];
  for (let w = 0; w < 6; w++) {
    const row: { day: number; iso: string; outside: boolean }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      row.push({
        day: date.getDate(),
        iso: date.toISOString().slice(0, 10),
        outside: date.getMonth() !== month,
      });
    }
    weeks.push(row);
  }

  const monthLabel = first.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  return { weeks, monthLabel };
}
