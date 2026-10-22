import React from 'react';
import { RoutePath } from '@/types';

export const NotFound: React.FC<{ navigate: (path: RoutePath) => void }> = ({ navigate }) => (
  <div className="pg">
    <div className="pg-wrap" style={{ maxWidth: 720, paddingTop: 48 }}>
      <span className="hf-eye">Page not found</span>
      <h1>This path doesn’t lead anywhere.</h1>
      <p className="lede">The page may have moved. Head back to the homepage, or open the calculators and goal guides.</p>
      <div className="hf-cta-row" style={{ marginTop: 20 }}>
        <button type="button" className="hf-btn hf-btn-green" onClick={() => navigate('/')}>Back to Home</button>
        <button type="button" className="hf-btn hf-btn-outline" onClick={() => navigate('/calculators')}>Open Calculators</button>
      </div>
    </div>
  </div>
);
