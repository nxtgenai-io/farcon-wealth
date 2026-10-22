import React from 'react';
import { Flag, Sprout, Target, ArrowRight } from 'lucide-react';
import { FARCON_CONFIG } from '@/content/site/config';

export const PageCta: React.FC<{ onBook: () => void }> = ({ onBook }) => {
  const whatsapp = `https://wa.me/${FARCON_CONFIG.whatsappNumber}`;
  return (
    <section className="hf-cta">
      <img className="bg" src="/images/home/cta-sunset.webp" alt="" width={1600} height={900} />
      <div className="hf-cta-scrim" />
      <div className="hf-cta-inner">
        <div>
          <span className="hf-eye">Ready to take the next step?</span>
          <h2>Let&apos;s build your financial future, together.</h2>
          <p>Get personalised guidance from our experts. No pressure, just a conversation about your goals.</p>
          <div className="hf-cta-row">
            <button type="button" className="hf-btn hf-btn-gold" onClick={onBook}>
              Book a Free 15-Minute Call <ArrowRight size={16} />
            </button>
            <a className="hf-btn hf-btn-white" href={whatsapp} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          </div>
        </div>
        <ol className="hf-path">
          <li><span><Target size={16} /></span> Your Goals</li>
          <li><span><Sprout size={16} /></span> Our Guidance</li>
          <li><span><Flag size={16} /></span> A Brighter Tomorrow</li>
        </ol>
      </div>
    </section>
  );
};
