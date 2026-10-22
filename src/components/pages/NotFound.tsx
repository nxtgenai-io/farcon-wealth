import React from 'react';
import { RoutePath } from '@/types';

export const NotFound: React.FC<{ navigate: (path: RoutePath) => void }> = ({ navigate }) => (
  <div className="pg">
    <div className="pg-wrap" style={{ maxWidth: 760 }}>
      <img className="nf-stag" src="/brand/farcon-stag.png" alt="Farcon Wealth stag" width={96} height={96} />
      <span className="hf-eye">Page not found</span>
      <h1>This path doesn’t lead anywhere.</h1>
      <p className="lede">The page may have moved. Pick a place to start again.</p>
      <div className="hf-cta-row">
        <button type="button" className="hf-btn hf-btn-green" onClick={() => navigate('/goals')}>Goals</button>
        <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/calculators')}>Calculators</button>
        <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/contact')}>Contact</button>
      </div>
    </div>
  </div>
);
