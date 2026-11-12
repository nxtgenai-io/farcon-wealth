/**
 * Comprehensive Deterministic Test Suite for Farcon Wealth Calculations & Scoring
 * Verifies exact benchmark values, contribution timing, inflation variations, and boundary conditions.
 */
import {
  calculateSIP,
  calculateLumpsum,
  calculateGoalSIP,
  calculateRetirement,
} from './financial';
import { planIllustration, formatPlanCompact } from '../../components/sections/home/planGoal';
import { scoreQuiz } from '../../features/investor-quiz/quizConfig';
import { formatINR } from '../formatting/currency';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('[TEST] Starting Farcon comprehensive financial calculation tests...');

// 1. SIP Benchmark Test
// Parameters: ₹10,000/mo, 12% annual rate, 10 years (120 months)
// Formula: FV = P * [((1 + i)^n - 1) / i] * (1 + i) where i = 0.01, n = 120
// Factor = ((1.01^120 - 1) / 0.01) * 1.01 = 232.33908
// Expected: Invested = 1,200,000; FV = 2,323,391; Gain = 1,123,391
const sipTest = calculateSIP(10000, 12, 10);
assert(sipTest.investedAmount === 1200000, `SIP invested should be 1,200,000, got ${sipTest.investedAmount}`);
assert(sipTest.projectedValue === 2323391, `SIP FV mismatch: expected 2323391, got ${sipTest.projectedValue}`);
assert(sipTest.estimatedGain === 1123391, `SIP gain mismatch: expected 1123391, got ${sipTest.estimatedGain}`);
assert(sipTest.breakdown.length === 10, 'SIP breakdown must have 10 annual intervals');
console.log('✓ 1. SIP benchmark exact match verified:', formatINR(sipTest.projectedValue));

// 2. Lumpsum Benchmark Test
// Parameters: ₹100,000 principal, 12% annual rate, 5 years
// Formula: FV = P * (1 + r)^t = 100,000 * (1.12)^5 = 176,234.168 -> 176,234
const lumpTest = calculateLumpsum(100000, 12, 5);
assert(lumpTest.investedAmount === 100000, 'Lumpsum principal incorrect');
assert(lumpTest.projectedValue === 176234, `Lumpsum FV mismatch: expected 176234, got ${lumpTest.projectedValue}`);
assert(lumpTest.estimatedGain === 76234, `Lumpsum gain mismatch: expected 76234, got ${lumpTest.estimatedGain}`);
console.log('✓ 2. Lumpsum benchmark exact match verified:', formatINR(lumpTest.projectedValue));

// 3. Goal SIP Benchmarks with Zero and Non-Zero Inflation (0%, 6%, 8%, 12%)
// Target: ₹50 Lakh (₹5,000,000), 10 years, 12% return
// FV Factor (10 yrs, 12%) = 232.33908

// 3a. Zero Inflation (0%)
// Future Target = 5,000,000; Required SIP = 5,000,000 / 232.33908 = 21,520
const goalZero = calculateGoalSIP(5000000, 12, 10, 0, 0);
assert(goalZero.futureInflationAdjustedGoal === 5000000, '0% inflation future goal must match target');
assert(goalZero.requiredMonthlySIP === 21520, `0% inflation SIP expected 21520, got ${goalZero.requiredMonthlySIP}`);
assert(goalZero.shortfall === 5000000, 'Shortfall should match full target when no savings exist');

// 3b. Moderate Inflation (6%)
// Future Target = 5,000,000 * (1.06)^10 = 8,954,238; Required SIP = 8,954,238 / 232.33908 = 38,540
const goalSix = calculateGoalSIP(5000000, 12, 10, 6, 0);
assert(goalSix.futureInflationAdjustedGoal === 8954238, `6% inflation future target expected 8954238, got ${goalSix.futureInflationAdjustedGoal}`);
assert(goalSix.requiredMonthlySIP === 38540, `6% inflation SIP expected 38540, got ${goalSix.requiredMonthlySIP}`);

// 3c. Higher Inflation (8%)
// Future Target = 5,000,000 * (1.08)^10 = 10,794,625; Required SIP = 10,794,625 / 232.33908 = 46,461
const goalEight = calculateGoalSIP(5000000, 12, 10, 8, 0);
assert(goalEight.futureInflationAdjustedGoal === 10794625, `8% inflation future target expected 10794625, got ${goalEight.futureInflationAdjustedGoal}`);
assert(goalEight.requiredMonthlySIP === 46461, `8% inflation SIP expected 46461, got ${goalEight.requiredMonthlySIP}`);

