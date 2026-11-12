/**
 * Deterministic Test Suite for Farcon Wealth Calculations & Scoring
 */
import {
  calculateSIP,
  calculateLumpsum,
  calculateGoalSIP,
  calculateRetirement,
} from './financial';
import { scoreQuiz } from '../../features/investor-quiz/quizConfig';
import { formatINR } from '../formatting/currency';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('[TEST] Starting Farcon calculation tests...');

// 1. SIP Calculation Test
const sipTest = calculateSIP(10000, 12, 10);
// 10,000/mo for 10 yrs at 12% annual compounding:
// Invested: 10,000 * 120 = 1,200,000
assert(sipTest.investedAmount === 1200000, `SIP invested should be 1,200,000, got ${sipTest.investedAmount}`);
// Expected FV approx 2,323,391 (standard formula)
assert(sipTest.projectedValue > 2300000 && sipTest.projectedValue < 2350000, `SIP FV unexpected: ${sipTest.projectedValue}`);
assert(sipTest.estimatedGain === sipTest.projectedValue - sipTest.investedAmount, 'SIP gain calculation mismatch');
console.log('✓ SIP calculation deterministic and verified:', formatINR(sipTest.projectedValue));

// 2. Lumpsum Calculation Test
const lumpTest = calculateLumpsum(100000, 12, 5);
// 100,000 * (1.12)^5 = 176,234
assert(lumpTest.investedAmount === 100000, 'Lumpsum principal incorrect');
assert(lumpTest.projectedValue === 176234, `Lumpsum FV mismatch: expected 176234, got ${lumpTest.projectedValue}`);
console.log('✓ Lumpsum calculation deterministic and verified:', formatINR(lumpTest.projectedValue));

// 3. Goal SIP Calculation Test
const goalTest = calculateGoalSIP(5000000, 12, 10, 0, 0);
assert(goalTest.requiredMonthlySIP > 21000 && goalTest.requiredMonthlySIP < 22000, `Goal SIP mismatch: ${goalTest.requiredMonthlySIP}`);
console.log('✓ Goal calculation deterministic and verified: Required SIP', formatINR(goalTest.requiredMonthlySIP));

// 4. Retirement Calculation Test
const retTest = calculateRetirement(30, 60, 85, 50000, 6, 12, 8, 0);
assert(retTest.yearsToRetire === 30, 'Years to retire mismatch');
assert(retTest.requiredRetirementCorpus > 10000000, 'Retirement corpus should be substantial');
assert(retTest.corpusAtTodayPrices > 0, 'Corpus at today prices must be positive');
assert(retTest.corpusAtTodayPrices < retTest.requiredRetirementCorpus, 'Today price corpus must be lower than inflated future corpus');
// Verify inflation discounting relationship: corpusToday * (1.06)^30 approx requiredRetirementCorpus
const recomputedFuture = Math.round(retTest.corpusAtTodayPrices * Math.pow(1.06, 30));
assert(Math.abs(recomputedFuture - retTest.requiredRetirementCorpus) < 2000, 'Discounted today corpus must compound back to future corpus');
console.log('✓ Retirement calculation deterministic and verified: Required Future Corpus', formatINR(retTest.requiredRetirementCorpus, { compact: true }), 'at today prices:', formatINR(retTest.corpusAtTodayPrices, { compact: true }));

// 4b. High-Net-Worth / Target Corpus up to ₹100 Crore
const hnwGoal = calculateGoalSIP(1000000000, 12, 20, 6, 0); // ₹100 Crore in 20 years with 6% inflation
assert(hnwGoal.futureInflationAdjustedGoal > 1000000000, 'Inflation adjusted goal should exceed 100 Cr');
assert(hnwGoal.requiredMonthlySIP > 0, 'Required monthly SIP for 100 Cr must be positive');
console.log('✓ ₹100 Crore Target Corpus calculation verified: Future target', formatINR(hnwGoal.futureInflationAdjustedGoal, { compact: true }), 'SIP:', formatINR(hnwGoal.requiredMonthlySIP));

// 4c. Configurable Inflation Variation Test (0%, 4%, 6%, 8%, 10%)
[0, 4, 6, 8, 10].forEach((rate) => {
  const varied = calculateRetirement(35, 60, 85, 60000, rate, 12, 8, 500000);
  assert(varied.inflationRate === rate, `Inflation rate should match ${rate}`);
  assert(varied.requiredRetirementCorpus > 0, 'Corpus must be positive');
});
console.log('✓ User-configurable inflation variations (0% to 10%) verified');

// 4d. Goal SIP Inflation Variations & Homepage Illustration Test
import { planIllustration, formatPlanCompact } from '../../components/sections/home/planGoal';

// Plan illustration with 0% vs 6% inflation
const planZero = planIllustration(35000000, 20, 12, 0);
assert(planZero.futureInflationAdjustedGoal === 35000000, '0% inflation target should match principal');
assert(planZero.requiredMonthlySIP > 0, 'Plan SIP should be positive');

const planWithInf = planIllustration(35000000, 20, 12, 6);
assert(planWithInf.futureInflationAdjustedGoal > 35000000, '6% inflation target should exceed base target');
assert(planWithInf.requiredMonthlySIP > planZero.requiredMonthlySIP, 'Inflation should increase required SIP');
assert(planWithInf.series.length === 20, 'Series must have 20 data points');
console.log('✓ Homepage Plan Illustration with inflation verified');

// Format compact tests
assert(formatPlanCompact(5000000) === '₹50 L', `Expected ₹50 L, got ${formatPlanCompact(5000000)}`);
assert(formatPlanCompact(35000000) === '₹3.50 Cr', `Expected ₹3.50 Cr, got ${formatPlanCompact(35000000)}`);
assert(formatPlanCompact(100000000) === '₹10 Cr', `Expected ₹10 Cr, got ${formatPlanCompact(100000000)}`);
assert(formatPlanCompact(1000000000) === '₹100 Cr', `Expected ₹100 Cr, got ${formatPlanCompact(1000000000)}`);
console.log('✓ formatPlanCompact up to ₹100 Cr verified');

// 5. Quiz Scoring Engine Test
const conservativeAnswers = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1 };
const resConservative = scoreQuiz(conservativeAnswers);
assert(resConservative.band === 'conservative', 'Should be conservative');

const growthAnswers = { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3 };
const resGrowth = scoreQuiz(growthAnswers);
assert(resGrowth.band === 'growth', 'Should be growth');

const moderateAnswers = { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2 };
const resModerate = scoreQuiz(moderateAnswers);
assert(resModerate.band === 'moderate', 'Should be moderate');
console.log('✓ Quiz scoring engine deterministic and verified across all bands');

console.log('[ALL TESTS PASSED SUCCESSFULLY]');
