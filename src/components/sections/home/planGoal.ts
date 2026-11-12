import { calculateGoalSIP } from '@/lib/calculations/financial';
import { formatINR } from '@/lib/formatting/currency';

export interface PlanPoint {
  year: number;
  estimated: number;
  invested: number;
}

export interface PlanIllustration {
  requiredMonthlySIP: number;
  totalInvestment: number;
  estimatedGrowth: number;
  futureInflationAdjustedGoal: number;
  series: PlanPoint[];
}

export function planIllustration(
  target: number,
  years: number,
  annualRate: number,
  inflation: number = 0
): PlanIllustration {
  const safeYears = Math.max(1, years);
  const standard = calculateGoalSIP(target, annualRate, safeYears, inflation, 0);
  const requiredMonthlySIP = Math.max(0, standard.requiredMonthlySIP);
  const totalInvestment = requiredMonthlySIP * safeYears * 12;
  const futureInflationAdjustedGoal = standard.futureInflationAdjustedGoal;
  const estimatedGrowth = Math.max(0, futureInflationAdjustedGoal - totalInvestment);
  const series = standard.breakdown.map((row) => ({
    year: row.year,
    estimated: row.accumulated,
    invested: requiredMonthlySIP * row.year * 12,
  }));
  return { requiredMonthlySIP, totalInvestment, estimatedGrowth, futureInflationAdjustedGoal, series };
}

export function formatPlanCompact(amount: number): string {
  if (amount >= 10_000_000) {
    const cr = Math.round((amount / 10_000_000) * 100) / 100;
    return Number.isInteger(cr) ? `₹${cr} Cr` : `₹${cr.toFixed(2)} Cr`;
  }
  if (amount >= 100_000) {
    const l = Math.round((amount / 100_000) * 100) / 100;
    return Number.isInteger(l) ? `₹${l} L` : `₹${l.toFixed(2)} L`;
  }
  return formatINR(amount);
}

export function formatTargetLabel(amount: number): string {
  return formatPlanCompact(amount);
}

export function formatSip(amount: number): string {
  return formatINR(amount);
}
