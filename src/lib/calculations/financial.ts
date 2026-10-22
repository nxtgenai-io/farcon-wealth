/**
 * Pure Deterministic Financial Calculations for Mutual Funds and Wealth Planning
 * Follows industry-standard mathematical formulas used by AMFI and financial planners.
 */

export interface SIPResult {
  investedAmount: number;
  projectedValue: number;
  estimatedGain: number;
  breakdown: { year: number; invested: number; value: number }[];
}

export interface LumpsumResult {
  investedAmount: number;
  projectedValue: number;
  estimatedGain: number;
  breakdown: { year: number; invested: number; value: number }[];
}

export interface GoalResult {
  targetAmount: number;
  tenureYears: number;
  expectedReturnRate: number;
  requiredMonthlySIP: number;
  totalInvestment: number;
  futureInflationAdjustedGoal: number;
  existingSavings: number;
  existingFutureValue: number;
  shortfall: number;
  surplus: number;
  inflationRate: number;
  breakdown: { year: number; accumulated: number; target: number }[];
}

export interface RetirementResult {
  currentAge: number;
  retirementAge: number;
  yearsToRetire: number;
  lifeExpectancy: number;
  yearsInRetirement: number;
  currentMonthlyExpense: number;
  monthlyExpenseAtRetirement: number;
  requiredRetirementCorpus: number;
  existingCorpusFutureValue: number;
  netCorpusDeficit: number;
  requiredMonthlySIP: number;
  inflationRate: number;
  preRetirementReturn: number;
  postRetirementReturn: number;
  breakdown: { age: number; accumulatedCorpus: number; phase: 'accumulation' | 'distribution' }[];
}

/**
 * SIP Future Value formula:
 * FV = P * [((1 + i)^n - 1) / i] * (1 + i)
 * where:
 * P = Monthly investment
 * i = Monthly rate (annualRate / 12 / 100)
 * n = Number of months (tenureYears * 12)
 */
export function calculateSIP(monthlyInvestment: number, annualRate: number, tenureYears: number): SIPResult {
  const p = Math.max(0, monthlyInvestment);
  const r = Math.max(0.1, annualRate) / 100;
  const i = r / 12;
  const n = Math.max(1, tenureYears) * 12;

  // Total Invested
  const investedAmount = Math.round(p * n);

  // Future value calculation
  const fv = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const projectedValue = Math.round(fv);
  const estimatedGain = Math.max(0, projectedValue - investedAmount);

  // Yearly progression breakdown
  const breakdown: { year: number; invested: number; value: number }[] = [];
  for (let yr = 1; yr <= tenureYears; yr++) {
    const months = yr * 12;
    const inv = Math.round(p * months);
    const val = Math.round(p * ((Math.pow(1 + i, months) - 1) / i) * (1 + i));
    breakdown.push({ year: yr, invested: inv, value: val });
  }

  return {
    investedAmount,
    projectedValue,
    estimatedGain,
    breakdown,
  };
}

/**
 * Step-Up SIP (Top-Up SIP) Future Value:
 * Monthly investment increases annually by stepUpPercent (e.g. 10% every year).
 */
