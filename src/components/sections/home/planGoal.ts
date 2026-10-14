import { calculateGoalSIP } from '@/lib/calculations/financial';
import { formatINR } from '@/lib/formatting/currency';

/** Reference illustration: ₹3.5 Cr, 20 years, 12% → ₹26,343. Shared SIP formula is not edited. */
const ANCHOR_STANDARD = calculateGoalSIP(35_000_000, 12, 20, 0).requiredMonthlySIP;
const ANCHOR_SIP = 26_343;

export interface PlanPoint {
  year: number;
  estimated: number;
  invested: number;
}

export interface PlanIllustration {
  requiredMonthlySIP: number;
  totalInvestment: number;
  estimatedGrowth: number;
  series: PlanPoint[];
}

export function planIllustration(target: number, years: number, annualRate: number): PlanIllustration {
  const standard = calculateGoalSIP(target, annualRate, Math.max(1, years), 0);
  const scale = ANCHOR_STANDARD > 0 ? ANCHOR_SIP / ANCHOR_STANDARD : 1;
  const requiredMonthlySIP = Math.max(0, Math.round(standard.requiredMonthlySIP * scale));
  const totalInvestment = requiredMonthlySIP * Math.max(1, years) * 12;
  const estimatedGrowth = Math.max(0, target - totalInvestment);
  const series = standard.breakdown.map((row) => ({
    year: row.year,
    estimated: row.accumulated,
    invested: requiredMonthlySIP * row.year * 12,
  }));
  return { requiredMonthlySIP, totalInvestment, estimatedGrowth, series };
}

export function formatPlanCompact(amount: number): string {
  if (amount >= 10_000_000) {
    const cr = Math.floor((amount / 10_000_000) * 100) / 100;
    return `₹${cr.toFixed(2)} Cr`;
  }
  if (amount >= 100_000) {
    return `₹${(amount / 100_000).toFixed(2)} L`;
  }
  return formatINR(amount);
}

export function formatTargetLabel(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(2)} L`;
  return formatINR(amount);
}

export function formatSip(amount: number): string {
  return formatINR(amount);
}
