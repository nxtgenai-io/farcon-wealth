import React, { useState, useEffect } from 'react';
import { defaultFundDataProvider, FUND_DATA_PROVENANCE } from '@/data/mockFunds';
import { MutualFundItem, RoutePath } from '@/types';
import { formatINR } from '@/lib/formatting/currency';
import { COMPLIANCE_REGISTRY } from '@/lib/compliance';
import { Search, Filter, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

interface MutualFundExplorerViewProps {
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (fundName?: string) => void;
}

export const MutualFundExplorerView: React.FC<MutualFundExplorerViewProps> = ({
  navigate,
  onOpenConsultation,
}) => {
  const [funds, setFunds] = useState<MutualFundItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [assetClassFilter, setAssetClassFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    defaultFundDataProvider.getFunds().then((data) => setFunds(data));
  }, []);

  const filteredFunds = funds.filter((f) => {
    if (categoryFilter !== 'All' && f.category !== categoryFilter) return false;
    if (assetClassFilter !== 'All' && f.assetClass !== assetClassFilter) return false;
    if (
      searchQuery.trim() &&
      !f.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !f.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#78A832]">
          Discovery & Suitability Exploration
        </span>
        <h1 className="mt-2.5 text-3xl sm:text-4xl lg:text-5xl font-poppins font-medium text-slate-900 tracking-tight">
          Mutual Fund Category Explorer
        </h1>
        <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
          Understand before you invest. Explore indicative fund categories, riskometer grades, benchmark indices, and suitability horizons.
        </p>

        {/* Prototype Demo Banner with Provenance */}
        <div className="mt-5 inline-flex flex-col sm:flex-row items-center gap-2 px-4 py-2 bg-amber-50/90 border border-amber-200/90 rounded-xl text-xs text-amber-900 text-left">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
            <span className="font-semibold">
              Data Provenance: {FUND_DATA_PROVENANCE.source}
            </span>
          </div>
          <span className="text-amber-800/90 font-mono text-[11px] sm:before:content-['·_']">
            As of: {FUND_DATA_PROVENANCE.asOfDate} · Simulated educational sample data
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by category or scheme type..."
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-lg focus:border-slate-900 focus:outline-hidden"
          />
        </div>

        {/* Asset Class Filter Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['All', 'Equity', 'Hybrid', 'Debt'].map((ac) => (
            <button
              key={ac}
              onClick={() => setAssetClassFilter(ac)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                assetClassFilter === ac
                  ? 'bg-[#101A2C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ac}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {filteredFunds.map((fund) => (
          <div
            key={fund.id}
            className="bg-white rounded-2xl border border-[#DCE4EE] shadow-xs p-6 sm:p-7 flex flex-col justify-between hover:border-slate-300 transition-all group"
          >
            <div>
              {/* Category & Riskometer Unboxed Metadata */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span className="font-semibold text-[#315FCE]">{fund.category}</span>
                <span className="text-slate-500 text-[11px]">SEBI Riskometer: {fund.riskometer}</span>
              </div>

              <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 leading-snug group-hover:text-[#78A832] transition-colors">
                {fund.name}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                {fund.description}
              </p>

              {/* Data Table */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 py-3.5 border-y border-[#DCE4EE] text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Indicative NAV</span>
                  <span className="font-mono font-semibold text-slate-900">₹{fund.nav.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">3Y CAGR (Demo)</span>
                  <span className="font-mono font-semibold text-[#78A832]">+{fund.cagr3Y}%</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Expense Ratio</span>
                  <span className="font-mono text-slate-700">{fund.expenseRatio}%</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Min. Monthly SIP</span>
                  <span className="font-mono text-slate-700">{formatINR(fund.minSIP)}/mo</span>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Benchmark: <strong className="text-slate-700">{fund.benchmark}</strong></span>
              </div>
            </div>

            {/* Card Action */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Horizon: <strong className="text-slate-800">{fund.suitableHorizon}</strong>
              </span>
              <button
                onClick={() => onOpenConsultation(`Discuss suitability for ${fund.name}`)}
                className="text-xs font-semibold text-[#101A2C] group-hover:text-[#78A832] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Check Suitability</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFunds.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-600">No demonstration funds found matching your criteria.</p>
          <button
            onClick={() => {
              setCategoryFilter('All');
              setAssetClassFilter('All');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-semibold text-[#78A832] hover:underline"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Disclaimers */}
      <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs text-slate-600 leading-relaxed space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-[#78A832]" />
          <span>{COMPLIANCE_REGISTRY.distributor.amfiRegistration}</span>
        </div>
        <p className="text-slate-500 pl-6">
          {COMPLIANCE_REGISTRY.scheme.disclaimer} {COMPLIANCE_REGISTRY.statutoryMutualFund.standardRisk} {COMPLIANCE_REGISTRY.statutoryMutualFund.pastPerformance}
        </p>
      </div>
    </div>
  );
};