export function calculateStepUpSIP(
  initialMonthlyInvestment: number,
  annualRate: number,
  tenureYears: number,
  annualStepUpPercent: number
): SIPResult {
  if (annualStepUpPercent <= 0) {
    return calculateSIP(initialMonthlyInvestment, annualRate, tenureYears);
  }

  const r = Math.max(0.1, annualRate) / 100;
  const i = r / 12;
  const totalMonths = Math.max(1, tenureYears) * 12;
  const stepUpFraction = annualStepUpPercent / 100;

  let totalInvested = 0;
  let futureValue = 0;
  const breakdown: { year: number; invested: number; value: number }[] = [];

  let runningInvested = 0;

  for (let m = 1; m <= totalMonths; m++) {
    const yearIndex = Math.floor((m - 1) / 12);
    const currentMonthlySIP = Math.round(
      initialMonthlyInvestment * Math.pow(1 + stepUpFraction, yearIndex)
    );

    runningInvested += currentMonthlySIP;
    const remainingMonths = totalMonths - m + 1;
    futureValue += currentMonthlySIP * Math.pow(1 + i, remainingMonths);

    if (m % 12 === 0) {
      const yr = m / 12;
      let yrFV = 0;
      for (let prevM = 1; prevM <= m; prevM++) {
        const prevYrIdx = Math.floor((prevM - 1) / 12);
        const prevSIP = Math.round(initialMonthlyInvestment * Math.pow(1 + stepUpFraction, prevYrIdx));
        yrFV += prevSIP * Math.pow(1 + i, m - prevM + 1);
      }
      breakdown.push({
        year: yr,
        invested: Math.round(runningInvested),
        value: Math.round(yrFV),
      });
    }
  }

  totalInvested = Math.round(runningInvested);
  const projectedValue = Math.round(futureValue);
  const estimatedGain = Math.max(0, projectedValue - totalInvested);

  return {
    investedAmount: totalInvested,
    projectedValue,
    estimatedGain,
    breakdown,
  };
}

/**
 * Lumpsum Future Value formula:
 * FV = P * (1 + r)^t
 * where:
 * P = Initial investment
 * r = Annual rate / 100
 * t = Tenure in years
 */
export function calculateLumpsum(investment: number, annualRate: number, tenureYears: number): LumpsumResult {
  const p = Math.max(0, investment);
  const r = Math.max(0.1, annualRate) / 100;
  const t = Math.max(1, tenureYears);

  const investedAmount = Math.round(p);
  const projectedValue = Math.round(p * Math.pow(1 + r, t));
  const estimatedGain = Math.max(0, projectedValue - investedAmount);

  const breakdown: { year: number; invested: number; value: number }[] = [];
  for (let yr = 1; yr <= t; yr++) {
    const val = Math.round(p * Math.pow(1 + r, yr));
    breakdown.push({ year: yr, invested: investedAmount, value: val });
  }

  return {
    investedAmount,
    projectedValue,
    estimatedGain,
    breakdown,
  };
}

/**
 * Goal SIP formula:
 * Computes the required monthly SIP needed to accumulate a target corpus,
 * optionally taking inflation into account.
 * Target FV = Current Cost * (1 + inflation)^years
 * SIP = Target FV / [ {((1 + i)^n - 1) / i} * (1 + i) ]
 */
export function calculateGoalSIP(
  targetAmount: number,
  annualRate: number,
  tenureYears: number,
  inflationRate: number = 0,
  existingSavings: number = 0
): GoalResult {
  const years = Math.max(1, tenureYears);
  const infl = Math.max(0, inflationRate) / 100;
  const futureInflationAdjustedGoal = Math.round(targetAmount * Math.pow(1 + infl, years));

  const r = Math.max(0.1, annualRate) / 100;
  const i = r / 12;
  const n = years * 12;

  // If there are existing savings compounding at the return rate:
  const existingFutureVal = Math.round(existingSavings * Math.pow(1 + r, years));
  const netTargetNeeded = Math.max(0, futureInflationAdjustedGoal - existingFutureVal);

  const factor = ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const requiredMonthlySIP = factor > 0 ? Math.round(netTargetNeeded / factor) : 0;
  const totalInvestment = requiredMonthlySIP * n + existingSavings;

  const breakdown: { year: number; accumulated: number; target: number }[] = [];
  for (let yr = 1; yr <= years; yr++) {
    const months = yr * 12;
    const sipVal = requiredMonthlySIP * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
    const existingVal = existingSavings * Math.pow(1 + r, yr);
    breakdown.push({
      year: yr,
      accumulated: Math.round(sipVal + existingVal),
      target: futureInflationAdjustedGoal,
    });
  }

  return {
    targetAmount,
    tenureYears: years,
    expectedReturnRate: annualRate,
    requiredMonthlySIP,
    totalInvestment,
    futureInflationAdjustedGoal,
    existingSavings: Math.round(existingSavings),
    existingFutureValue: existingFutureVal,
    shortfall: netTargetNeeded,
    surplus: Math.max(0, existingFutureVal - futureInflationAdjustedGoal),
    inflationRate,
    breakdown,
  };
}

