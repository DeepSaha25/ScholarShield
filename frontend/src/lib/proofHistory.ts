export interface ProofRecord {
  id: string;
  timestamp: number;
  result: 'eligible' | 'ineligible' | 'error';
  txId?: string;
  gpaRange: string;
  incomeRange: string;
}

const STORAGE_KEY = 'scholarshield_proof_history';

export function saveProof(record: Omit<ProofRecord, 'id' | 'timestamp'>): void {
  try {
    const history = getProofHistory();
    const newRecord: ProofRecord = {
      ...record,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    history.unshift(newRecord);
    // Keep only last 50 proofs to avoid filling up localStorage
    const trimmed = history.slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save proof history', e);
  }
}

export function getProofHistory(): ProofRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse proof history', e);
    return [];
  }
}

export function clearProofHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getStats() {
  const history = getProofHistory();
  const total = history.length;
  const passed = history.filter(h => h.result === 'eligible').length;
  const failed = history.filter(h => h.result === 'ineligible').length;
  
  return { total, passed, failed };
}
