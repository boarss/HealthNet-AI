import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, AlertCircle, Info, Leaf, Activity, BrainCircuit, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Message } from '@/src/types';
import { getChatResponse } from '@/src/services/geminiService';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

export default function ChatInterface() {
  const shouldReduceMotion = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I’m HealthNet AI, your primary care assistant. How can I help you today? Please remember, I am an AI and not a replacement for professional medical advice.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReasoning, setSelectedReasoning] = useState<Message | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
        content: responseData.content || 'I’m sorry, I couldn’t process that request.',
        timestamp: Date.now(),
        reasoning: responseData.reasoning,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I encountered an error. Please check your connection and try again.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const motionProps = shouldReduceMotion
    ? { initial: false, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
      };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      <Card className="lg:col-span-2 flex flex-col border-none shadow-lg bg-white/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b bg-primary/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg" aria-hidden="true">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">HealthNet Assistant</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider h-4">Clinical Support</Badge>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
                    <span className="text-[10px] text-muted-foreground uppercase font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Message log — aria-live for screen readers */}
        <CardContent className="flex-1 overflow-hidden p-0 relative">
          <ScrollArea className="h-full p-6" ref={scrollRef}>
            <div
              role="log"
              aria-label="Conversation history"
              aria-live="polite"
              aria-relevant="additions"
              className="space-y-6"
            >
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    {...(shouldReduceMotion ? { initial: false } : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } })}
                    transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="w-8 h-8 border shrink-0">
                        <AvatarFallback
                          className={m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                          aria-hidden="true"
                        >
                          {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`space-y-1 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm relative group ${
                            m.role === 'user'
                              ? 'bg-primary text-primary-foreground rounded-tr-none'
                              : 'bg-white border rounded-tl-none'
                          }`}
                        >
                          {m.content}
                          {m.reasoning && (
                            <button
                              onClick={() => setSelectedReasoning(m)}
                              className="absolute -right-2 -bottom-2 bg-white border shadow-sm rounded-full p-1 text-primary hover:bg-primary hover:text-white transition-colors duration-150 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 min-w-[28px] min-h-[28px] flex items-center justify-center"
                              aria-label="View AI reasoning for this response"
                            >
                              <BrainCircuit className="w-3 h-3" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                        <time
                          className="text-[10px] text-muted-foreground px-1 block"
                          dateTime={new Date(m.timestamp).toISOString()}
                        >
                          {new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(m.timestamp)}
                        </time>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing / Loading indicator */}
              {isLoading && (
                <div className="flex justify-start" aria-label="HealthNet AI is thinking…" role="status">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8 border shrink-0">
                      <AvatarFallback className="bg-muted" aria-hidden="true">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white border rounded-2xl px-4 py-3 rounded-tl-none">
                      <div className="flex gap-1.5 items-center">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Input area */}
        <div className="p-4 border-t bg-white/80">
          <div className="flex gap-2" role="form" aria-label="Send a message">
            <Input
              ref={inputRef}
              id="chat-input"
              name="message"
              placeholder="Describe your symptoms or ask a health question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-muted/50 border-none focus-visible:ring-1"
              aria-label="Message input"
              autoComplete="off"
              spellCheck={false}
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="icon"
              aria-label="Send message"
              className="min-w-[44px] min-h-[44px] transition-all duration-150 active:scale-95"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="mt-3 flex items-center justify-center gap-4">
            <button
              onClick={() => setInput("I'd like to use the symptom checker. I'm feeling…")}
              className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors duration-150 min-h-[32px] px-1"
            >
              <Activity className="w-3 h-3" aria-hidden="true" /> Symptom Checker
            </button>
            <button
              onClick={() => setInput('Can you recommend some natural or herbal remedies for…')}
              className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors duration-150 min-h-[32px] px-1"
            >
              <Leaf className="w-3 h-3" aria-hidden="true" /> Herbal Guide
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors duration-150 min-h-[32px] px-1">
                  <Info className="w-3 h-3" aria-hidden="true" /> How It Works
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-primary" aria-hidden="true" /> How HealthNet AI Works
                  </DialogTitle>
                  <DialogDescription>
                    Understanding our clinical decision support system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {[
                    { icon: Zap, color: 'blue', title: 'Processing Engine', body: 'We use Large Language Models (LLMs) combined with rule-based medical protocols to analyze your symptoms against thousands of clinical patterns.' },
                    { icon: ShieldCheck, color: 'green', title: 'Safety Protocols', body: 'Our system is programmed with “Emergency Redlines.” If life-threatening symptoms are detected, the AI is forced to bypass standard advice and recommend immediate emergency care.' },
                    { icon: BrainCircuit, color: 'purple', title: 'Explainable Reasoning', body: 'Every diagnosis includes a “Reasoning Path” that shows you exactly which symptoms led to the conclusion, ensuring transparency in medical guidance.' },
                  ].map(({ icon: Icon, color, title, body }) => (
                    <div key={title} className="flex gap-4">
                      <div className={`p-2 bg-${color}-50 rounded-lg h-fit shrink-0`} aria-hidden="true">
                        <Icon className={`w-5 h-5 text-${color}-500`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold mb-1">{title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* AI Explainability Panel */}
      <Card className="hidden lg:flex flex-col border-none shadow-lg bg-white/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b bg-primary/5 px-6 py-4">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-primary" aria-hidden="true" /> AI Explainability
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedReasoning ? (
              <motion.div
                key={selectedReasoning.id}
                initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                className="space-y-6 h-full overflow-y-auto"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Confidence Score</span>
                    <Badge variant="secondary" className="text-xs tabular-nums">
                      {Math.round((selectedReasoning.reasoning?.confidence || 0) * 100)}%
                    </Badge>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round((selectedReasoning.reasoning?.confidence || 0) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="AI Confidence">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedReasoning.reasoning?.confidence || 0) * 100}%` }}
                      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reasoning Steps</span>
                  <div className="space-y-3">
                    {selectedReasoning.reasoning?.steps.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center shrink-0 font-bold" aria-hidden="true">
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
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-4">
                <BrainCircuit className="w-12 h-12 opacity-10" aria-hidden="true" />
                <p className="text-sm">                  Select a message to see the AI’s reasoning process.</p>
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
