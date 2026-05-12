import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../../hooks/use-auth";
import { assignments, courses, suggestedPrompts } from "../../data/mock";
import { Sparkles, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/ai")({
  head: () => ({
    meta: [
      { title: "AI — Cluck" },
      { name: "description", content: "Chat with Cluck — your AI study sidekick." },
    ],
  }),
  component: AIPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function buildContext() {
  const upcoming = [...assignments]
    .filter((a) => new Date(a.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8)
    .map((a) => `- ${a.date} · ${a.title} (${a.course}, ${a.type})`)
    .join("\n");
  const grades = courses
    .map((c) => `- ${c.name} (${c.teacher}): ${c.grade}% (${c.letter})`)
    .join("\n");
  return `UPCOMING ASSIGNMENTS:\n${upcoming}\n\nCOURSES & GRADES:\n${grades}`;
}

function AIPage() {
  const { user, session } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Load history
  useEffect(() => {
    if (!user) return;
    supabase
      .from("chat_messages")
      .select("role, content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(200)
      .then(({ data }) => {
        if (data) setMessages(data.filter((d) => d.role === "user" || d.role === "assistant") as Msg[]);
        setLoaded(true);
      });
  }, [user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const persist = async (role: "user" | "assistant", content: string) => {
    if (!user) return;
    await supabase.from("chat_messages").insert({ user_id: user.id, role, content });
  };

  const clearHistory = async () => {
    if (!user) return;
    if (!confirm("Clear all chat history?")) return;
    await supabase.from("chat_messages").delete().eq("user_id", user.id);
    setMessages([]);
  };

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || streaming) return;
    const userMsg: Msg = { role: "user", content: t };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setStreaming(true);
    persist("user", t);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          context: buildContext(),
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) toast.error("Rate limit reached. Try again shortly.");
        else if (resp.status === 402) toast.error("AI credits exhausted.");
        else toast.error("Couldn't reach the AI.");
        setStreaming(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let assistant = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: assistant };
                return copy;
              });
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
      if (assistant) persist("assistant", assistant);
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong.");
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-6 pt-6 pb-4">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> AI Sidekick
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Cluck</h1>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-soft">
        {!loaded ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Sparkles className="mb-3 h-8 w-8 text-brand" />
            <h2 className="font-display text-2xl font-semibold">Ready when you are.</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              I know your assignments and grades. Ask me to plan your week, summarize, or quiz you.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.content || (streaming && i === messages.length - 1 ? "…" : "")}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {messages.length === 0 && loaded && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestedPrompts.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="mt-3 flex items-center gap-2 rounded-full border border-border bg-card p-1.5 pl-5 shadow-soft focus-within:ring-2 focus-within:ring-ring/40"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything…"
          disabled={streaming}
          className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
        />
        <button
          type="submit"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          disabled={!input.trim() || streaming}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