// 3d. Upper Bound Inflation (12%)
// Future Target = 5,000,000 * (1.12)^10 = 15,529,241; Required SIP = 15,529,241 / 232.33908 = 66,839
const goalTwelve = calculateGoalSIP(5000000, 12, 10, 12, 0);
assert(goalTwelve.futureInflationAdjustedGoal === 15529241, `12% inflation future target expected 15529241, got ${goalTwelve.futureInflationAdjustedGoal}`);
assert(goalTwelve.requiredMonthlySIP === 66839, `12% inflation SIP expected 66839, got ${goalTwelve.requiredMonthlySIP}`);
console.log('✓ 3. Goal SIP benchmarks across 0%, 6%, 8%, and 12% inflation verified');

// 4. Existing Savings Treatment: Surplus and Shortfall Cases
// Target: ₹50 Lakh, 10 yrs, 12% return, 6% inflation -> Future Target = 8,954,238
// Existing savings of ₹20 Lakh growing at 12% for 10 years: 2,000,000 * (1.12)^10 = 6,211,696
// Net Target Needed (Shortfall) = 8,954,238 - 6,211,696 = 2,742,542
// Required SIP = 2,742,542 / 232.33908 = 11,804
const goalWithSavings = calculateGoalSIP(5000000, 12, 10, 6, 2000000);
assert(goalWithSavings.existingFutureValue === 6211696, `Existing FV mismatch: ${goalWithSavings.existingFutureValue}`);
assert(goalWithSavings.shortfall === 2742542, `Shortfall mismatch: ${goalWithSavings.shortfall}`);
assert(goalWithSavings.surplus === 0, 'Surplus should be 0 when shortfall exists');
assert(goalWithSavings.requiredMonthlySIP === 11804, `Required SIP expected 11804, got ${goalWithSavings.requiredMonthlySIP}`);

// Surplus Case: Existing savings of ₹30 Lakh growing at 12% for 10 yrs: 3,000,000 * (1.12)^10 = 9,317,545
// 9,317,545 > 8,954,238 -> Surplus = 363,307, Shortfall = 0, Required SIP = 0
const goalSurplus = calculateGoalSIP(5000000, 12, 10, 6, 3000000);
assert(goalSurplus.existingFutureValue === 9317545, `Existing FV mismatch: ${goalSurplus.existingFutureValue}`);
assert(goalSurplus.shortfall === 0, 'Shortfall must be 0 in surplus scenario');
assert(goalSurplus.surplus === 363307, `Surplus expected 363307, got ${goalSurplus.surplus}`);
assert(goalSurplus.requiredMonthlySIP === 0, 'Required SIP must be 0 when already in surplus');
console.log('✓ 4. Existing savings shortfall & surplus cases verified');

// 5. High-Net-Worth ₹100 Crore Target Corpus Benchmark
// Parameters: Target ₹100 Cr (1,000,000,000), 20 years, 12% return, 6% inflation
// Future Target = 1,000,000,000 * (1.06)^20 = 3,207,135,472 (~₹320.71 Cr)
// Factor (20 yrs, 12%) = ((1.01^240 - 1) / 0.01) * 1.01 = 999.1479
// Required Monthly SIP = 3,207,135,472 / 999.1479 = 3,209,871 (~₹32.1 Lakh/month)
const hnwGoal = calculateGoalSIP(1000000000, 12, 20, 6, 0);
assert(hnwGoal.futureInflationAdjustedGoal === 3207135472, `HNW FV expected 3207135472, got ${hnwGoal.futureInflationAdjustedGoal}`);
assert(hnwGoal.requiredMonthlySIP === 3209871, `HNW SIP expected 3209871, got ${hnwGoal.requiredMonthlySIP}`);
console.log('✓ 5. ₹100 Crore Target Corpus exact benchmark verified: Target FV', formatINR(hnwGoal.futureInflationAdjustedGoal, { compact: true }), 'SIP:', formatINR(hnwGoal.requiredMonthlySIP));

// 6. Retirement Corpus and Required SIP Benchmark
// Parameters: Age 30, Retire 60 (30 yrs to retire), Life Expectancy 85 (25 yrs in retire)
// Monthly Expense: ₹50,000; Inflation: 6%; Pre-Ret Return: 12%; Post-Ret Return: 8%; Existing: 0
// Monthly Expense at retirement = 50,000 * (1.06)^30 = 287,175
// Required Future Corpus = 69,469,039 (~₹6.95 Cr)
// Corpus at Today's Prices = 69,469,039 / (1.06)^30 = 12,095,263 (~₹1.21 Cr)
// Required Monthly SIP (30 yrs, 12% to reach 6.95 Cr) = 19,680
const retTest = calculateRetirement(30, 60, 85, 50000, 6, 12, 8, 0);
assert(retTest.yearsToRetire === 30, 'Years to retire mismatch');
assert(retTest.yearsInRetirement === 25, 'Years in retirement mismatch');
assert(retTest.monthlyExpenseAtRetirement === 287175, `Expense at retire expected 287175, got ${retTest.monthlyExpenseAtRetirement}`);
assert(retTest.requiredRetirementCorpus === 69469039, `Corpus expected 69469039, got ${retTest.requiredRetirementCorpus}`);
assert(retTest.corpusAtTodayPrices === 12095263, `Today corpus expected 12095263, got ${retTest.corpusAtTodayPrices}`);
assert(retTest.requiredMonthlySIP === 19680, `Required SIP expected 19680, got ${retTest.requiredMonthlySIP}`);

