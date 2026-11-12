import React from 'react';
import { FARCON_CONFIG } from '@/content/site/config';

interface BrandLockupProps {
  tone?: 'dark' | 'light';
  size?: 'header' | 'footer';
  onClick?: () => void;
}

export const BrandLockup: React.FC<BrandLockupProps> = ({
  tone = 'dark',
  size = 'header',
  onClick,
}) => {
  const isFooter = size === 'footer';
  const sub = tone === 'light' ? 'rgba(247,244,236,0.92)' : '#3d4a40';

  return (
    <button
      type="button"
      className={`fw-lockup ${isFooter ? 'is-footer' : 'is-header'}`}
      onClick={onClick}
      aria-label="Farcon Wealth"
    >
      <span className="fw-lockup-unit">
        <img
          src="/brand/farcon-stag.png"
          alt=""
          className="fw-lockup-icon"
          width={512}
          height={512}
          loading="eager"
          decoding="sync"
        />
        <span className="fw-lockup-wordmark">Farcon Wealth</span>
      </span>
      {isFooter && (
        <small style={{ color: sub }}>
          AMFI REGISTERED MUTUAL FUND DISTRIBUTOR | ARN: {FARCON_CONFIG.arn}
        </small>
      )}
    </button>
  );
};
