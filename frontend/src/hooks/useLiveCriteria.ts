import { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { PREPROD_CONTRACT_ADDRESS, MIN_GPA_THRESHOLD, MAX_INCOME_THRESHOLD } from '../config';
import { Contract } from '../managed/contract/index.js';

export function useLiveCriteria() {
  const { session } = useWallet();
  const [liveGpa, setLiveGpa] = useState<number>(MIN_GPA_THRESHOLD);
  const [liveIncome, setLiveIncome] = useState<number>(MAX_INCOME_THRESHOLD);
  const [deadline, setDeadline] = useState<number>(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60);
  const [maxClaims, setMaxClaims] = useState<number>(100);
  const [totalClaims, setTotalClaims] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchCriteria() {
      if (!session) {
        if (mounted) {
          setLiveGpa(MIN_GPA_THRESHOLD);
          setLiveIncome(MAX_INCOME_THRESHOLD);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        const state = await session.providers.publicDataProvider.queryContractState(PREPROD_CONTRACT_ADDRESS);
        
        if (state && state.data) {
          try {
            const { ledger } = await import('../managed/contract/index.js');
            const l = ledger(state.data);
            
            if (mounted) {
              setLiveGpa(Number(l.min_gpa));
              setLiveIncome(Number(l.max_income));
              setDeadline(Number(l.application_deadline));
              setMaxClaims(Number(l.max_claims));
              setTotalClaims(Number(l.total_claims));
              setIsActive(Boolean(l.is_active));
            }
          } catch (decodeErr) {
            console.error('Failed to decode ledger:', decodeErr);
            if (mounted) {
              setLiveGpa(MIN_GPA_THRESHOLD);
              setLiveIncome(MAX_INCOME_THRESHOLD);
              setDeadline(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60);
              setMaxClaims(100);
              setTotalClaims(0);
              setIsActive(true);
            }
          }
        } else {
          if (mounted) {
            setLiveGpa(MIN_GPA_THRESHOLD);
            setLiveIncome(MAX_INCOME_THRESHOLD);
            setDeadline(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60);
            setMaxClaims(100);
            setTotalClaims(0);
            setIsActive(true);
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch live criteria from indexer:', err);
        if (mounted) {
          setError(err.message);
          setLiveGpa(MIN_GPA_THRESHOLD);
          setLiveIncome(MAX_INCOME_THRESHOLD);
          setDeadline(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60);
          setMaxClaims(100);
          setTotalClaims(0);
          setIsActive(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCriteria();

    return () => {
      mounted = false;
    };
  }, [session]);

  return { liveGpa, liveIncome, deadline, maxClaims, totalClaims, isActive, isLoading, error };
}
