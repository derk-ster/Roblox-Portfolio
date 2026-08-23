"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Send, X, MessageCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { INITIAL_SUGGESTIONS } from "@/lib/chat-prompt";
import {
  detectScrollTarget,
  isValidScrollTarget,
  scrollToSection,
  type ChatScrollTarget,
} from "@/lib/chat-sections";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AssistantReply {
  message: string;
  scrollTo: ChatScrollTarget | null;
  suggestions: string[];
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function PortfolioChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleScroll = useCallback(
    (scrollTo: ChatScrollTarget | null, messageText: string) => {
      const target =
        scrollTo ?? detectScrollTarget(messageText);
      if (target) {
        setTimeout(() => scrollToSection(target), 400);
      }
    },
    []
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError(null);
      setInput("");
      setSuggestions([]);

      const userMsg: Message = { id: uid(), role: "user", content: trimmed };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Request failed");
        }

        const reply = data as AssistantReply;
        const scrollTarget =
          reply.scrollTo && isValidScrollTarget(reply.scrollTo)
            ? reply.scrollTo
            : null;

        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "assistant", content: reply.message },
        ]);

        if (reply.suggestions?.length) {
          setSuggestions(reply.suggestions);
        }

        handleScroll(scrollTarget, reply.message);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
        setSuggestions(INITIAL_SUGGESTIONS);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, handleScroll]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-4 left-4 z-[90] flex flex-col items-start gap-3 sm:bottom-6 sm:left-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel/95 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:w-80"
            role="dialog"
            aria-label="Portfolio assistant chat"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan/15">
                  <Bot className="h-4 w-4 text-cyan" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">Ask DErk2104</p>
                  <p className="text-[10px] text-muted">Portfolio assistant</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-text"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className="flex max-h-64 flex-col gap-3 overflow-y-auto px-4 py-3 scrollbar-none sm:max-h-72"
            >
              {messages.length === 0 && (
                <p className="text-xs leading-relaxed text-muted">
                  Ask about scripting, animations, commissions, or anything on
                  this site. I&apos;ll keep it short and can jump to sections for
                  you.
                </p>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "max-w-[90%] rounded-xl px-3 py-2 text-xs leading-relaxed sm:text-sm",
                    msg.role === "user"
                      ? "ml-auto bg-cyan/15 text-text"
                      : "mr-auto bg-white/5 text-text/90"
                  )}
                >
                  {msg.content}
                </div>
              ))}

              {loading && (
                <div className="mr-auto flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-muted">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  Thinking…
                </div>
              )}

              {error && (
                <p className="text-xs text-pink" role="alert">
                  {error}
                </p>
              )}
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && !loading && (
              <div className="flex flex-wrap gap-1.5 border-t border-white/6 px-3 py-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-muted transition-colors hover:border-cyan/30 hover:bg-cyan/8 hover:text-cyan sm:text-xs"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 border-t border-white/8 px-3 py-2.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything…"
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent text-sm text-text placeholder:text-muted/60 focus:outline-none disabled:opacity-50"
                aria-label="Chat message"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-lg bg-cyan/15 p-2 text-cyan transition-colors hover:bg-cyan/25 disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 rounded-full border border-cyan/25 bg-panel/90 px-4 py-2.5 text-sm font-medium text-cyan shadow-[0_4px_24px_rgba(56,189,248,0.15)] backdrop-blur-md transition-colors hover:border-cyan/40 hover:bg-cyan/10",
          open && "border-white/15 text-muted hover:text-text"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "AI assistant"}
      >
        {open ? (
          <X className="h-4 w-4" aria-hidden />
        ) : (
          <MessageCircle className="h-4 w-4" aria-hidden />
        )}
        {open ? "Close" : "AI assistant"}
      </motion.button>
    </div>
  );
}
