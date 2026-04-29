import { useState, useRef, useEffect } from 'react';
import { useWebHaptics } from 'web-haptics/react';
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
import { supabaseService } from '@/src/services/supabaseService';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

export default function ChatInterface() {
  const shouldReduceMotion = useReducedMotion();
  const { trigger } = useWebHaptics();
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

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await supabaseService.getChatHistory('main-session');
        if (history && history.length > 0) {
          const formattedHistory: Message[] = history.map(h => ({
            id: h.id.toString(),
            role: h.role,
            content: h.content,
            timestamp: new Date(h.timestamp).getTime(),
            type: h.type,
            reasoning: h.reasoning
          }));
          setMessages(formattedHistory);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    loadHistory();
  }, []);

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
    trigger('success');

    // Save user message to Supabase
    supabaseService.saveMessage('main-session', userMessage).catch(console.error);

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
      
      // Save assistant message to Supabase
      supabaseService.saveMessage('main-session', assistantMessage).catch(console.error);
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[600px] relative z-10">
      <div className="lg:col-span-8 flex flex-col h-full bg-white/40 ring-1 ring-white/60 backdrop-blur-3xl rounded-[32px] shadow-2xl shadow-slate-200/50 overflow-hidden">
        {/* Chat Header - Higher contrast and cleaner typography */}
        <div className="px-8 py-6 border-b border-white/40 flex items-center justify-between bg-white/20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 ring-4 ring-primary/5">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shimmer" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-none">HealthNet AI</h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Clinical Expert</Badge>
                <div className="flex items-center gap-1.5 ml-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Active</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50 transition-colors h-10 w-10">
              <Info className="w-4.5 h-4.5 text-slate-400" />
            </Button>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-hidden relative">
          <ScrollArea className="h-full px-8 py-8" ref={scrollRef}>
            <div
              role="log"
              aria-label="Conversation history"
              aria-live="polite"
              className="space-y-8"
            >
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 400, 
                      damping: 30,
                      delay: 0.05 
                    }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} gap-2`}>
                        <div
                          className={`group relative px-6 py-4 rounded-[24px] text-[15px] font-medium leading-relaxed transition-all duration-300 ${
                            m.role === 'user'
                              ? 'bg-slate-900 text-white rounded-tr-none shadow-xl shadow-slate-200'
                              : 'bg-white text-slate-800 rounded-tl-none border border-white/80 shadow-md shadow-slate-100/50'
                          }`}
                        >
                          {m.content}
                          {m.reasoning && (
                            <button
                              onClick={() => {
                                trigger('nudge');
                                setSelectedReasoning(m);
                              }}
                              className="absolute -right-3 -bottom-3 bg-white border border-slate-100 shadow-xl rounded-2xl p-2 text-primary hover:bg-primary hover:text-white transition-all transform hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
                            >
                              <BrainCircuit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2 px-1">
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                            {new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(m.timestamp)}
                          </span>
                          {m.role === 'assistant' && (
                            <div className="flex items-center gap-1 opacity-40">
                              <ShieldCheck className="w-3 h-3 text-emerald-500" />
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-none">Verified</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Enhanced Loading Indicator */}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start pt-2"
                >
                  <div className="bg-white/60 border border-white rounded-[20px] px-5 py-3.5 shadow-sm">
                    <div className="flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 bg-primary rounded-full shimmer"
                          style={{ 
                            animation: `shimmer 1.5s infinite ease-in-out`,
                            animationDelay: `${i * 0.2}s` 
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Bar - Floating & Premium */}
        <div className="p-8 mt-auto border-t border-white/40 bg-white/20">
          <div className="relative group max-w-4xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-emerald-500/20 rounded-[32px] blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
            <div className="relative flex items-center gap-3 bg-white p-3 rounded-[28px] border border-white/50 shadow-xl focus-within:shadow-2xl focus-within:shadow-primary/5 transition-all duration-300">
              <Input
                ref={inputRef}
                placeholder="Ask HealthNet anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-slate-900 placeholder:text-slate-400 placeholder:font-medium h-12 px-5 text-base"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="h-12 px-8 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[11px] transition-all transform active:scale-95 shadow-lg"
              >
                Send <Send className="w-3.5 h-3.5 ml-2" />
              </Button>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: Activity, label: 'Symptom Checker', hint: "I'm feeling..." },
              { icon: Leaf, label: 'Herbal Guide', hint: "Recommend remedies for..." },
              { icon: BrainCircuit, label: 'How It Works', isDialog: true }
            ].map((btn) => (
              <Button
                key={btn.label}
                variant="ghost"
                size="sm"
                onClick={() => {
                  trigger('nudge');
                  if (btn.hint) setInput(btn.hint);
                }}
                className="h-9 px-4 rounded-full bg-white/40 hover:bg-white text-slate-500 hover:text-primary border border-white/60 text-[10px] font-black uppercase tracking-[0.1em] transition-all"
              >
                <btn.icon className="w-3.5 h-3.5 mr-2" /> {btn.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Reasoning Sidebar - Premium Upgrade */}
      <div className="lg:col-span-4 h-full">
        <div className="glass-panel h-full rounded-[32px] flex flex-col overflow-hidden">
          <div className="px-8 py-6 border-b border-white/40 bg-primary/5 flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center ring-4 ring-primary/5">
              <BrainCircuit className="w-5 h-5 text-primary" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">Intelligence</h4>
          </div>
          
          <div className="flex-1 p-8 overflow-hidden">
            <AnimatePresence mode="wait">
              {selectedReasoning ? (
                <motion.div
                  key={selectedReasoning.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10 h-full overflow-y-auto pr-2 scrollbar-hide"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confidence Match</span>
                      <span className="text-xl font-black text-primary tabular-nums">
                        {Math.round((selectedReasoning.reasoning?.confidence || 0) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(selectedReasoning.reasoning?.confidence || 0) * 100}%` }}
                        transition={{ duration: 1, ease: 'circOut' }}
                        className="h-full bg-gradient-to-r from-primary to-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                       <Zap className="w-3 h-3" /> Logic Flow
                    </h5>
                    <div className="space-y-4">
                      {selectedReasoning.reasoning?.steps.map((step, i) => (
                        <div key={i} className="relative pl-8 group">
                          <div className="absolute left-0 top-1 w-5 h-5 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[10px] font-black group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            {i + 1}
                          </div>
                          <p className="text-[13px] font-medium text-slate-600 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedReasoning.reasoning?.sources && (
                    <div className="space-y-4">
                       <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                         <ShieldCheck className="w-3 h-3" /> EVIDENCE BASE
                       </h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedReasoning.reasoning.sources.map((source, i) => (
                          <Badge key={i} variant="outline" className="bg-white/40 border-white/60 text-[10px] font-bold px-3 py-1 rounded-lg lowercase tracking-tight">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <div className="w-20 h-20 bg-slate-100/50 rounded-[28px] flex items-center justify-center mb-6 animate-pulse">
                    <BrainCircuit className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
                  </div>
                  <h5 className="text-base font-black text-slate-900 mb-2">Neural Analysis</h5>
                  <p className="text-sm font-medium text-slate-400 leading-relaxed">
                    Select any message to unveil the clinical logic and reasoning behind the AI's response.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
