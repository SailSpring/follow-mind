import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { Send, Menu, X, ArrowLeft } from "lucide-react";
import { Master, Message } from "../types";
import { cn } from "../lib/utils";

interface ChatInterfaceProps {
  master: Master;
  onBack: () => void;
}

export default function ChatInterface({ master, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `你好，我是${master.name}。我感受到了你的困惑。${master.bio} 让我们聊聊吧。`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          masterName: master.name,
          masterBio: master.bio,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "对话失败，请稍后再试。");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: `抱歉，智者正在沉思或暂不可得。错误信息: ${error.message}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="p-6 flex items-center gap-4 border-b border-paper bg-white relative z-10">
        <button onClick={onBack} className="p-2 hover:bg-paper rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-ink/60" />
        </button>
        <div className="w-12 h-12 rounded-full overflow-hidden bg-paper border border-ink/5">
          <img src={master.avatar} alt={master.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink">{master.name}</h2>
          <p className="text-xs text-ink/40 uppercase tracking-widest">{master.title}</p>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 bg-paper/30 relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none flex items-center justify-center overflow-hidden">
          <div className="text-[20rem] font-serif calligraphy rotate-12">心</div>
        </div>

        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, scale: 0.9, rotate: msg.role === "user" ? 1 : -1 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className={cn(
                "flex flex-col max-w-[85%] relative z-10",
                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div
                className={cn(
                  "px-6 py-4 rounded-3xl text-lg leading-relaxed shadow-lg transition-transform",
                  msg.role === "user"
                    ? "bg-ink text-paper rounded-tr-none shadow-black/10"
                    : "bg-white text-ink rounded-tl-none border border-black/5 shadow-black/5"
                )}
              >
                <div className="markdown-content">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {msg.role === "assistant" && (
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: master.themeColor }} />
                )}
                <span className="text-[10px] text-ink/30 uppercase font-bold tracking-widest">
                  {msg.role === "user" ? "你" : master.name}
                </span>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mr-auto items-start flex flex-col"
            >
              <div className="px-6 py-4 rounded-3xl bg-white border border-black/5 rounded-tl-none shadow-sm">
                <div className="flex gap-2">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3],
                        backgroundColor: [master.themeColor, "#000", master.themeColor]
                      }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                      className="w-2 h-2 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-paper">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="与智者对话..."
            className="flex-1 px-6 py-4 bg-paper rounded-2xl border-none focus:ring-2 focus:ring-ink/10 text-lg placeholder:text-ink/20"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-14 h-14 flex items-center justify-center bg-ink text-paper rounded-2xl transition-all hover:bg-ink/90 active:scale-95 disabled:opacity-20"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}
