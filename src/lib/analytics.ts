/**
 * Privacy-friendly, zero-PII Client-side Analytics Bus
 * Dispatches and logs business events (quiz completions, calculator interactions, consultation openings).
 * Safe for production with no external telemetry leak.
 */

export type AnalyticsEventType =
  | 'page_view'
  | 'calculator_tab_changed'
  | 'calculator_calculated'
  | 'quiz_started'
  | 'quiz_question_answered'
  | 'quiz_completed'
  | 'consultation_opened'
  | 'consultation_submitted'
  | 'goal_journey_stage_changed'
  | 'goal_journey_archetype_changed'
  | 'scheme_filter_changed';

export interface AnalyticsEvent {
  event: AnalyticsEventType;
  properties?: Record<string, string | number | boolean | undefined>;
  timestamp: string;
}

const ANALYTICS_STORAGE_KEY = 'farcon_analytics_events_v1';
const MAX_STORED_EVENTS = 100;

export const analytics = {
  track(event: AnalyticsEventType, properties?: Record<string, string | number | boolean | undefined>): void {
    const payload: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date().toISOString(),
    };

    // Store capped in session for QA/debugging
    try {
      const raw = sessionStorage.getItem(ANALYTICS_STORAGE_KEY);
      const existing: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
      existing.unshift(payload);
      sessionStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(existing.slice(0, MAX_STORED_EVENTS)));
    } catch {
      // In private browsing mode or storage disabled, fail silently
    }
  },

  getRecentEvents(): AnalyticsEvent[] {
    try {
      const raw = sessionStorage.getItem(ANALYTICS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
};
