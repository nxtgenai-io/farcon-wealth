import React, { useState } from 'react';
import { MessageSquare, Phone } from 'lucide-react';
import { FARCON_CONFIG } from '@/content/site/config';

interface FloatingContactActionsProps {
  onOpenAI: () => void;
}

export const FloatingContactActions: React.FC<FloatingContactActionsProps> = ({ onOpenAI }) => {
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${FARCON_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Hello Farcon Wealth. I would like to learn more about your goal-based mutual fund guidance.'
  )}`;

  return (
    <aside
      className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3 pointer-events-auto"
      aria-label="Quick contact and AI guidance"
    >
      {/* Quiet Farcon AI Floating Trigger (✦ with subtle hover expansion) */}
      <button
        onClick={onOpenAI}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center gap-2 bg-[#101A2C] hover:bg-[#15243B] text-white p-3 sm:px-3.5 sm:py-2.5 rounded-full shadow-2xl border border-slate-700/80 transition-all duration-300 group cursor-pointer active:scale-95"
        aria-label="Ask Farcon AI"
        title="Ask Farcon AI"
      >
        <span className="text-[#78A832] font-bold text-sm leading-none transition-transform group-hover:scale-110">
          ✦
        </span>
        <span
          className={`text-xs font-semibold tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 ${
            isHovered ? 'max-w-28 opacity-100 pr-1' : 'max-w-0 opacity-0 sm:max-w-28 sm:opacity-100 sm:pr-1'
          }`}
        >
          Ask Farcon AI
        </span>
      </button>

      {/* WhatsApp Quick Action */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-10 h-10 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
        aria-label="Connect via WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageSquare className="w-4 h-4 fill-current" />
      </a>

      {/* Call Direct Action */}
      <a
        href={`tel:${FARCON_CONFIG.phoneNumber}`}
        className="flex items-center justify-center w-10 h-10 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
        aria-label="Call Farcon Wealth"
        title={`Call ${FARCON_CONFIG.phoneNumber}`}
      >
        <Phone className="w-3.5 h-3.5 text-[#101A2C]" />
      </a>
    </aside>
  );
};
