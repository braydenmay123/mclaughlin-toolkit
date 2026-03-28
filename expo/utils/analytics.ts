export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
}

export const trackEvent = (event: string, properties?: Record<string, any>): void => {
  console.log(`[Analytics] ${event}`, properties);
  
  // Future: Add actual analytics service integration here
  // For now, just log to console for debugging
};

export const AnalyticsEvents = {
  GATE_SHOWN: 'gate_shown',
  GATE_SUBMITTED: 'gate_submitted',
  EDUCATION_OPEN_CHAPTER: 'education_open_chapter',
  MAPPING_ADD_ITEM: 'mapping_add_item',
  MAPPING_RESET: 'mapping_reset',
  CALC_ENTERED: 'calc_entered',
} as const;