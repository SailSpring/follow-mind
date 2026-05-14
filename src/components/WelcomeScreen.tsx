import { motion } from "motion/react";
import { Sparkles, Heart } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl"
      >
        <div className="mb-8 relative inline-block">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="bg-cinnabar/10 p-4 rounded-full"
          >
            <Heart className="w-16 h-16 text-cinnabar" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-6 h-6 text-amber-500" />
          </motion.div>
        </div>

        <h1 className="text-5xl md:text-6xl calligraphy mb-4 text-ink">
          灵犀心语
        </h1>
        <p className="text-xl chinese-text mb-8 text-ink/70 leading-relaxed">
          在喧嚣的世界中，寻觅一份跨越时空的宁静。<br/>
          让智者之光，照亮你内心的每一个角落。
        </p>

        <button
          onClick={onStart}
          className="group relative px-8 py-4 bg-ink text-paper rounded-full text-lg chinese-text overflow-hidden transition-all hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-cinnabar translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10 font-bold group-hover:text-white transition-colors">
            开启心灵之旅
          </span>
        </button>
      </motion.div>

      <div className="absolute bottom-10 flex gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
        {/* Subtle decorative elements */}
        <div className="text-4xl calligraphy">无为</div>
        <div className="text-4xl calligraphy">逍遥</div>
        <div className="text-4xl calligraphy">觉悟</div>
      </div>
    </div>
  );
}
