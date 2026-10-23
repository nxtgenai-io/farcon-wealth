import React from 'react';
import { FARCON_CONFIG } from '@/content/site/config';

interface BrandLockupProps {
  tone?: 'dark' | 'light';
  size?: 'header' | 'footer';
  onClick?: () => void;
}

export const BrandLockup: React.FC<BrandLockupProps> = ({ tone = 'dark', size = 'header', onClick }) => {
  const sub = tone === 'light' ? 'rgba(247,244,236,0.92)' : '#3d4a40';
  return (
    <button type="button" className={`fw-lockup ${size === 'footer' ? 'is-footer' : ''}`} onClick={onClick}>
      <picture>
        <source type="image/webp" srcSet="/brand/farcon-lockup-1x.webp 1x, /brand/farcon-lockup-2x.webp 2x" />
        <img
          src="/brand/farcon-lockup-1x.png"
          srcSet="/brand/farcon-lockup-1x.png 1x, /brand/farcon-lockup-2x.png 2x"
          alt="Farcon Wealth"
          width={163}
          height={64}
        />
      </picture>
      <small style={{ color: sub }}>
        AMFI REGISTERED MUTUAL FUND DISTRIBUTOR | ARN: {FARCON_CONFIG.arn}
      </small>
    </button>
  );
};
