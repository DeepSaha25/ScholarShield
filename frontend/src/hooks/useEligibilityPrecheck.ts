import { useMemo } from 'react';
import { MIN_GPA_THRESHOLD, MAX_INCOME_THRESHOLD } from '../config';

export type PrecheckResult = 'idle' | 'likely_eligible' | 'likely_ineligible' | 'invalid_input';

export function checkEligibility(gpaRaw: string, incomeRaw: string): PrecheckResult {
  if (!gpaRaw || !incomeRaw) return 'idle';

  const gpaValue = parseFloat(gpaRaw);
  const incomeValue = parseInt(incomeRaw, 10);

  if (
    isNaN(gpaValue) || gpaValue <= 0 || gpaValue > 10 ||
    isNaN(incomeValue) || incomeValue <= 0 || incomeValue > 4_294_967_295
  ) {
    return 'invalid_input';
  }

  const gpaScaled = BigInt(Math.round(gpaValue * 100));
  const incomeBig = BigInt(incomeValue);

  const passes = gpaScaled >= BigInt(MIN_GPA_THRESHOLD) && incomeBig <= BigInt(MAX_INCOME_THRESHOLD);

  return passes ? 'likely_eligible' : 'likely_ineligible';
}

export function useEligibilityPrecheck(gpaRaw: string, incomeRaw: string) {
  return useMemo(() => {
    return checkEligibility(gpaRaw, incomeRaw);
  }, [gpaRaw, incomeRaw]);
}
