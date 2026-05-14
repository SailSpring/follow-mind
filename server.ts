import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/match", async (req, res) => {
    const { problem } = req.body;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Given the user's problem: "${problem}", match them with the most suitable master from this list:
        - Laozi (老子): Taoism, nature, effortless action.
        - Zhuangzi (庄子): Freedom, playfulness, relativity.
        - Wang Yangming (王阳明): Unity of knowledge and action, innate knowing.
        - Gautama Buddha (释迦牟尼): Peace, enlightenment, detachment.
        - Sun Tzu (孙武): Strategy, focus, overcoming obstacles.
        - Steve Jobs (乔布斯): Intuition, perfection, innovation.
        - Elon Musk (马斯克): Resilience, first principles, vision.

        Return only the name of the master and a brief reason (one sentence) in JSON format.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              masterName: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["masterName", "reason"]
          }
        }
      });
      res.json(JSON.parse(response.text));
    } catch (error) {
      console.error("Match error:", error);
      res.status(500).json({ error: "Failed to match master" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    const { messages, masterName, masterBio } = req.body;
    console.log(`Chat request for ${masterName}. History length: ${messages.length}`);

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
      }

      const history = messages.slice(0, -1).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      const chat = ai.chats.create({
        model: "gemini-1.5-flash-latest", // Use 1.5 Flash for better stability/quota
        config: {
          systemInstruction: `You are ${masterName}. Bio: ${masterBio}. 
          Your goal is to provide emotional healing and wisdom to the user.
          Stay in character. Use a tone that is wise, supportive, and reflects your philosophy.
          Use Markdown for formatting. Keep responses concise and meaningful.
          Language: Chinese (Simplified).`,
        },
        history: history,
      });

      const lastMessage = messages[messages.length - 1];
      console.log(`Sending message to Gemini: ${lastMessage.content.substring(0, 50)}...`);
      
      const result = await chat.sendMessage({ message: lastMessage.content });
      
      if (!result.text) {
        throw new Error("Gemini returned an empty response");
      }

      console.log(`Gemini response received: ${result.text.substring(0, 50)}...`);
      res.json({ content: result.text });
    } catch (error: any) {
      console.error("Chat error detail:", error);
      res.status(500).json({ 
        error: "Failed to generate response", 
        message: error.message || "Internal Server Error" 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
