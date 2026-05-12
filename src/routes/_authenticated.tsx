import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/use-auth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthGate,
});

function AuthGate() {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }
  if (!session) return <Navigate to="/auth" replace />;
  return <Outlet />;
}
