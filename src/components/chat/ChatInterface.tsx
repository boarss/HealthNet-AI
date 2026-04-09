import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, AlertCircle, Info, Leaf, Activity, ChevronRight, BrainCircuit, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Message } from '@/src/types';
import { getChatResponse } from '@/src/services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm HealthNet AI, your primary care assistant. How can I help you today? Please remember, I am an AI and not a replacement for professional medical advice.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReasoning, setSelectedReasoning] = useState<Message | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      chatHistory.push({ role: 'user', content: input });

      const responseData = await getChatResponse(chatHistory);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseData.content || "I'm sorry, I couldn't process that request.",
        timestamp: Date.now(),
        reasoning: responseData.reasoning,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I encountered an error. Please check your connection and try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      <Card className="lg:col-span-2 flex flex-col border-none shadow-lg bg-white/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b bg-primary/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">HealthNet Assistant</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider h-4">Clinical Support</Badge>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-muted-foreground uppercase font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-0 relative">
          <ScrollArea className="h-full p-6" ref={scrollRef}>
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="w-8 h-8 border shrink-0">
                        <AvatarFallback className={m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                          {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`space-y-1 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`rounded-2xl px-4 py-2 text-sm shadow-sm relative group ${
                          m.role === 'user' 
                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                            : 'bg-white border rounded-tl-none'
                        }`}>
                          {m.content}
                          {m.reasoning && (
                            <button 
                              onClick={() => setSelectedReasoning(m)}
                              className="absolute -right-2 -bottom-2 bg-white border shadow-sm rounded-full p-1 text-primary hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                              title="Explain AI Reasoning"
                            >
                              <BrainCircuit className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground px-1">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8 border animate-pulse">
                      <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl px-4 py-2 rounded-tl-none">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <div className="p-4 border-t bg-white/80">
          <div className="flex gap-2">
            <Input
              placeholder="Describe your symptoms or ask a health question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-muted/50 border-none focus-visible:ring-1"
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-3 flex items-center justify-center gap-4">
            <button 
              onClick={() => setInput("I'd like to use the symptom checker. I'm feeling...")}
              className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              <Activity className="w-3 h-3" /> Symptom Checker
            </button>
            <button 
              onClick={() => setInput("Can you recommend some natural or herbal remedies for...")}
              className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              <Leaf className="w-3 h-3" /> Herbal Guide
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                  <Info className="w-3 h-3" /> Explain AI
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-primary" /> How HealthNet AI Works
                  </DialogTitle>
                  <DialogDescription>
                    Understanding our clinical decision support system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="flex gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg h-fit">
                      <Zap className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">Processing Engine</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        We use Large Language Models (LLMs) combined with rule-based medical protocols to analyze your symptoms against thousands of clinical patterns.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="p-2 bg-green-50 rounded-lg h-fit">
                      <ShieldCheck className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">Safety Protocols</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Our system is programmed with "Emergency Redlines." If life-threatening symptoms are detected, the AI is forced to bypass standard advice and recommend immediate emergency care.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="p-2 bg-purple-50 rounded-lg h-fit">
                      <BrainCircuit className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">Explainable Reasoning</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Every diagnosis includes a "Reasoning Path" that shows you exactly which symptoms led to the conclusion, ensuring transparency in medical guidance.
                      </p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* Explainability Panel */}
      <Card className="hidden lg:flex flex-col border-none shadow-lg bg-white/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b bg-primary/5 px-6 py-4">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-primary" /> AI Explainability
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {selectedReasoning ? (
              <motion.div
                key={selectedReasoning.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Confidence Score</span>
                    <Badge variant="secondary" className="text-xs">{(selectedReasoning.reasoning?.confidence || 0) * 100}%</Badge>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedReasoning.reasoning?.confidence || 0) * 100}%` }}
                      className="h-full bg-primary" 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reasoning Steps</span>
                  <div className="space-y-3">
                    {selectedReasoning.reasoning?.steps.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center shrink-0 font-bold">
                          {i + 1}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedReasoning.reasoning?.sources && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Evidence Base</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedReasoning.reasoning.sources.map((source, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] font-normal">{source}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                <BrainCircuit className="w-12 h-12 mb-4 opacity-10" />
                <p className="text-sm">Select a message to see the AI's reasoning process.</p>
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
