/**
 * Format currency according to Indian numbering system (Lakhs, Crores)
 * e.g., ₹1,00,000 or ₹1.5 Cr or ₹25 L
 */
export function formatINR(val: number, options?: { compact?: boolean; hideDecimals?: boolean }): string {
  if (isNaN(val) || val === null || val === undefined) return '₹0';

  const roundVal = Math.round(val);

  if (options?.compact) {
    if (Math.abs(roundVal) >= 10000000) {
      const cr = (val / 10000000).toFixed(2);
      return `₹${cr.replace(/\.00$/, '')} Cr`;
    }
    if (Math.abs(roundVal) >= 100000) {
      const lk = (val / 100000).toFixed(2);
      return `₹${lk.replace(/\.00$/, '')} L`;
    }
    if (Math.abs(roundVal) >= 1000) {
      const k = (val / 1000).toFixed(1);
      return `₹${k.replace(/\.0$/, '')}k`;
    }
  }

  // Standard Indian comma separator
  const isNegative = roundVal < 0;
  const absVal = Math.abs(roundVal).toString();

  let lastThree = absVal.substring(absVal.length - 3);
  const otherNumbers = absVal.substring(0, absVal.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function parseINR(input: string): number {
  const cleaned = input.replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
