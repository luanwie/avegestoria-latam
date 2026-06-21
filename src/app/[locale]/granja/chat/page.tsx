"use client";

import { useState, useRef, useEffect } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Send, Bot, User, AlertCircle } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 ¡Hola! Soy tu asistente de AveGestoria. Puedo responder preguntas sobre tu granja:\n\n• ¿Cuántos huevos se produjeron ayer?\n• ¿Cuál es mi lucro del mes?\n• ¿Qué lote tiene mejor rendimiento?\n• Dame un resumen de la granja",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setSending(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/granja/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply || "Error al procesar la consulta." },
        ]);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg font-bold text-stone-100 mb-1">Chat IA</h2>
        <p className="text-xs text-stone-500 mb-6">
          Pregunta sobre tu producción, finanzas y rendimiento de la granja
        </p>

        {/* Messages */}
        <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl mb-4">
          <div className="h-[480px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-teal-600/30 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-teal-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-emerald-600/30 text-stone-100"
                      : "bg-emerald-950/60 text-stone-200 border border-emerald-800/30"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-emerald-600/30 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
              </div>
            ))}

            {sending && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-600/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-teal-400" />
                </div>
                <div className="bg-emerald-950/60 border border-emerald-800/30 rounded-xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-stone-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-stone-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-stone-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-rose-900/20 border border-rose-800/30 rounded-lg px-4 py-2 mb-4">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <p className="text-xs text-rose-300">{error}</p>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta sobre la granja..."
            rows={1}
            className="flex-1 bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-4 py-3 text-sm text-stone-200 placeholder-stone-500 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-600/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-stone-600 mt-2 text-center">
          Limitado a 50 preguntas/día · DeepSeek
        </p>
      </div>
    </DashboardShell>
  );
}
