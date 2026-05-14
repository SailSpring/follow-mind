import { motion } from "motion/react";
import { Compass } from "lucide-react";

export default function MatchingAnimation() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-paper">
      <motion.div
        animate={{ 
          rotate: 360,
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative mb-12"
      >
        <Compass className="w-32 h-32 text-ink opacity-10" />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-cinnabar/20 blur-xl" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <h3 className="text-2xl chinese-text mb-4 calligraphy">心有灵犀，正在为你引荐...</h3>
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
              className="w-2 h-2 bg-ink rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
