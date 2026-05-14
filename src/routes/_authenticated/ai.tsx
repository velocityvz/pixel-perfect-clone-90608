import { createFileRoute } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../../hooks/use-auth";
import { assignments, courses, suggestedPrompts } from "../../data/mock";
import { Sparkles, Send, Trash2, Copy, Check, User, ExternalLink, ClipboardCopy } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SAFE_PROTOCOLS = ["http:", "https:", "mailto:", "tel:"];
function sanitizeHref(href: string | undefined): string | null {
  if (!href) return null;
  try {
    const u = new URL(href, window.location.origin);
    return SAFE_PROTOCOLS.includes(u.protocol) ? u.toString() : null;
  } catch {
    if (href.startsWith("/") || href.startsWith("#")) return href;
    return null;
  }
}

function extractCodeBlocks(md: string): string[] {
  const blocks: string[] = [];
  const re = /```[^\n]*\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) blocks.push(m[1].replace(/\n$/, ""));
  return blocks;
}

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

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

type CopyState = "idle" | "copied" | "error";

function InlineCode({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CopyState>("idle");
  const text = String(children);
  const handle = async () => {
    const ok = await copyToClipboard(text);
    setState(ok ? "copied" : "error");
    if (!ok) toast.error("Couldn't copy to clipboard");
    setTimeout(() => setState("idle"), 1200);
  };
  return (
    <code
      onClick={handle}
      title={state === "copied" ? "Copied!" : "Click to copy"}
      className={`cursor-pointer rounded px-1.5 py-0.5 font-mono text-[0.85em] transition-colors ${
        state === "copied"
          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
          : state === "error"
          ? "bg-destructive/20 text-destructive"
          : "bg-gradient-to-r from-fuchsia-500/15 to-sky-500/15 text-foreground hover:from-fuchsia-500/25 hover:to-sky-500/25"
      }`}
    >
      {children}
    </code>
  );
}

function CodeBlock({ inline, className, children }: any) {
  const [state, setState] = useState<CopyState>("idle");
  const text = String(children).replace(/\n$/, "");
  const lang = /language-(\w+)/.exec(className || "")?.[1];

  if (inline) return <InlineCode>{children}</InlineCode>;

  const handle = async () => {
    const ok = await copyToClipboard(text);
    setState(ok ? "copied" : "error");
    if (!ok) toast.error("Couldn't copy to clipboard");
    setTimeout(() => setState("idle"), 1500);
  };

  return (
    <div className="group relative my-3 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#1a1033] via-[#0f1228] to-[#0b1020] shadow-soft">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={handle}
          className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] transition-colors ${
            state === "copied"
              ? "text-emerald-300"
              : state === "error"
              ? "text-rose-300"
              : "text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          {state === "copied" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {state === "copied" ? "Copied" : state === "error" ? "Failed" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-white/90">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

function MdLink({ href, children }: any) {
  const external = /^https?:\/\//i.test(href || "");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}
      className="bg-gradient-to-r from-fuchsia-500 via-rose-500 to-amber-500 bg-clip-text font-medium text-transparent underline decoration-rose-400/40 decoration-1 underline-offset-2 transition-all hover:decoration-rose-400"
    >
      {children}
    </a>
  );
}

function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-p:my-2 prose-p:leading-relaxed prose-li:my-0.5 prose-strong:text-foreground prose-blockquote:border-l-rose-400 prose-blockquote:bg-gradient-to-r prose-blockquote:from-fuchsia-500/5 prose-blockquote:to-amber-500/5 prose-blockquote:py-1 prose-blockquote:not-italic prose-hr:border-border prose-table:text-xs prose-th:border-border prose-td:border-border">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock as any,
          pre: ({ children }) => <>{children}</>,
          a: MdLink,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}


function AIPage() {
  const { user, session } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [input]);

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

  const greeting = user?.email?.split("@")[0] ?? "there";

  return (
    <div className="relative mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 pt-6 pb-4 sm:px-6">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400 shadow-[0_0_24px_-4px_rgb(244_114_182/0.6)]">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl leading-none tracking-tight">Cluck AI</h1>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Your study sidekick</p>
          </div>
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pr-1">
        {!loaded ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h2 className="bg-gradient-to-r from-fuchsia-500 via-rose-500 to-amber-500 bg-clip-text font-display text-4xl font-semibold text-transparent sm:text-5xl">
              Hello, {greeting}.
            </h2>
            <p className="mt-2 font-display text-2xl text-muted-foreground sm:text-3xl">
              How can I help you today?
            </p>
          </div>
        ) : (
          <div className="space-y-6 pb-2">
            {messages.map((m, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    m.role === "user"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400 text-white shadow-[0_0_18px_-4px_rgb(244_114_182/0.6)]"
                  }`}
                >
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="mb-1 text-xs font-medium text-muted-foreground">
                    {m.role === "user" ? "You" : "Cluck"}
                  </div>
                  {m.role === "assistant" ? (
                    m.content ? (
                      <Markdown>{m.content}</Markdown>
                    ) : (
                      <div className="flex gap-1 pt-2">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-fuchsia-500 [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-rose-500 [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-amber-500" />
                      </div>
                    )
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{m.content}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {messages.length === 0 && loaded && (
        <div className="mb-3 grid gap-2 sm:grid-cols-2">
          {suggestedPrompts.slice(0, 4).map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-3 text-left text-sm text-foreground transition-all hover:-translate-y-0.5 hover:border-transparent hover:shadow-card"
            >
              <span className="absolute inset-0 -z-10 bg-gradient-to-br from-fuchsia-500/0 via-rose-500/0 to-amber-400/0 opacity-0 transition-opacity group-hover:from-fuchsia-500/10 group-hover:via-rose-500/10 group-hover:to-amber-400/10 group-hover:opacity-100" />
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="relative rounded-3xl p-[1.5px] shadow-soft focus-within:bg-gradient-to-r focus-within:from-fuchsia-500 focus-within:via-rose-500 focus-within:to-amber-400"
      >
        <div className="flex items-end gap-2 rounded-[calc(1.5rem-1px)] border border-border bg-card px-4 py-2">
          <textarea
            ref={taRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder="Ask Cluck anything…"
            disabled={streaming}
            className="flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
          />
          <button
            type="submit"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400 text-white shadow-[0_0_18px_-4px_rgb(244_114_182/0.6)] transition-transform hover:scale-105 disabled:scale-100 disabled:opacity-40"
            disabled={!input.trim() || streaming}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Cluck can make mistakes. Double-check important info.
      </p>
    </div>
  );
}