// Discounting check: corpusAtTodayPrices * (1.06)^30 must round back to requiredRetirementCorpus
const recomputedFuture = Math.round(retTest.corpusAtTodayPrices * Math.pow(1.06, 30));
assert(Math.abs(recomputedFuture - retTest.requiredRetirementCorpus) < 2000, 'Discounted today corpus must compound back to future corpus');
console.log('✓ 6. Retirement calculation exact benchmark verified: Future Corpus', formatINR(retTest.requiredRetirementCorpus, { compact: true }), 'at today prices:', formatINR(retTest.corpusAtTodayPrices, { compact: true }), 'SIP:', formatINR(retTest.requiredMonthlySIP));

// 7. Homepage Plan Illustration & Formatting Tests
const planZero = planIllustration(35000000, 20, 12, 0);
assert(planZero.futureInflationAdjustedGoal === 35000000, '0% inflation target should match principal');
assert(planZero.requiredMonthlySIP === 35030, `Plan SIP at 0% inflation expected 35030, got ${planZero.requiredMonthlySIP}`);

const planWithInf = planIllustration(35000000, 20, 12, 6);
assert(planWithInf.futureInflationAdjustedGoal === 112249742, `6% inflation target expected 112249742, got ${planWithInf.futureInflationAdjustedGoal}`);
assert(planWithInf.requiredMonthlySIP === 112345, `Plan SIP at 6% inflation expected 112345, got ${planWithInf.requiredMonthlySIP}`);
assert(planWithInf.series.length === 20, 'Series must have 20 data points');

assert(formatPlanCompact(5000000) === '₹50 L', `Expected ₹50 L, got ${formatPlanCompact(5000000)}`);
assert(formatPlanCompact(35000000) === '₹3.50 Cr', `Expected ₹3.50 Cr, got ${formatPlanCompact(35000000)}`);
assert(formatPlanCompact(100000000) === '₹10 Cr', `Expected ₹10 Cr, got ${formatPlanCompact(100000000)}`);
assert(formatPlanCompact(1000000000) === '₹100 Cr', `Expected ₹100 Cr, got ${formatPlanCompact(1000000000)}`);
console.log('✓ 7. Homepage plan illustration & formatPlanCompact up to ₹100 Cr verified');

// 8. Boundary Conditions and Invalid Inputs
// 8a. Zero tenure (clamped safely to 1 year)
const zeroTenure = calculateSIP(10000, 12, 0);
assert(zeroTenure.investedAmount === 120000, 'Zero tenure must clamp to 1 year (120,000)');

// 8b. Zero or Negative return rate (clamped safely to 0.1% minimum)
const zeroRate = calculateSIP(10000, -5, 1);
assert(zeroRate.projectedValue > zeroRate.investedAmount, 'Negative return clamped safely');

// 8c. Negative monthly amount (clamped safely to 0)
const negAmount = calculateSIP(-5000, 12, 5);
assert(negAmount.investedAmount === 0, 'Negative amount clamped to 0');
assert(negAmount.projectedValue === 0, 'Projected value for 0 amount is 0');

// 8d. Maximum inflation (12%)
[0, 3, 6, 8, 10, 12].forEach((rate) => {
  const varied = calculateRetirement(35, 60, 85, 60000, rate, 12, 8, 500000);
  assert(varied.inflationRate === rate, `Inflation rate should match ${rate}`);
  assert(varied.requiredRetirementCorpus > 0, 'Corpus must be positive');
});
console.log('✓ 8. Boundary conditions (zero tenure, zero rate, negative inputs, 0-12% inflation) verified');

// 9. Investor Quiz Scoring Engine Test
const conservativeAnswers = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1 };
const resConservative = scoreQuiz(conservativeAnswers);
assert(resConservative.band === 'conservative', 'Should be conservative');

const growthAnswers = { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3 };
const resGrowth = scoreQuiz(growthAnswers);
assert(resGrowth.band === 'growth', 'Should be growth');

const moderateAnswers = { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2 };
const resModerate = scoreQuiz(moderateAnswers);
assert(resModerate.band === 'moderate', 'Should be moderate');
console.log('✓ 9. Quiz scoring engine deterministic and verified across all bands');

console.log('[ALL COMPREHENSIVE TESTS PASSED SUCCESSFULLY]');
