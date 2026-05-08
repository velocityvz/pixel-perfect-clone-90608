import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { starterMessages, suggestedPrompts } from "../data/mock";

export const Route = createFileRoute("/drumstick")({
  head: () => ({
    meta: [
      { title: "Cluck AI — Your study sidekick" },
      { name: "description", content: "Chat with Cluck for summaries, study plans, quizzes, and gentle nudges." },
      { property: "og:title", content: "Cluck AI — Your study sidekick" },
      { property: "og:description", content: "An AI study assistant built for students." },
    ],
  }),
  component: CluckPage,
});

type Msg = { role: "user" | "ai"; text: string };

function CluckPage() {
  const [messages, setMessages] = useState<Msg[]>(starterMessages);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text:
            "I'm a UI preview right now — once Cluck's brain is wired up, I'll give you a real answer here. (You asked: " +
            t +
            ")",
        },
      ]);
    }, 500);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-6 pt-6 pb-4">
      <div className="mb-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Cluck</h1>
        <p className="text-sm text-muted-foreground">Ready when you are.</p>
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}
              >
                {m.role === "ai" && (
                  <span className="mr-2 inline-block align-middle text-base">🐔</span>
                )}
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>

      {messages.length <= 1 && (
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
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex items-center gap-2 rounded-full border border-border bg-card p-1.5 pl-5 shadow-soft focus-within:ring-2 focus-within:ring-ring/40"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything…"
          className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          disabled={!input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
