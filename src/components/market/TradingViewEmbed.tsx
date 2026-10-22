import React, { useEffect, useRef, useState } from 'react';

const MINI_SCRIPT = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
const TAPE_SCRIPT = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';

/** NSE:NIFTY, NSE:BANKNIFTY and NSE:CNXIT show TradingView’s paid-symbol notice in free embeds. BSE:SENSEX renders. */
const SENSEX_MINI = {
  symbol: 'BSE:SENSEX',
  width: '100%',
  height: '100%',
  locale: 'en',
  dateRange: '12M',
  colorTheme: 'light',
  isTransparent: true,
  autosize: true,
  largeChartUrl: '',
  trendLineColor: '#1F9D55',
  underLineColor: 'rgba(31, 157, 85, 0.22)',
  underLineBottomColor: 'rgba(31, 157, 85, 0)',
  growingTrendLineColor: '#1F9D55',
  fallingTrendLineColor: '#1F9D55',
  lineWidth: 2,
};

const SENSEX_TAPE = {
  symbols: [{ proName: 'BSE:SENSEX', title: 'SENSEX' }],
  showSymbolLogo: true,
  colorTheme: 'light',
  isTransparent: true,
  displayMode: 'compact',
  locale: 'en',
};

function Embed({
  className,
  script,
  config,
  creditHref,
  creditLabel,
}: {
  className: string;
  script: string;
  config: object;
  creditHref: string;
  creditLabel: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const slot = host?.querySelector('.tradingview-widget-container');
    if (!host || !slot) return undefined;
    let cancelled = false;
    let frameId = 0;
    const mount = () => {
      if (cancelled || slot.querySelector('script, iframe')) return;
      const scriptEl = document.createElement('script');
      scriptEl.src = script;
      scriptEl.async = true;
      scriptEl.type = 'text/javascript';
      scriptEl.innerHTML = JSON.stringify(config);
      const watch = new MutationObserver(() => {
        const frame = slot.querySelector('iframe');
        if (!frame) return;
        frame.setAttribute('scrolling', 'no');
        frame.addEventListener('load', () => setReady(true), { once: true });
        watch.disconnect();
      });
      watch.observe(slot, { childList: true, subtree: true });
      slot.appendChild(scriptEl);
    };
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      frameId = requestAnimationFrame(() => {
        frameId = requestAnimationFrame(mount);
      });
    }, { rootMargin: '160px 0px' });
    observer.observe(host);
    return () => {
      cancelled = true;
      observer.disconnect();
      cancelAnimationFrame(frameId);
      slot.querySelectorAll('script, iframe').forEach((node) => node.remove());
    };
  }, [config, script]);

  return (
    <div className={`tv-host ${className}${ready ? ' is-ready' : ''}`} ref={hostRef}>
      <div className="tv-skel" aria-hidden="true" />
      <div className="tradingview-widget-container">
        <div className="tradingview-widget-container__widget" />
        <div className="tradingview-widget-copyright">
          <a href={creditHref} target="_blank" rel="noopener nofollow">
            <span className="blue-text">{creditLabel}</span>
          </a>
          <span> by TradingView</span>
        </div>
      </div>
    </div>
  );
}

export function SensexOverview() {
  return (
    <Embed
      className="tv-mini"
      script={MINI_SCRIPT}
      config={SENSEX_MINI}
      creditHref="https://www.tradingview.com/symbols/BSE-SENSEX/"
      creditLabel="SENSEX"
    />
  );
}

export function MarketTape() {
  return (
    <div className="fw-tape">
      <Embed
        className="tv-tape"
        script={TAPE_SCRIPT}
        config={SENSEX_TAPE}
        creditHref="https://www.tradingview.com/"
        creditLabel="SENSEX"
      />
    </div>
  );
}
