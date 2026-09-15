import React, { useState } from 'react';
import { ShieldCheck, Lock, Sparkles, ArrowRight } from 'lucide-react';

export function ZkSimulator() {
  const [gpa, setGpa] = useState<number>(3.8);
  const [income, setIncome] = useState<number>(42000);

  const minGpa = 3.2;
  const maxIncome = 60000;
  const isEligible = gpa >= minGpa && income <= maxIncome;

  // Pseudo-hash generation to visualize zero-knowledge commitment
  const pseudoCommitment = `0x${((Math.floor(gpa * 100) * 8191) ^ (income * 131)).toString(16).padStart(8, '0')}${Math.abs((income * 97) ^ 0xabcdef).toString(16).slice(0, 8)}...`;

  return (
    <div className="w-full rounded-2xl bg-slate-900 text-slate-100 p-6 md:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles size={12} />
            Interactive ZK Playground
          </div>
          <h4 className="text-xl font-bold text-white">How Zero-Knowledge Works</h4>
        </div>
        <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Client WASM Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Step 1: Private Inputs */}
        <div className="lg:col-span-5 bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Lock size={13} /> Private Inputs
            </span>
            <span className="text-[10px] bg-emerald-900/40 text-emerald-300 px-2 py-0.5 rounded">
              Stay on device
            </span>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-slate-300 font-medium">Your GPA:</span>
              <span className="font-mono text-emerald-400 font-bold">{gpa.toFixed(2)} / 4.0</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="4.0"
              step="0.05"
              value={gpa}
              onChange={(e) => setGpa(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-slate-300 font-medium">Family Income:</span>
              <span className="font-mono text-emerald-400 font-bold">${income.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="20000"
              max="100000"
              step="1000"
              value={income}
              onChange={(e) => setIncome(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* Arrow / Connector */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center text-slate-500">
          <div className="hidden lg:flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest text-center">
              WASM Prover
            </span>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shadow-md">
              <ArrowRight size={18} />
            </div>
          </div>
          <div className="flex lg:hidden items-center justify-center gap-2 py-1 text-slate-400 text-xs font-mono">
            <span>Circuit computes locally</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Step 2: Zero-Knowledge Public Output */}
        <div className="lg:col-span-5 bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck size={14} /> On-Chain Broadcast
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              Public Proof
            </span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 font-mono text-xs">
            <div className="text-slate-500 text-[11px] mb-1">Pedersen Commitment:</div>
            <div className="text-emerald-400 font-semibold truncate select-all">{pseudoCommitment}</div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-slate-400">
              Criteria Result:
            </div>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono ${
                isEligible
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {isEligible ? (
                <>
                  <ShieldCheck size={14} />
                  <span>ELIGIBLE (VERIFIED)</span>
                </>
              ) : (
                <span>NOT QUALIFIED</span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            *The blockchain verifies the criteria without seeing the GPA or Income.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ZkSimulator;
