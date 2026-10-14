import React from 'react';

interface BrandLockupProps {
  tone?: 'dark' | 'light';
  onClick?: () => void;
}

export const BrandLockup: React.FC<BrandLockupProps> = ({ tone = 'dark', onClick }) => {
  const ink = tone === 'light' ? '#F7F4EC' : '#0F3D2E';
  const sub = tone === 'light' ? 'rgba(247,244,236,0.75)' : '#6d6558';
  return (
    <button type="button" className="fw-lockup" onClick={onClick}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M8 40c8-2 14-10 16-22 6 2 12 8 14 16-10 2-20 2-30 6z" fill={tone === 'light' ? '#C9A24A' : '#0F3D2E'} />
        <path d="M24 18c2 6 2 12 0 20" stroke={tone === 'light' ? '#F7F4EC' : '#C9A24A'} strokeWidth="1.6" fill="none" />
        <path d="M30 14l8-6-2 8" fill="none" stroke="#1F9D55" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <span>
        <strong style={{ color: ink }}>FARCON WEALTH</strong>
        <small style={{ color: sub }}>AMFI-registered mutual fund distributor | ARN: 229006</small>
      </span>
    </button>
  );
};
