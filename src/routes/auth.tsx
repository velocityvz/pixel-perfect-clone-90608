import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import chickenLogo from "../assets/chicken-logo.png";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Drumstick" },
      { name: "description", content: "Sign in or create your Drumstick account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { session, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (session) return <Navigate to="/dashboard" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password, name || email.split("@")[0]);
    setSubmitting(false);
    if (error) {
      toast.error(error);
      return;
    }
    if (mode === "signup") {
      toast.success("Account created. Welcome!");
    }
    navigate({ to: "/dashboard" });
  };

  const google = async () => {
    setSubmitting(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12"
      style={{
        backgroundImage:
          "radial-gradient(60% 50% at 80% 0%, oklch(0.93 0.06 28 / 0.45), transparent 60%), radial-gradient(50% 40% at 0% 10%, oklch(0.9 0.05 80 / 0.6), transparent 60%)",
      }}>
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <img src={chickenLogo} alt="" className="h-14 w-14 object-contain" />
          <h1 className="font-display text-4xl tracking-tight">
            Drumstick<span className="text-brand">.</span>
          </h1>
          <p className="-rotate-2 font-script text-2xl text-brand">Don't wing it.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-card backdrop-blur">
          <div className="mb-5 flex rounded-full bg-muted p-1 text-sm font-medium">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-full px-4 py-2 transition-colors ${mode === "signin" ? "bg-background text-foreground shadow-soft" : "text-muted-foreground"}`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-full px-4 py-2 transition-colors ${mode === "signup" ? "bg-background text-foreground shadow-soft" : "text-muted-foreground"}`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                  placeholder="Alex"
                />
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                placeholder="you@school.edu"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={google}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
          >
            <GoogleIcon /> Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.6 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C41 35.8 44 30.4 44 24c0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}