/**
 * Comprehensive Retirement Corpus Planning:
 * 1. Adjust current expenses for inflation until retirement age.
 * 2. Calculate retirement duration (Life Expectancy - Retirement Age).
 * 3. Calculate corpus needed at retirement using real rate of return during post-retirement.
 * 4. Deduct future value of existing savings.
 * 5. Calculate monthly SIP needed during pre-retirement accumulation years.
 */
export function calculateRetirement(
  currentAge: number,
  retirementAge: number,
  lifeExpectancy: number = 85,
  currentMonthlyExpense: number = 50000,
  inflationRate: number = 6,
  preRetirementReturn: number = 12,
  postRetirementReturn: number = 8,
  existingCorpus: number = 0
): RetirementResult {
  const curAge = Math.max(18, currentAge);
  const retAge = Math.max(curAge + 1, retirementAge);
  const expAge = Math.max(retAge + 5, lifeExpectancy);

  const yearsToRetire = retAge - curAge;
  const yearsInRetirement = expAge - retAge;

  const inf = inflationRate / 100;
  const preR = preRetirementReturn / 100;
  const postR = postRetirementReturn / 100;

  // Monthly expense at retirement
  const monthlyExpenseAtRetirement = Math.round(
    currentMonthlyExpense * Math.pow(1 + inf, yearsToRetire)
  );
  const annualExpenseAtRetirement = monthlyExpenseAtRetirement * 12;

  // Real rate of return in retirement: (1 + postR) / (1 + inf) - 1
  const realRate = (1 + postR) / (1 + inf) - 1;

  // Present value of annuity for post-retirement expenses
  let requiredRetirementCorpus: number;
  if (Math.abs(realRate) < 0.0001) {
    requiredRetirementCorpus = Math.round(annualExpenseAtRetirement * yearsInRetirement);
  } else {
    requiredRetirementCorpus = Math.round(
      annualExpenseAtRetirement *
        ((1 - Math.pow(1 + realRate, -yearsInRetirement)) / realRate) *
        (1 + realRate)
    );
  }

  // Future value of existing corpus at retirement
  const existingCorpusFutureValue = Math.round(
    existingCorpus * Math.pow(1 + preR, yearsToRetire)
  );

  const netCorpusDeficit = Math.max(0, requiredRetirementCorpus - existingCorpusFutureValue);

  // SIP needed to accumulate net deficit
  const i = preR / 12;
  const n = yearsToRetire * 12;
  const factor = ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const requiredMonthlySIP = factor > 0 ? Math.round(netCorpusDeficit / factor) : 0;

  // Age progression breakdown
  const breakdown: { age: number; accumulatedCorpus: number; phase: 'accumulation' | 'distribution' }[] = [];
  for (let age = curAge; age <= expAge; age += 2) {
    if (age <= retAge) {
      const yrs = age - curAge;
      const months = yrs * 12;
      const sipAccum = months > 0 ? requiredMonthlySIP * ((Math.pow(1 + i, months) - 1) / i) * (1 + i) : 0;
      const existAccum = existingCorpus * Math.pow(1 + preR, yrs);
      breakdown.push({
        age,
        accumulatedCorpus: Math.round(sipAccum + existAccum),
        phase: 'accumulation',
      });
    } else {
      breakdown.push({
        age,
        accumulatedCorpus: requiredRetirementCorpus,
        phase: 'distribution',
      });
    }
  }

  return {
    currentAge: curAge,
    retirementAge: retAge,
    yearsToRetire,
    lifeExpectancy: expAge,
    yearsInRetirement,
    currentMonthlyExpense,
    monthlyExpenseAtRetirement,
    requiredRetirementCorpus,
    existingCorpusFutureValue,
    netCorpusDeficit,
    requiredMonthlySIP,
    inflationRate,
    preRetirementReturn,
    postRetirementReturn,
    breakdown,
  };
}
