import React, { useState } from 'react';
import { MessageSquare, Phone, X } from 'lucide-react';
import { FARCON_CONFIG } from '@/content/site/config';

interface FloatingContactActionsProps {
  onOpenAI: () => void;
}

export const FloatingContactActions: React.FC<FloatingContactActionsProps> = ({ onOpenAI }) => {
  const [open, setOpen] = useState(false);
  const whatsappUrl = `https://wa.me/${FARCON_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Hello Farcon Wealth. I would like to learn more about your goal-based mutual fund guidance.'
  )}`;

  return (
    <aside className={`fw-fab ${open ? 'is-open' : ''}`} aria-label="Quick contact and AI guidance">
      <div className="fw-fab-menu">
        <button type="button" className="fw-fab-item fw-fab-ai" onClick={onOpenAI}>
          Ask AI
        </button>
        <a className="fw-fab-item fw-fab-wa" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <MessageSquare size={16} aria-hidden="true" /> WhatsApp
        </a>
        <a className="fw-fab-item fw-fab-call" href={`tel:${FARCON_CONFIG.phoneNumber}`}>
          <Phone size={16} aria-hidden="true" /> Call
        </a>
      </div>
      <button
        type="button"
        className="fw-fab-toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={18} aria-hidden="true" /> : null}
        {open ? 'Close' : 'Contact'}
      </button>
    </aside>
  );
};
