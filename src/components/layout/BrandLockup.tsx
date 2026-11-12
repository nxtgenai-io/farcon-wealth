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
      {isFooter ? (
        <>
          <picture className="fw-lockup-media">
            <source type="image/webp" srcSet="/brand/farcon-lockup-1x.webp 1x, /brand/farcon-lockup-2x.webp 2x" />
            <img
              src="/brand/farcon-lockup-1x.png"
              srcSet="/brand/farcon-lockup-1x.png 1x, /brand/farcon-lockup-2x.png 2x"
              alt="Farcon Wealth"
              width={163}
              height={64}
              loading="lazy"
              decoding="async"
            />
          </picture>
          <small style={{ color: sub }}>
            AMFI REGISTERED MUTUAL FUND DISTRIBUTOR | ARN: {FARCON_CONFIG.arn}
          </small>
        </>
      ) : (
        <span className="fw-lockup-unit">
          <img
            src="/brand/farcon-stag.png"
            alt=""
            className="fw-lockup-icon"
            width={397}
            height={348}
            loading="eager"
            decoding="sync"
          />
          <span className="fw-lockup-wordmark">
            <span className="fw-wordmark-farcon">FARCON</span>
            <span className="fw-wordmark-wealth">WEALTH</span>
          </span>
        </span>
      )}
    </button>
  );
};
