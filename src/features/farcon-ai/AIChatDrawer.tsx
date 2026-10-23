import React, { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, X } from 'lucide-react';
import { RoutePath } from '@/types';
import { FARCON_CONFIG } from '@/content/site/config';
import { AI_FALLBACK_TEXT, linksIn } from '@/content/ai/assistant';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  fallback?: boolean;
}

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: RoutePath) => void;
  onOpenConsultation: () => void;
}

const STARTERS = [
  'What is the difference between a SIP and a lump sum?',
  'Which fund should I buy?',
  'How is a retirement corpus estimated?',
  'Can you guarantee 15%?',
  'How do I contact you?',
];

const WELCOME = 'I can explain SIPs, lump sums, goals, retirement, child education, and how to use the pages on this site. I do not give investment advice or name a scheme for you.';

async function readAnswer(response: Response, onDelta: (text: string) => void): Promise<{ text: string; fallback: boolean }> {
  const type = response.headers.get('content-type') || '';
  if (type.includes('application/json') || !response.body) {
    const data = await response.json().catch(() => ({})) as { text?: string; fallback?: boolean };
    const text = data.text || AI_FALLBACK_TEXT;
    onDelta(text);
    return { text, fallback: Boolean(data.fallback) || !response.ok };
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;
      try {
        const parsed = JSON.parse(payload) as { response?: string; delta?: string };
        const piece = parsed.response || parsed.delta || '';
        if (!piece) continue;
        full = piece.startsWith(full) ? piece : full + piece;
        onDelta(full);
      } catch {
        // Ignore a partial SSE line.
      }
    }
  }
  if (!full.trim()) return { text: AI_FALLBACK_TEXT, fallback: true };
  return { text: full.trim(), fallback: false };
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ isOpen, onClose, navigate }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', text: WELCOME },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const whatsapp = `https://wa.me/${FARCON_CONFIG.whatsappNumber}`;

  useEffect(() => {
    if (!isOpen) return undefined;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('button, a, input') ?? []).filter((node) => !node.hasAttribute('disabled'));
    window.setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
      returnFocus.current?.focus();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, loading, isOpen]);

  if (!isOpen) return null;

  const send = async (query?: string) => {
    const text = (query ?? input).trim();
    if (!text || loading) return;
    const history = messages.filter((item) => item.id !== 'welcome').slice(-6).map((item) => ({
      role: item.role,
      content: item.text,
    }));
    const userId = `user-${Date.now()}`;
    const botId = `bot-${Date.now()}`;
    setMessages((prev) => [...prev, { id: userId, role: 'user', text }]);
    setInput('');
    setLoading(true);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
        signal: controller.signal,
      });
      setMessages((prev) => [...prev, { id: botId, role: 'assistant', text: '' }]);
      const result = await readAnswer(response, (next) => {
        setMessages((prev) => prev.map((item) => (item.id === botId ? { ...item, text: next } : item)));
      });
      setMessages((prev) => prev.map((item) => (item.id === botId ? { ...item, text: result.text, fallback: result.fallback } : item)));
    } catch {
      setMessages((prev) => {
        const existing = prev.find((item) => item.id === botId);
        if (existing?.text) return prev.map((item) => (item.id === botId ? { ...item, fallback: item.fallback } : item));
        return [...prev.filter((item) => item.id !== botId), { id: botId, role: 'assistant', text: AI_FALLBACK_TEXT, fallback: true }];
      });
    } finally {
      window.clearTimeout(timer);
      setLoading(false);
    }
  };

  const go = (path: RoutePath) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fw-ai-scrim" onMouseDown={onClose}>
      <div
        ref={panelRef}
        className="fw-ai"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fw-ai-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="fw-ai-head">
          <div>
            <div className="fw-ai-title-row">
              <span className="fw-ai-mark" aria-hidden="true"><Sparkles size={16} /></span>
              <h2 id="fw-ai-title">Farcon AI</h2>
            </div>
            <p className="fw-ai-badge">Educational only, not investment advice</p>
          </div>
          <button type="button" className="fw-ai-close" onClick={onClose} aria-label="Close Farcon AI">
            <X size={18} />
          </button>
        </header>
        <div className="fw-ai-log">
          {messages.map((message) => {
            const links = message.role === 'assistant' ? linksIn(message.text) : [];
            const showWhatsApp = message.fallback || /whatsapp/i.test(message.text);
            return (
              <div key={message.id} className={`fw-ai-msg is-${message.role}`}>
                {message.text ? <p>{message.text}</p> : null}
                {links.length > 0 && (
                  <div className="fw-ai-links">
                    {links.map((link) => (
                      <button key={link.path} type="button" onClick={() => go(link.path)}>{link.label}</button>
                    ))}
                  </div>
                )}
                {showWhatsApp && (
                  <a className="fw-ai-wa" href={whatsapp} target="_blank" rel="noreferrer">Message us on WhatsApp</a>
                )}
              </div>
            );
          })}
          {loading && messages[messages.length - 1]?.role !== 'assistant' && (
            <p className="fw-ai-typing" role="status">Farcon AI is typing</p>
          )}
          {loading && messages[messages.length - 1]?.role === 'assistant' && !messages[messages.length - 1]?.text && (
            <p className="fw-ai-typing" role="status">Farcon AI is typing</p>
          )}
          <div ref={endRef} />
        </div>
        {messages.filter((item) => item.role === 'user').length === 0 && (
          <div className="fw-ai-starters">
            {STARTERS.map((prompt) => (
              <button key={prompt} type="button" onClick={() => send(prompt)} disabled={loading}>{prompt}</button>
            ))}
          </div>
        )}
        <form
          className="fw-ai-form"
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          <input
            ref={inputRef}
            value={input}
            maxLength={800}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about SIP, a goal, or a page"
            aria-label="Your question"
          />
          <button type="submit" disabled={!input.trim() || loading} aria-label="Send question">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
