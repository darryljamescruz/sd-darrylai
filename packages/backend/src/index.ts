import "dotenv/config";
import express from "express";
import cors from "cors";

import { getLLMClient } from "./lib/llm.js";
import { SYSTEM_PROMPT } from "./lib/prompts.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok"});
});

app.post("/chat", async (req, res) => {
    const { message, history = [] } = req.body;
    const { client, model } = getLLMClient();

    try {
        // Construct the full message list for the AI, including history
        // We map history to ensure roles match the OpenAI/Ollama expectations
        const chatMessages = [
            {
                role: "system",
                content: SYSTEM_PROMPT + "\n\nCRITICAL: Every response MUST begin with <thought>...</thought> reasoning. Never skip the tags."
            },
            ...history,
            { role: "user", content: message }
        ];

        console.log(`Making AI call to ${model} with ${chatMessages.length} messages`);
        
        const response = await client.chat.completions.create({
            model: model,
            messages: chatMessages as any,
            temperature: 0.1, // Lower temperature for more consistent formatting
        })

        const fullContent = response.choices[0].message.content || "";
        
        // Extract thought and clean reply (case-insensitive)
        const thoughtMatch = fullContent.match(/<thought>([\s\S]*?)<\/thought>/i);
        const thought = thoughtMatch ? thoughtMatch[1].trim() : "No reasoning provided.";
        const reply = fullContent.replace(/<thought>[\s\S]*?<\/thought>/gi, "").trim();

        console.log("\n--- WWDD REASONING ---");
        console.log(thought);
        console.log("----------------------\n");

        res.json({ reply, thought });
    } catch (error) {
        console.error("Error in AI call:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
