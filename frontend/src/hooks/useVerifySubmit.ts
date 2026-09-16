import { useState, useCallback, useRef } from 'react';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { createUnprovenCallTx, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { Contract } from '../managed/contract/index.js';
import { PREPROD_CONTRACT_ADDRESS, MIN_GPA_THRESHOLD, MAX_INCOME_THRESHOLD } from '../config';
import { saveProof } from '../lib/proofHistory';
import { useWallet } from '../contexts/WalletContext';

export type VerifyStatus = 'idle' | 'proving' | 'submitting' | 'eligible' | 'ineligible' | 'error';

function getCompiledContract() {
  return CompiledContract.make('ScholarshipContract', Contract).pipe(
    CompiledContract.withVacantWitnesses,
    CompiledContract.withCompiledFileAssets(new URL('/managed', window.location.origin).toString()),
  ) as any;
}

export function useVerifySubmit(
  gpaRaw: string,
  incomeRaw: string,
  addToast: (type: 'success' | 'error', message: string) => void
) {
  const { session, isConnected } = useWallet();
  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [txId, setTxId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const isProcessing = useRef(false);

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorMsg(null);
    setTxId(null);
  }, []);

  const submit = useCallback(async () => {
    if (!session || !isConnected) return;
    if (isProcessing.current) return;
    
    const trimmedGpa = gpaRaw.trim();
    const trimmedIncome = incomeRaw.trim();
    if (!trimmedGpa || !trimmedIncome) return;

    const gpaValue = parseFloat(trimmedGpa);
    const incomeValue = parseInt(trimmedIncome, 10);

    if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 10) {
      setErrorMsg('Please enter a valid GPA between 0.0 and 10.0');
      setStatus('error');
      return;
    }
    if (isNaN(incomeValue) || incomeValue < 0 || incomeValue > 4_294_967_295) {
      setErrorMsg('Please enter a valid annual income (0 to 4,294,967,295)');
      setStatus('error');
      return;
    }

    const gpaScaled = BigInt(Math.round(gpaValue * 100));
    const incomeBig = BigInt(incomeValue);

    isProcessing.current = true;
    setStatus('proving');
    setErrorMsg(null);
    setTxId(null);

    try {
      const compiledContract = getCompiledContract();

      const callTxData = await createUnprovenCallTx(session.providers as any, {
        compiledContract,
        contractAddress: PREPROD_CONTRACT_ADDRESS,
        circuitId: 'verify_eligibility',
        args: [gpaScaled, incomeBig],
      });

      setStatus('submitting');

      const id = await submitTxAsync(session.providers as any, {
        unprovenTx: callTxData.private.unprovenTx,
        circuitId: 'verify_eligibility',
      });

      setTxId(typeof id === 'string' ? id : id?.txHash ?? 'confirmed');

      const passes = gpaScaled >= BigInt(MIN_GPA_THRESHOLD) && incomeBig <= BigInt(MAX_INCOME_THRESHOLD);
      const newStatus = passes ? 'eligible' : 'ineligible';
      setStatus(newStatus);
      
      saveProof({
        result: newStatus,
        txId: typeof id === 'string' ? id : id?.txHash ?? undefined,
        gpaRange: `${Math.floor(gpaValue)}-${Math.ceil(gpaValue)}`,
        incomeRange: `${Math.floor(incomeValue / 50000) * 50}k-${Math.ceil(incomeValue / 50000) * 50}k`,
      });
      addToast('success', newStatus === 'eligible' ? 'Proof verified! You are eligible.' : 'Proof verified! You are not eligible.');
    } catch (e: any) {
      const msg: string = e?.message ?? String(e);
      if (msg.includes('GPA too low') || msg.includes('Income too high') || msg.toLowerCase().includes('assert')) {
        setStatus('ineligible');
        saveProof({
          result: 'ineligible',
          gpaRange: `${Math.floor(gpaValue)}-${Math.ceil(gpaValue)}`,
          incomeRange: `${Math.floor(incomeValue / 50000) * 50}k-${Math.ceil(incomeValue / 50000) * 50}k`,
        });
        addToast('error', 'Circuit constraint failed: Ineligible.');
      } else {
        setStatus('error');
        let friendlyMsg = msg;
        if (msg.includes('check') && msg.includes('Request failed')) {
          friendlyMsg = "1AM wallet could not submit transaction to Preprod. Please ensure your 1AM wallet is synced, unlocked, and has testnet tNIGHT (DUST) for transaction fees.";
        }
        setErrorMsg(friendlyMsg);
        saveProof({
          result: 'error',
          gpaRange: `${Math.floor(gpaValue)}-${Math.ceil(gpaValue)}`,
          incomeRange: `${Math.floor(incomeValue / 50000) * 50}k-${Math.ceil(incomeValue / 50000) * 50}k`,
        });
        addToast('error', friendlyMsg);
      }
    } finally {
      isProcessing.current = false;
    }
  }, [session, isConnected, gpaRaw, incomeRaw, addToast]);

  return {
    status,
    txId,
    errorMsg,
    submit,
    reset,
    isProcessingStatus: status === 'proving' || status === 'submitting'
  };
}
