import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, ArrowLeft } from "lucide-react";

interface ProblemInputProps {
  onSubmit: (problem: string) => void;
  onBack: () => void;
}

export default function ProblemInput({ onSubmit, onBack }: ProblemInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-xl bg-white p-8 rounded-3xl shadow-xl shadow-black/5"
      >
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-ink/40 hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">返回</span>
        </button>

        <h2 className="text-3xl chinese-text mb-6 font-bold text-ink">
          此刻，你遇到了什么困惑？
        </h2>
        <p className="text-ink/60 mb-8 leading-relaxed">
          无论是关于生活、工作还是内心的低谷，请尽情诉说。我们将为你引荐最合适的智者。
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="在这里输入你的心情或问题..."
              className="w-full h-40 p-6 bg-paper rounded-2xl border-none focus:ring-2 focus:ring-ink/10 resize-none text-lg text-ink placeholder:text-ink/20"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full py-4 bg-ink text-paper rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-ink/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <span>寻访智者</span>
            <Send className="w-5 h-5" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
