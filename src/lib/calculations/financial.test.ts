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
console.log('✓ Retirement calculation deterministic and verified: Required Corpus', formatINR(retTest.requiredRetirementCorpus, { compact: true }));

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
