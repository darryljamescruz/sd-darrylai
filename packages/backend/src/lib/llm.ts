import OpenAI from "openai";

export function getLLMClient() {
  const provider = process.env.LLM_PROVIDER || "ollama";

  if (provider === "openai") {
    return {
      client: new OpenAI({ 
        apiKey: process.env.OPENAI_API_KEY 
      }),
      model: process.env.OPENAI_MODEL || "gpt-4o"
    };
  }

  // Default to Ollama
  return {
    client: new OpenAI({
      baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
      apiKey: "ollama", // Required by SDK but ignored by Ollama
    }),
    model: process.env.OLLAMA_MODEL || "llama3"
  };
}
