import React, { useState, useCallback } from 'react';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { createUnprovenCallTx, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { Contract } from './managed/contract/index.js';
import { WalletProvider, useWallet } from './contexts/WalletContext';

// ─── Constants ──────────────────────────────────────────────────────────────
// Pre-deployed contract address on Midnight Preprod.
// Update this when you have a real deployed address.
const PREPROD_CONTRACT_ADDRESS = 'UPDATE_WITH_YOUR_PREPROD_CONTRACT_ADDRESS';
// Scholarship criteria (must match what the contract was deployed with)
const MIN_GPA_THRESHOLD = 800; // 8.0 GPA scaled ×100
const MAX_INCOME_THRESHOLD = 250000; // ₹2,50,000 INR

// ─── Compiled Contract ──────────────────────────────────────────────────────
function getCompiledContract() {
  return CompiledContract.make('ScholarshipContract', Contract).pipe(
    CompiledContract.withVacantWitnesses,
    CompiledContract.withCompiledFileAssets(new URL('/managed', window.location.origin).toString()),
  ) as any;
}

// ─── Types ──────────────────────────────────────────────────────────────────
type VerifyStatus = 'idle' | 'proving' | 'submitting' | 'eligible' | 'ineligible' | 'error';

// ─────────────────────────────────────────────────────────────────────────────
// WalletBanner component
// ─────────────────────────────────────────────────────────────────────────────
function WalletBanner() {
  const { address, isConnected, walletType, walletStatus, isConnecting, connect, disconnect } = useWallet();

  if (walletStatus === 'checking') {
    return (
      <div className="card wallet-banner">
        <div className="wallet-info">
          <div className="status-dot"></div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Detecting wallet extension…
          </span>
        </div>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="card wallet-banner">
        <div className="wallet-info">
          <div className="status-dot connected" id="wallet-status-dot"></div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>
              {walletType === '1am' ? '1AM Wallet' : 'Lace Wallet'} · Preprod
            </div>
            <div className="wallet-address" id="wallet-address">{address.slice(0, 12)}…{address.slice(-8)}</div>
          </div>
        </div>
        <button
          id="btn-disconnect"
          className="btn btn-secondary"
          onClick={disconnect}
          style={{ fontSize: '0.85rem', padding: '8px 16px' }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="card wallet-banner" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
      {walletStatus === 'not-found' && (
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>
          ⚠️ No Midnight wallet detected.{' '}
          <a href="https://1am.fyi" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-purple)' }}>
            Install 1AM Wallet
          </a>{' '}
          or{' '}
          <a href="https://www.lace.io" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-purple)' }}>
            Lace Wallet
          </a>{' '}
          and switch to Preprod.
        </div>
      )}
      <button
        id="btn-connect"
        className="btn btn-primary"
        onClick={() => connect('preprod')}
        disabled={isConnecting || walletStatus === 'not-found'}
        style={{ alignSelf: 'flex-start' }}
      >
        {isConnecting ? (
          <>
            <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
            Connecting…
          </>
        ) : (
          '🔗 Connect Wallet (Preprod)'
        )}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Privacy Flow Visualizer
// Shows that inputs are LOCAL — only the proof goes on-chain
// ─────────────────────────────────────────────────────────────────────────────
function PrivacyFlowViz({ status }: { status: VerifyStatus }) {
  const steps = [
    { id: 'local', label: 'Your Private Data', sublabel: 'GPA & Income — stays on your device', icon: '🔒', active: status === 'proving' || status === 'submitting' || status === 'eligible' || status === 'ineligible' },
    { id: 'circuit', label: 'ZK Circuit (Local)', sublabel: 'Proof computed in WASM — no data shared', icon: '⚙️', active: status === 'proving' },
    { id: 'chain', label: 'Midnight Blockchain', sublabel: 'Only the cryptographic proof is recorded', icon: '⛓️', active: status === 'submitting' || status === 'eligible' || status === 'ineligible' },
  ];

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>
        🔍 Observable Privacy Behavior
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', overflowX: 'auto' }}>
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            <div
              id={`privacy-step-${step.id}`}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '12px',
                borderRadius: '10px',
                border: `1px solid ${step.active ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255,255,255,0.05)'}`,
                background: step.active ? 'rgba(168, 85, 247, 0.08)' : 'rgba(255,255,255,0.02)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{step.icon}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: step.active ? 'var(--accent-purple)' : 'var(--text-secondary)' }}>
                {step.label}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {step.sublabel}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ padding: '0 8px', color: 'rgba(255,255,255,0.15)', fontSize: '1.2rem', flexShrink: 0 }}>
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
        🔐 <strong style={{ color: 'var(--text-primary)' }}>Your actual GPA and income are never sent to the network.</strong>{' '}
        The Midnight blockchain only records a cryptographic proof that you satisfy the eligibility threshold — nothing more.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Student Portal — main circuit call UI
// ─────────────────────────────────────────────────────────────────────────────
function StudentPortal() {
  const { session, isConnected } = useWallet();
  const [gpaRaw, setGpaRaw] = useState('');
  const [incomeRaw, setIncomeRaw] = useState('');
  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [txId, setTxId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerify = useCallback(async () => {
    if (!session || !isConnected) return;

    const gpaValue = parseFloat(gpaRaw);
    const incomeValue = parseInt(incomeRaw, 10);

    if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 10) {
      setErrorMsg('Please enter a valid GPA between 0.0 and 10.0');
      setStatus('error');
      return;
    }
    if (isNaN(incomeValue) || incomeValue < 0) {
      setErrorMsg('Please enter a valid annual income in INR');
      setStatus('error');
      return;
    }

    // Scale GPA ×100 (e.g. 9.1 → 910n) to match Uint<32> contract expectation
    const gpaScaled = BigInt(Math.round(gpaValue * 100));
    const incomeBig = BigInt(incomeValue);

    setStatus('proving');
    setErrorMsg(null);
    setTxId(null);

    try {
      const compiledContract = getCompiledContract();

      // Build the unproven call transaction locally — private inputs stay here
      const callTxData = await createUnprovenCallTx(session.providers as any, {
        compiledContract,
        contractAddress: PREPROD_CONTRACT_ADDRESS,
        circuitId: 'verify_eligibility',
        args: [gpaScaled, incomeBig],
      });

      setStatus('submitting');

      // Submit the proven transaction to Midnight Preprod
      const id = await submitTxAsync(session.providers as any, {
        unprovenTx: callTxData.private.unprovenTx,
        circuitId: 'verify_eligibility',
      });

      setTxId(typeof id === 'string' ? id : id?.txHash ?? 'confirmed');

      // Check locally whether the student passes
      const passes = gpaScaled >= BigInt(MIN_GPA_THRESHOLD) && incomeBig <= BigInt(MAX_INCOME_THRESHOLD);
      setStatus(passes ? 'eligible' : 'ineligible');
    } catch (e: any) {
      const msg: string = e?.message ?? String(e);
      // If the contract assertion fails, the circuit rejects → ineligible
      if (msg.includes('GPA too low') || msg.includes('Income too high') || msg.toLowerCase().includes('assert')) {
        setStatus('ineligible');
      } else {
        setStatus('error');
        setErrorMsg(msg);
      }
    }
  }, [session, isConnected, gpaRaw, incomeRaw]);

  const reset = () => {
    setStatus('idle');
    setErrorMsg(null);
    setTxId(null);
    setGpaRaw('');
    setIncomeRaw('');
  };

  const isProcessing = status === 'proving' || status === 'submitting';

  return (
    <div>
      <PrivacyFlowViz status={status} />

      <div className="card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '6px' }}>🎓 Student Eligibility Portal</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
          Enter your private credentials below. They will be used locally to generate a ZK proof — they are never sent to the network.
        </p>

        {/* Scholarship rules (public, from ledger) */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div id="rule-gpa" style={{ flex: 1, minWidth: '140px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.06)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Min GPA (Public)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-purple)', marginTop: '4px' }}>≥ 8.00</div>
          </div>
          <div id="rule-income" style={{ flex: 1, minWidth: '140px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.06)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max Income (Public)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-purple)', marginTop: '4px' }}>≤ ₹2,50,000</div>
          </div>
        </div>

        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="input-gpa">Your GPA (Private Witness)</label>
            <input
              id="input-gpa"
              type="number"
              className="input-field"
              placeholder="e.g. 9.1"
              min="0"
              max="10"
              step="0.01"
              value={gpaRaw}
              onChange={(e) => setGpaRaw(e.target.value)}
              disabled={isProcessing || status === 'eligible' || status === 'ineligible'}
            />
          </div>
          <div className="input-group">
            <label htmlFor="input-income">Annual Family Income in ₹ (Private Witness)</label>
            <input
              id="input-income"
              type="number"
              className="input-field"
              placeholder="e.g. 180000"
              min="0"
              step="1000"
              value={incomeRaw}
              onChange={(e) => setIncomeRaw(e.target.value)}
              disabled={isProcessing || status === 'eligible' || status === 'ineligible'}
            />
          </div>
        </div>

        {/* Private witness notice */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.1)', marginBottom: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          🔒 <span>These inputs are <strong style={{ color: 'var(--text-primary)' }}>private witnesses</strong> — used only in local WASM circuit computation. They are never transmitted to the Midnight network or stored anywhere.</span>
        </div>

        {status === 'idle' || status === 'error' ? (
          <button
            id="btn-verify"
            className="btn btn-primary btn-block"
            onClick={handleVerify}
            disabled={!gpaRaw || !incomeRaw || !isConnected}
          >
            🚀 Verify Eligibility (Generate ZK Proof)
          </button>
        ) : isProcessing ? (
          <button className="btn btn-primary btn-block" disabled>
            <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
            {status === 'proving' ? 'Generating ZK Proof Locally…' : 'Submitting Proof to Preprod…'}
          </button>
        ) : (
          <button id="btn-verify-again" className="btn btn-secondary btn-block" onClick={reset}>
            ↩ Verify Again
          </button>
        )}

        {/* Result */}
        {status === 'eligible' && (
          <div id="result-eligible" className="result-box eligible">
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>Eligible for Scholarship!</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
              Your ZK proof was verified on-chain. Your actual GPA and income were never disclosed.
            </div>
            {txId && (
              <div style={{ marginTop: '12px', fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all', opacity: 0.7 }}>
                Tx: {txId}
              </div>
            )}
          </div>
        )}

        {status === 'ineligible' && (
          <div id="result-ineligible" className="result-box ineligible">
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>❌</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>Not Eligible</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
              Your credentials do not satisfy the scholarship thresholds. Your private data was never revealed.
            </div>
          </div>
        )}

        {status === 'error' && errorMsg && (
          <div className="result-box ineligible" style={{ marginTop: '16px' }}>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>⚠️ Error</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8, wordBreak: 'break-word' }}>{errorMsg}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const { isConnected, walletStatus } = useWallet();

  return (
    <div className="app-container">
      <header>
        <div className="logo-container">
          <span className="logo-icon">🛡️</span>
          <h1>ScholarShield</h1>
        </div>
        <p>Privacy-Preserving Scholarship Verification on Midnight</p>
      </header>

      <WalletBanner />

      {!isConnected ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔗</div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>Connect Your Wallet to Begin</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
            Connect your <strong>1AM</strong> or <strong>Lace</strong> wallet on the{' '}
            <strong>Preprod</strong> network to verify your scholarship eligibility using zero-knowledge proofs.
          </p>
          {walletStatus === 'not-found' && (
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://1am.fyi" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                Install 1AM Wallet
              </a>
              <a href="https://www.lace.io" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                Install Lace Wallet
              </a>
            </div>
          )}
        </div>
      ) : (
        <StudentPortal />
      )}

      <footer>
        <p>ScholarShield · Built on <a href="https://midnight.network" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-purple)' }}>Midnight Network</a> · Zero-Knowledge Privacy</p>
        <p style={{ marginTop: '4px', fontSize: '0.8rem' }}>
          Contract: <code style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px' }}>{PREPROD_CONTRACT_ADDRESS.slice(0, 20)}…</code>
        </p>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Wrapped export (provides WalletContext to entire tree)
// ─────────────────────────────────────────────────────────────────────────────
export function AppWithProviders() {
  return (
    <WalletProvider>
      <App />
    </WalletProvider>
  );
}
