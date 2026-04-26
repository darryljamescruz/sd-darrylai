"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendHorizontal, Bot, User, Sparkles } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      role: "bot", 
      content: "Hello! I'm your AI assistant. How can I help you today?" 
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { 
      id: Date.now().toString(), 
      role: "user", 
      content: input 
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: `I've received your message: "${userMessage.content}". This is a lightweight preview of our AI interaction.`,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground w-full">
      {/* Minimal Header */}
      <header className="flex items-center justify-center border-b bg-background/80 backdrop-blur-md sticky top-0 z-10 w-full">
        <div className="flex items-center justify-between w-full max-w-5xl px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-sm leading-none">AI Chat</h1>
              <p className="text-xs text-muted-foreground mt-1">Lightweight Assistant</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setMessages([messages[0]])}>
            Clear
          </Button>
        </div>
      </header>

      {/* Chat Space */}
      <main className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-6 py-8 max-w-5xl mx-auto px-6">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <Avatar className="w-8 h-8 shrink-0 border">
                    {m.role === "bot" ? (
                      <>
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/5 text-primary">
                          <Bot size={16} />
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-muted">
                          <User size={16} />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  
                  <div className={`flex flex-col gap-1 max-w-[80%] ${m.role === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted/50 border rounded-tl-none"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <Avatar className="w-8 h-8 shrink-0 border">
                    <AvatarFallback className="bg-primary/5 text-primary">
                      <Bot size={16} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted/50 border rounded-2xl rounded-tl-none px-4 py-3 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce"></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </main>

      {/* Input Section */}
      <footer className="p-4 md:p-6 bg-background border-t">
        <form
          onSubmit={handleSubmit}
          className="relative max-w-3xl mx-auto flex items-center group"
        >
          <Input
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="pr-12 py-6 rounded-2xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all text-base shadow-inner"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl w-10 h-10 shadow-lg transition-transform active:scale-95"
          >
            <SendHorizontal size={18} />
          </Button>
        </form>
      </footer>
    </div>
  );
}
