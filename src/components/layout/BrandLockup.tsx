import React from 'react';
import { FARCON_CONFIG } from '@/content/site/config';

interface BrandLockupProps {
  tone?: 'dark' | 'light';
  size?: 'header' | 'footer';
  onClick?: () => void;
}

export const BrandLockup: React.FC<BrandLockupProps> = ({ tone = 'dark', size = 'header', onClick }) => {
  const ink = tone === 'light' ? '#F7F4EC' : '#0F3D2E';
  const sub = tone === 'light' ? 'rgba(247,244,236,0.92)' : '#3d4a40';
  return (
    <button type="button" className={`fw-lockup ${size === 'footer' ? 'is-footer' : ''}`} onClick={onClick}>
      <img src="/brand-mark.svg" alt="" width={64} height={78} />
      <span>
        <strong style={{ color: ink }}>{FARCON_CONFIG.brandName}</strong>
        <small style={{ color: sub }}>
          AMFI-registered mutual fund distributor
          <br />
          ARN: {FARCON_CONFIG.arn}
        </small>
      </span>
    </button>
  );
};
