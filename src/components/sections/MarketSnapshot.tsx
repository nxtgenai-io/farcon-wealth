import React, { useEffect, useState } from 'react';
import { ExternalLink, RefreshCw, AlertCircle, TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';
import { MarketApiResponse, MarketIndexSymbol, MarketQuoteData, OfficialMarketLink } from '@/lib/market/types';
import { OFFICIAL_MARKET_LINKS } from '@/lib/api/market';
import { formatINR } from '@/lib/formatting/currency';

interface MarketSnapshotProps {
  navigate?: (path: any) => void;
}

export const MarketSnapshot: React.FC<MarketSnapshotProps> = ({ navigate }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<MarketApiResponse | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/market');
      if (!res.ok && res.status !== 502) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json: MarketApiResponse = await res.json();
      setData(json);
    } catch (err: any) {
      setFetchError(err?.message || 'Unable to connect to market feed');
      setData({
        ok: false,
        configured: false,
        status: 'unconfigured',
        message: 'Market data feed connection currently unconfigured.',
        officialLinks: OFFICIAL_MARKET_LINKS,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderSparkline = (points?: [number, number][], positive?: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points.map((p) => p[1]));
    const max = Math.max(...points.map((p) => p[1]));
    const range = max - min || 1;
    const width = 120;
    const height = 36;
    const coords = points.map((p, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((p[1] - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const strokeColor = positive ? '#15803d' : '#b91c1c';

    return (
      <svg
        className="market-mini-chart"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        aria-hidden="true"
      >
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coords.join(' ')}
        />
      </svg>
    );
  };

  return (
    <section className="hf-section market-snapshot-section" id="market-snapshot" aria-label="Market Snapshot">
      <div className="hf-wrap">
        <div className="market-head">
          <div className="market-intro">
            <span className="hf-eye">Market Overview</span>
            <h2>Market Snapshot &amp; Benchmark Context</h2>
            <p className="hf-lede">
              Macroeconomic indicators across Indian capital markets. Mutual fund distribution is planned around personal goals; broad market benchmarks offer macro context.
            </p>
          </div>
          <div className="market-actions">
            <button
              type="button"
              className="hf-btn hf-btn-outline text-xs py-2 px-3 flex items-center gap-1.5"
              onClick={loadData}
              disabled={loading}
              aria-label="Refresh market data status"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Checking feed…' : 'Check feed status'}</span>
            </button>
          </div>
        </div>

        {/* Loading skeleton state */}
        {loading && (
          <div className="market-grid-container" aria-busy="true">
            <div className="market-card skeleton-card">
              <div className="skeleton-line w-24 h-4 mb-2" />
              <div className="skeleton-line w-36 h-8 mb-3" />
              <div className="skeleton-line w-28 h-4" />
            </div>
            <div className="market-card skeleton-card">
              <div className="skeleton-line w-24 h-4 mb-2" />
              <div className="skeleton-line w-36 h-8 mb-3" />
              <div className="skeleton-line w-28 h-4" />
            </div>
          </div>
        )}

        {/* Ready State: Real Authorized Data Available */}
        {!loading && data && data.ok && data.quotes && (
          <div className="market-grid-container">
            {(['nifty', 'sensex'] as MarketIndexSymbol[]).map((key) => {
              const quote = data.quotes[key];
              if (!quote) return null;
              const isPositive = quote.change >= 0;
              return (
                <div key={key} className="market-card live-card">
                  <div className="market-card-header">
                    <div>
                      <span className="market-index-tag">{key === 'nifty' ? 'NSE Benchmark' : 'BSE Benchmark'}</span>
                      <h3 className="market-card-title">{quote.name}</h3>
                    </div>
                    {data.stale && <span className="market-badge stale-badge">Delayed / Stale</span>}
                  </div>

                  <div className="market-price-row">
                    <span className="market-price">{quote.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    <span className={`market-change-pill ${isPositive ? 'positive' : 'negative'}`}>
                      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span>
                        {isPositive ? '+' : ''}{quote.change.toFixed(2)} ({isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%)
                      </span>
                    </span>
                  </div>

                  {quote.chartPoints && renderSparkline(quote.chartPoints, isPositive)}

                  <div className="market-meta-row">
                    <span>Source: {quote.source}</span>
                    <span>{quote.asOfFormatted || 'Recent close'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Truthful Unconfigured / Awaiting Provider State */}
        {!loading && (!data || !data.ok) && (
          <div className="market-unconfigured-panel">
            <div className="unconfigured-badge-row">
              <span className="feed-status-pill">
                <ShieldCheck size={14} />
                <span>Authorized Market Feed Integration</span>
              </span>
              <span className="feed-awaiting-badge">Provider connection pending</span>
            </div>

            <div className="unconfigured-content">
              <p className="unconfigured-explanation">
                In strict adherence to SEBI mutual fund distribution regulations and stock exchange data redistribution policies (NSE and BSE), real-time and delayed benchmark quotes require an authorized commercial data feed agreement. Live price feeds are currently awaiting commercial provider credentials.
              </p>

              <div className="official-links-grid">
                {OFFICIAL_MARKET_LINKS.map((link) => (
                  <div key={link.name} className="official-link-card">
                    <div className="official-link-header">
                      <span className="official-exchange-name">{link.exchange}</span>
                      <h4 className="official-index-name">{link.name}</h4>
                    </div>
                    <p className="official-index-desc">{link.description}</p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="official-view-btn"
                      aria-label={`View ${link.name} live on official ${link.exchange} website`}
                    >
                      <span>View official exchange page</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="market-compliance-note">
              <strong>Regulatory Notice:</strong> Farcon Wealth is an AMFI-registered Mutual Fund Distributor (ARN: 329006). Benchmark index movements are shown solely for macroeconomic perspective and do not reflect or predict mutual fund scheme performance. Past performance is no guarantee of future returns.
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
