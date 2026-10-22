import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { FARCON_CONFIG } from '@/content/site/config';

export const FloatingContactActions: React.FC<{ onOpenAI?: () => void }> = () => {
  const [show, setShow] = useState(false);
  const whatsappUrl = `https://wa.me/${FARCON_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Hello Farcon Wealth. I would like to learn more about your goal-based mutual fund guidance.'
  )}`;

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > 480;
      const footer = document.querySelector('.fw-footer');
      const footerTop = footer?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
      const footerClear = footerTop > window.innerHeight - 8;
      setShow(pastHero && footerClear);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <a
      className={`fw-wa${show ? ' is-on' : ''}`}
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      tabIndex={show ? 0 : -1}
      aria-hidden={show ? undefined : true}
    >
      <MessageSquare size={18} aria-hidden="true" />
      <span>WhatsApp</span>
    </a>
  );
};
