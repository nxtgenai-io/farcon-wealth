import React from 'react';
import { ExternalLink, Clock, ShieldCheck } from 'lucide-react';

export const MarketStrip: React.FC = () => {
  return (
    <div className="bg-[#101A2C] text-slate-300 border-b border-[#20314F] text-[11px] py-2 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1536px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-y-2 gap-x-6">
        {/* Left: Official Indian Benchmark Identifiers & Clear Non-Live Status */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="font-mono text-slate-400 uppercase tracking-wider text-[10px] font-semibold shrink-0">
            Official Benchmarks
          </span>

          <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-semibold text-white tracking-wide">NIFTY 50 TRI</span>
            <span className="text-[10px] text-slate-400 font-mono">(NSE Benchmark)</span>
          </div>

          <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-semibold text-white tracking-wide">S&P BSE SENSEX TRI</span>
            <span className="text-[10px] text-slate-400 font-mono">(BSE Benchmark)</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-[#15243B] text-slate-300 border border-[#20314F] font-mono shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Feed not connected · No spot quotes</span>
          </div>
        </div>

        {/* Right: Regulatory Notice & Trading Hours (Zero Fabricated Prices) */}
        <div className="flex items-center gap-3 sm:gap-4 text-slate-400 text-[10px] font-mono flex-wrap">
          <div className="flex items-center gap-1.5 shrink-0">
            <Clock className="w-3 h-3 text-[#78A832]" />
            <span>09:15–15:30 IST</span>
          </div>

          <span className="text-slate-700 hidden lg:inline" aria-hidden="true">·</span>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 shrink-0">
            <ShieldCheck className="w-3 h-3 text-[#315FCE]" />
            <span>SEBI & AMFI Registered Distributor</span>
          </div>

          <span className="text-slate-700 hidden sm:inline" aria-hidden="true">·</span>

          <a
            href="https://www.nseindia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1 shrink-0"
            title="Official National Stock Exchange of India"
          >
            <span>Official Quotes via NSE/BSE</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
