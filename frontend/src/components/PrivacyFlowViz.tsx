import React from 'react';
import { Lock, Cpu, Link as LinkIcon, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

type VerifyStatus = 'idle' | 'proving' | 'submitting' | 'eligible' | 'ineligible' | 'error';

export default function PrivacyFlowViz({ status }: { status: VerifyStatus }) {
  const isProving = status === 'proving';
  const isSubmitting = status === 'submitting';
  const isDone = status === 'eligible' || status === 'ineligible';
  const isAnyActive = isProving || isSubmitting || isDone;

  const steps = [
    { 
      id: 'local', 
      stepNum: '01',
      label: 'Your Private Data', 
      sublabel: 'GPA & Income stay on device', 
      icon: <Lock size={20} />, 
      active: isAnyActive,
      pulse: isProving,
    },
    { 
      id: 'circuit', 
      stepNum: '02',
      label: 'ZK Circuit (Local)', 
      sublabel: 'Proof computed in WASM', 
      icon: <Cpu size={20} />, 
      active: isProving || isSubmitting || isDone,
      pulse: isProving,
    },
    { 
      id: 'chain', 
      stepNum: '03',
      label: 'Midnight Blockchain', 
      sublabel: 'Cryptographic proof recorded', 
      icon: <LinkIcon size={20} />, 
      active: isSubmitting || isDone,
      pulse: isSubmitting,
    },
  ];

  return (
    <div className="glass-card p-6 md:p-8 bg-white/90 border border-slate-200/90 shadow-sm rounded-2xl relative overflow-hidden">
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-600 flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Observable Privacy Architecture</h3>
            <p className="text-xs text-slate-500">Mathematical guarantee of data confidentiality</p>
          </div>
        </div>
        <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium">
          <span className={`w-2 h-2 rounded-full ${isAnyActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
          {isProving ? 'WASM Proving...' : isSubmitting ? 'Submitting to Chain...' : isDone ? 'Verified On-Chain' : 'Client Ready'}
        </span>
      </div>

      {/* Steps Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative mb-6">
        {steps.map((step, i) => (
          <div key={step.id} className="relative flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between h-full ${
                step.active
                  ? 'bg-emerald-50/70 border-emerald-300/80 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200/70'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    step.active
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step.icon}
                </div>
                <span className="font-mono text-xs font-bold text-slate-400">{step.stepNum}</span>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-800 mb-1">{step.label}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{step.sublabel}</div>
              </div>
            </motion.div>

            {/* Desktop connecting arrow */}
            {i < steps.length - 1 && (
              <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-400 items-center justify-center shadow-xs pointer-events-none">
                <ArrowRight size={12} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Privacy Assurance Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/60 to-slate-50/80 border border-emerald-200/70 flex items-start gap-3 text-xs leading-relaxed text-slate-700">
        <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
          <Lock size={15} />
        </div>
        <div>
          <strong className="text-slate-900 font-bold block mb-0.5">Your actual GPA and income are never sent to the network.</strong>
          The Midnight blockchain only records a non-interactive zero-knowledge proof that you satisfy the eligibility threshold — nothing more.
        </div>
      </div>
    </div>
  );
}
