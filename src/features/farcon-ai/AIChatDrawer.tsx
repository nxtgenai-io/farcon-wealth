import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';
import { RoutePath } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  state?: 'answer' | 'clarification' | 'escalation' | 'unsupported';
  timestamp: string;
}

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: RoutePath) => void;
  onOpenConsultation: () => void;
}

const STARTER_PROMPTS = [
  'What is SIP?',
  'How does ELSS work?',
  'What is SWP?',
  'How does retirement planning work?',
  'What should I consider before investing?',
];

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  navigate,
  onOpenConsultation,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: 'Welcome to Farcon AI. I can clarify mutual fund concepts, explain compounding mechanics, and explore goal planning principles—strictly grounded in education and suitability without the noise.',
      state: 'answer',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Network response failed');
      }

      const data = await response.json();
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: data.text || 'I am here to guide you calmly through mutual fund concepts.',
        state: data.state || 'answer',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          text: 'Farcon Wealth focuses on goal-based suitability. To discuss your exact portfolio or a specific scheme, message the Farcon team. We distribute mutual funds. We do not give investment advice.',
          state: 'escalation',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fw-skin fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200"
      role="dialog"
      aria-label="Farcon AI Guidance Drawer"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCE4EE] bg-[#F2F6FB] text-[#17243A]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] border border-[#78A832]/30 flex items-center justify-center text-[#78A832] font-bold">
            ✦
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase text-[#17243A]">Farcon AI</span>
              <span className="text-[10px] text-[#52647D] font-mono">ARN: 329006</span>
            </div>
            <p className="text-[10px] text-[#52647D]">Educational · Unbiased · Zero Noise</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-[#52647D] hover:text-[#17243A] hover:bg-[#DCE4EE]/40 rounded-md transition-colors"
          aria-label="Close Farcon AI"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#101A2C] text-white'
                  : 'bg-white text-slate-800 border border-slate-200/90 shadow-2xs'
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>

              {/* State-specific escalation helper */}
              {m.state === 'escalation' && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenConsultation();
                    }}
                    className="text-left text-[11px] font-semibold text-[#78A832] hover:underline flex items-center gap-1"
                  >
                    <span>Book a Free Consultation with Farcon</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/portfolio-review');
                    }}
                    className="text-left text-[11px] font-semibold text-slate-700 hover:underline flex items-center gap-1"
                  >
                    <span>Request Portfolio Review</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 w-fit">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-[#78A832]" />
            <span>Consulting Farcon financial knowledge...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Starters */}
      {messages.length < 3 && (
        <div className="p-4 bg-white border-t border-slate-100">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Suggested Clarifications
          </p>
          <div className="flex flex-wrap gap-1.5">
            {STARTER_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-left text-[11px] text-slate-600 hover:text-slate-950 hover:bg-slate-50 px-2.5 py-1.5 rounded-md transition-colors border border-slate-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer Strip */}
      <div className="px-5 py-2 bg-slate-100 text-[10px] text-slate-500 border-t border-slate-200 flex items-center gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>Educational purpose only. Does not constitute personalised investment advice.</span>
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about SIP, ELSS, SWP, or retirement..."
            className="flex-1 px-3.5 py-2.5 text-xs border border-slate-200 rounded-lg focus:border-slate-900 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 bg-[#101A2C] hover:bg-[#15243B] text-white rounded-lg transition-colors disabled:opacity-40"
            aria-label="Send question"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
