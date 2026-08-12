import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveProof, getProofHistory, clearProofHistory, getStats } from './proofHistory';

describe('proofHistory utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize empty history', () => {
    expect(getProofHistory()).toEqual([]);
    expect(getStats()).toEqual({ total: 0, passed: 0, failed: 0 });
  });

  it('should save and retrieve a proof', () => {
    saveProof({ result: 'eligible', gpaRange: '8-9', incomeRange: '100k-150k' });
    const history = getProofHistory();
    expect(history).toHaveLength(1);
    expect(history[0].result).toBe('eligible');
    expect(history[0].gpaRange).toBe('8-9');
  });

  it('should correctly calculate stats', () => {
    saveProof({ result: 'eligible', gpaRange: '8-9', incomeRange: '100k-150k' });
    saveProof({ result: 'ineligible', gpaRange: '6-7', incomeRange: '200k-250k' });
    saveProof({ result: 'error', gpaRange: '5-6', incomeRange: '300k-350k' });
    
    const stats = getStats();
    expect(stats.total).toBe(3);
    expect(stats.passed).toBe(1);
    expect(stats.failed).toBe(1);
  });

  it('should clear history', () => {
    saveProof({ result: 'eligible', gpaRange: '8-9', incomeRange: '100k-150k' });
    clearProofHistory();
    expect(getProofHistory()).toEqual([]);
    expect(getStats()).toEqual({ total: 0, passed: 0, failed: 0 });
  });
});
