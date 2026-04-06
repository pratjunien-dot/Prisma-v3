'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User, ArrowRight, Check, X, RefreshCw, MessageSquare, Star, Bot, Activity } from 'lucide-react';
import { usePrismaStore, Persona, ChatMode } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { GeminiAdapter, AdvancedAxis, PersonaData } from '@/lib/gemini';
import ReactMarkdown from 'react-markdown';

const gemini = new GeminiAdapter();

export function Chat() {
  const { accentColor, chatMode, setChatMode, selectedPersonas, setSelectedPersonas } = usePrismaStore();
  const [phase, setPhase] = useState<'intention' | 'matrix' | 'persona' | 'chat'>('intention');
  const [intention, setIntention] = useState('');
  const [matrices, setMatrices] = useState<AdvancedAxis[][]>([]);
  const [selectedMatrixIndex, setSelectedMatrixIndex] = useState<number | null>(null);
  const [personas, setPersonas] = useState<PersonaData[]>([]);
  const [selectedPersonaIndex, setSelectedPersonaIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string, senderName?: string }[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleIntentionSubmit = async () => {
    if (!intention) return;
    setIsLoading(true);
    try {
      const result = await gemini.generateStyleMatrices(intention);
      setMatrices(result);
      setPhase('matrix');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatrixConfirm = async () => {
    if (selectedMatrixIndex === null) return;
    setIsLoading(true);
    try {
      const result = await gemini.generatePersonas(intention, matrices[selectedMatrixIndex]);
      setPersonas(result);
      setPhase('persona');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonaConfirm = () => {
    if (selectedPersonaIndex === null) return;
    const persona = personas[selectedPersonaIndex];
    const newPersona: Persona = {
      id: Math.random().toString(36).substr(2, 9),
      uid: 'user-123',
      ...persona,
      isFavorite: false,
      createdAt: new Date().toISOString()
    };
    setSelectedPersonas([newPersona]);
    setPhase('chat');
  };

  const handleSendMessage = async () => {
    if (!input || isLoading) return;
    const userMsg = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    
    try {
      const systemPrompt = selectedPersonas.map(p => p.systemPrompt).join('\n\n');
      const response = await gemini.chat([...messages, userMsg], systemPrompt);
      setMessages(prev => [...prev, { role: 'model', content: response, senderName: selectedPersonas[0]?.name }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden pt-14 pb-20">
      <AnimatePresence mode="wait">
        
        {/* PHASE 1: INTENTION */}
        {phase === 'intention' && (
          <motion.div 
            key="intention"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full px-6 gap-8"
          >
            <div className="w-full relative">
              <textarea
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Quelle est votre intention ?"
                className="w-full h-40 liquid-glass rounded-3xl p-6 text-white text-lg focus:outline-none focus:border-accent/50 transition-all resize-none placeholder:text-white/20"
              />
              <button 
                onClick={handleIntentionSubmit}
                disabled={isLoading || !intention}
                className={cn(
                  "absolute bottom-4 right-4 px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center gap-2",
                  isLoading ? "bg-white/10 text-white/40" : `bg-${accentColor} text-black hover:scale-105 shadow-[0_0_20px_var(--accent)]`
                )}
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Générer les matrices"}
              </button>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {["Analyser un dataset", "Créer un concept", "Débattre d'une idée"].map(s => (
                <button key={s} onClick={() => setIntention(s)} className="liquid-glass px-4 py-2 rounded-full text-xs text-white/60 hover:text-white transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* PHASE 2: MATRICE */}
        {phase === 'matrix' && (
          <motion.div 
            key="matrix"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-6 py-8 relative"
          >
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-24">
              {matrices.map((matrix, i) => {
                const isSelected = selectedMatrixIndex === i;
                return (
                  <div 
                    key={i}
                    onClick={() => setSelectedMatrixIndex(i)}
                    className={cn(
                      "liquid-glass rounded-3xl p-6 cursor-pointer transition-all duration-300 relative overflow-hidden",
                      isSelected ? `border-${accentColor} shadow-[0_0_20px_rgba(var(--color-${accentColor}),0.2)]` : "hover:bg-white/5"
                    )}
                  >
                    {isSelected && <div className={cn("absolute inset-0 opacity-10", `bg-${accentColor}`)} />}
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div>
                        <h3 className="text-white font-bold">Matrice {i + 1}</h3>
                        <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Archétype {i === 0 ? 'Analytique' : i === 1 ? 'Créatif' : 'Pragmatique'}</p>
                      </div>
                      <div className="bg-white/10 px-2 py-1 rounded text-[10px] text-white/60 font-mono">
                        Tension: {Math.round(Math.random() * 100)}%
                      </div>
                    </div>
                    <div className="space-y-2 relative z-10">
                      {matrix.slice(0, 6).map((axis, j) => (
                        <div key={j} className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full", axis.value > 0.5 ? "bg-emerald-500" : "bg-rose-500")} 
                            style={{ width: `${axis.value * 100}%` }} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="absolute bottom-6 left-6 right-6">
              <button 
                onClick={handleMatrixConfirm}
                disabled={selectedMatrixIndex === null || isLoading}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-2",
                  (selectedMatrixIndex === null || isLoading) ? "bg-white/10 text-white/40" : `bg-${accentColor} text-black shadow-[0_0_20px_var(--accent)] hover:scale-[1.02]`
                )}
              >
                {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Confirmer"}
              </button>
            </div>
          </motion.div>
        )}

        {/* PHASE 3: PERSONA */}
        {phase === 'persona' && (
          <motion.div 
            key="persona"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-8 relative"
          >
            <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4">
              {personas.map((persona, i) => {
                const isSelected = selectedPersonaIndex === i;
                return (
                  <div 
                    key={i}
                    onClick={() => setSelectedPersonaIndex(i)}
                    className={cn(
                      "liquid-glass rounded-2xl p-4 min-w-[200px] cursor-pointer transition-all duration-300 flex flex-col items-center text-center",
                      isSelected ? `border-${accentColor} shadow-[0_0_20px_rgba(var(--color-${accentColor}),0.2)] bg-white/10` : "hover:bg-white/5"
                    )}
                  >
                    <div className="text-4xl mb-2">🤖</div>
                    <h3 className="text-white font-bold">{persona.name}</h3>
                    <p className={cn("text-[10px] uppercase tracking-widest font-mono mt-1", `text-${accentColor}`)}>{persona.role}</p>
                  </div>
                );
              })}
            </div>

            {selectedPersonaIndex !== null && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="liquid-glass rounded-3xl p-6 mt-4 flex-1 overflow-y-auto custom-scrollbar mb-24"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-white text-2xl font-bold">{personas[selectedPersonaIndex].name}</h2>
                    <p className="text-white/40 text-xs uppercase tracking-widest font-mono">{personas[selectedPersonaIndex].role}</p>
                  </div>
                  <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-amber-400 transition-colors">
                    <Star className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-white/60 text-xs uppercase tracking-widest mb-4">Axes Comportementaux</h4>
                    <div className="space-y-3">
                      {Object.entries(personas[selectedPersonaIndex].axes).map(([key, value], j) => (
                        <div key={j} className="space-y-1">
                          <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                            <span>{key}</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 bottom-0 left-0 bg-white/20 w-[50%]" /> {/* Base Matrix */}
                            <div className={cn("absolute top-0 bottom-0 left-0", `bg-${accentColor}`)} style={{ width: `${value * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white/60 text-xs uppercase tracking-widest mb-4">Capacités & Tools</h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['web_search', 'code_execution', 'memory_read'].map(t => (
                        <span key={t} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white/60">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h4 className="text-white/60 text-xs uppercase tracking-widest mb-2">Comportement</h4>
                    <p className="text-white/80 text-sm leading-relaxed italic">
                      "{personas[selectedPersonaIndex].systemPrompt}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="absolute bottom-6 left-6 right-6">
              <button 
                onClick={handlePersonaConfirm}
                disabled={selectedPersonaIndex === null}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-2",
                  selectedPersonaIndex === null ? "bg-white/10 text-white/40" : `bg-${accentColor} text-black shadow-[0_0_20px_var(--accent)] hover:scale-[1.02]`
                )}
              >
                Confirmer
              </button>
            </div>
          </motion.div>
        )}

        {/* PHASE 4: CHAT */}
        {phase === 'chat' && (
          <motion.div 
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col h-full relative"
          >
            {/* Top Right Inspector Button */}
            <div className="absolute top-4 right-4 z-10">
              <button className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-xl hover:scale-110 transition-transform">
                🤖
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-24">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <Activity className="w-16 h-16 mb-4" />
                  <p className="text-sm uppercase tracking-widest font-mono">Stream Initialized</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex max-w-[85%]",
                    msg.role === 'user' ? "ml-auto justify-end" : "mr-auto justify-start"
                  )}
                >
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-sm mr-3 shrink-0">
                      🤖
                    </div>
                  )}
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-teal-500/20 border border-teal-500/30 text-white rounded-tr-sm" 
                      : "liquid-glass text-white/90 rounded-tl-sm"
                  )}>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-sm shrink-0">🤖</div>
                  <div className="liquid-glass p-4 rounded-2xl rounded-tl-sm text-white/60 font-mono text-sm flex items-center gap-1">
                    Streaming <span className="animate-pulse">▋</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer Input */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
              <div className="max-w-3xl mx-auto relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Transmettre..."
                  className="w-full h-12 liquid-glass rounded-full pl-6 pr-14 text-white text-sm focus:outline-none focus:border-accent/50 transition-all"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !input}
                  className={cn(
                    "absolute right-1.5 top-1.5 bottom-1.5 w-9 rounded-full flex items-center justify-center transition-all",
                    isLoading || !input ? "bg-white/10 text-white/40" : `bg-${accentColor} text-black hover:scale-105`
                  )}
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
