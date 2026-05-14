import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import WelcomeScreen from "./components/WelcomeScreen";
import ProblemInput from "./components/ProblemInput";
import MatchingAnimation from "./components/MatchingAnimation";
import ChatInterface from "./components/ChatInterface";
import { Master, MatchResult } from "./types";
import { MASTERS } from "./constants";
import { Sparkles } from "lucide-react";

type AppState = "welcome" | "input" | "matching" | "intro" | "chat";

export default function App() {
  const [state, setState] = useState<AppState>("welcome");
  const [currentMaster, setCurrentMaster] = useState<Master | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const handleProblemSubmit = async (problem: string) => {
    setState("matching");
    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });
      const data: MatchResult = await response.json();
      
      const master = MASTERS.find(m => m.name === data.masterName) || MASTERS[0];
      setCurrentMaster(master);
      setMatchResult(data);
      
      // Simulate matching time for better UX
      setTimeout(() => setState("intro"), 2000);
    } catch (error) {
      console.error("Matching error:", error);
      setCurrentMaster(MASTERS[0]);
      setState("intro");
    }
  };

  return (
    <div className="min-h-screen bg-paper overflow-x-hidden">
      <AnimatePresence mode="wait">
        {state === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <WelcomeScreen onStart={() => setState("input")} />
          </motion.div>
        )}

        {state === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <ProblemInput onSubmit={handleProblemSubmit} onBack={() => setState("welcome")} />
          </motion.div>
        )}

        {state === "matching" && (
          <motion.div
            key="matching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MatchingAnimation />
          </motion.div>
        )}

        {state === "intro" && currentMaster && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="min-h-screen flex items-center justify-center p-6"
          >
            <div className="max-w-xl w-full bg-white p-10 rounded-[40px] shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles className="w-24 h-24 text-ink" />
              </div>
              
              <div className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-paper shadow-lg">
                <img src={currentMaster.avatar} alt={currentMaster.name} className="w-full h-full object-cover" />
              </div>
              
              <h2 className="text-4xl calligraphy mb-2 text-ink">{currentMaster.name}</h2>
              <p className="text-xs text-ink/40 uppercase tracking-[0.2em] mb-6">{currentMaster.title}</p>
              
              <div className="bg-paper/50 p-6 rounded-3xl mb-8">
                <p className="text-lg chinese-text text-ink italic leading-relaxed">
                  "{matchResult?.reason || "我愿助你拨云见日，寻得内心安宁。"}"
                </p>
              </div>

              <button
                onClick={() => setState("chat")}
                className="w-full py-4 bg-ink text-paper rounded-2xl font-bold text-xl hover:bg-ink/90 transition-all hover:scale-[1.02]"
              >
                开始倾诉
              </button>
            </div>
          </motion.div>
        )}

        {state === "chat" && currentMaster && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-screen"
          >
            <ChatInterface master={currentMaster} onBack={() => setState("input")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
