/**
 * Client-side User Planning Context
 * Stores user planning inputs across calculators, goals, and diagnostic quiz
 * without requiring server accounts or sending unsolicited data.
 */

export interface UserPlanningState {
  // Last calculated goals
  sipMonthly?: number;
  sipTenureYears?: number;
  sipExpectedRate?: number;
  sipStepUpPercent?: number;

  lumpsumAmount?: number;
  lumpsumTenureYears?: number;
  lumpsumExpectedRate?: number;

  goalTargetAmount?: number;
  goalTenureYears?: number;
  goalInflationRate?: number;
  goalExistingSavings?: number;

  retCurrentAge?: number;
  retRetirementAge?: number;
  retLifeExpectancy?: number;
  retCurrentExpense?: number;
  retInflationRate?: number;
  retPreReturnRate?: number;
  retPostReturnRate?: number;
  retExistingCorpus?: number;

  // Selected or active goal archetype
  activeGoalCategory?: string;

  // Diagnostic Quiz results
  quizScore?: number;
  quizProfileTitle?: string;
  quizHorizon?: string;
  quizCompletedAt?: string;

  // Timestamp
  lastUpdatedAt: string;
}

const STORAGE_KEY = 'farcon_user_planning_context_v1';

export const planningContextService = {
  getPlanningContext(): UserPlanningState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // Fallback
    }
    return {
      lastUpdatedAt: new Date().toISOString(),
    };
  },

  updatePlanningContext(updates: Partial<UserPlanningState>): UserPlanningState {
    try {
      const current = this.getPlanningContext();
      const updated: UserPlanningState = {
        ...current,
        ...updates,
        lastUpdatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return { ...updates, lastUpdatedAt: new Date().toISOString() };
    }
  },

  clearPlanningContext(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },
};
