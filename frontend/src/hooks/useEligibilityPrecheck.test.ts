import { describe, it, expect, vi } from 'vitest';
import { checkEligibility } from './useEligibilityPrecheck';

// We mock the config values for predictable tests
vi.mock('../config', () => ({
  MIN_GPA_THRESHOLD: 800,
  MAX_INCOME_THRESHOLD: 250000
}));

describe('eligibility precheck logic', () => {
  it('returns idle for empty inputs', () => {
    expect(checkEligibility('', '')).toBe('idle');
    expect(checkEligibility('8', '')).toBe('idle');
  });

  it('detects invalid gpa', () => {
    expect(checkEligibility('-1', '100000')).toBe('invalid_input');
    expect(checkEligibility('11', '100000')).toBe('invalid_input');
    expect(checkEligibility('abc', '100000')).toBe('invalid_input');
  });

  it('detects invalid income', () => {
    expect(checkEligibility('8', '-100')).toBe('invalid_input');
    expect(checkEligibility('8', '5000000000')).toBe('invalid_input');
  });

  it('identifies likely eligible applicants', () => {
    expect(checkEligibility('8.0', '250000')).toBe('likely_eligible');
    expect(checkEligibility('9.5', '100000')).toBe('likely_eligible');
  });

  it('identifies likely ineligible applicants', () => {
    expect(checkEligibility('7.9', '100000')).toBe('likely_ineligible');
    expect(checkEligibility('8.5', '250001')).toBe('likely_ineligible');
    expect(checkEligibility('7.0', '300000')).toBe('likely_ineligible');
  });
});
