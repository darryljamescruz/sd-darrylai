import "dotenv/config";
import express from "express";
import cors from "cors";

import { getLLMClient } from "./lib/llm.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok"});
});

app.post("/chat", async (req, res) => {
    const { message } = req.body;
    const { client, model } = getLLMClient();

    try {
        // ai call
        console.log("Making AI call to", model);
        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that can answer questions and help with tasks."
                },
                { role: "user", content: message }
            ]
        })

        res.json ({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error("Error in AI call:", error);
        res.status(500).json({ error: "Internal server error" });
    }



    res.json({ reply: `Mock Backend Response: Received message: ${message}`});
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
