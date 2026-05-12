import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { assignments, courses } from "../../data/mock";
import { useAuth } from "../../hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Sparkles, CalendarDays, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Drumstick" },
      { name: "description", content: "Your assignments, grades, and AI sidekick at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle().then(({ data }) => {
      setName(data?.display_name ?? user.email?.split("@")[0] ?? "");
    });
  }, [user]);

  const upcoming = [...assignments]
    .filter((a) => new Date(a.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);
  const overdue = assignments.filter((a) => new Date(a.date) < new Date(new Date().toDateString())).length;
  const avg = Math.round(courses.reduce((s, c) => s + c.grade, 0) / courses.length);
  const gpa = (avg / 25).toFixed(2);
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="mx-auto max-w-6xl px-6 pt-10 pb-16">
      {/* Greeting */}
      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{greeting},</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {name || "Friend"}
            <span className="text-brand">.</span>
          </h1>
          <p className="mt-2 -rotate-1 font-script text-2xl text-brand">Don't wing it.</p>
        </div>
        <Link
          to="/ai"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
        >
          <Sparkles className="h-4 w-4" /> Ask Drumstick
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="GPA" value={gpa} hint="Weighted average" accent="oklch(0.7 0.16 28)" />
        <StatCard label="Due this week" value={String(upcoming.length)} hint={overdue ? `${overdue} past due` : "Nothing overdue"} accent="oklch(0.75 0.14 80)" />
        <StatCard label="Classes" value={String(courses.length)} hint="Enrolled" accent="oklch(0.7 0.12 200)" />
      </div>

      {/* Two column */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Up next */}
        <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" /> Up next
              </div>
              <h2 className="mt-1 font-display text-2xl font-semibold">This week's lineup</h2>
            </div>
            <Link to="/calendar" className="text-sm font-medium text-brand hover:underline">
              Calendar →
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {upcoming.map((a) => {
              const d = new Date(a.date);
              const days = Math.round((d.getTime() - new Date(new Date().toDateString()).getTime()) / 86400000);
              return (
                <li key={a.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex w-14 flex-col items-center rounded-xl bg-muted py-2">
                      <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                        {d.toLocaleDateString(undefined, { month: "short" })}
                      </span>
                      <span className="font-display text-xl leading-none">{d.getDate()}</span>
                    </div>
                    <div>
                      <p className="font-medium">{a.title}</p>
                      <p className="text-sm text-muted-foreground">{a.course} · {a.type}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${days <= 1 ? "text-brand" : "text-muted-foreground"}`}>
                    {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Grades + AI prompt */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5" /> Grades
            </div>
            <h2 className="mt-1 font-display text-2xl font-semibold">Where you stand</h2>
            <ul className="mt-4 space-y-3">
              {courses.slice(0, 4).map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm">{c.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${c.grade}%` }} />
                    </div>
                    <span className="w-10 text-right text-sm font-semibold">{c.grade}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/grades" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              All grades <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <Link
            to="/ai"
            className="block overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand/10 via-card to-card p-7 shadow-soft transition-transform hover:-translate-y-1"
          >
            <Sparkles className="h-5 w-5 text-brand" />
            <h3 className="mt-3 font-display text-xl font-semibold">Need a hand?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask Drumstick to summarize a chapter, plan tonight's study session, or quiz you.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
              Open chat <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint, accent }: { label: string; value: string; hint: string; accent: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-6 shadow-card backdrop-blur transition-transform hover:-translate-y-1">
      <div aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-5xl font-semibold leading-none tracking-tight">{value}</p>
      <p className="mt-3 text-xs text-muted-foreground">{hint}</p>
      <div aria-hidden className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40" style={{ background: accent }} />
    </div>
  );
}
