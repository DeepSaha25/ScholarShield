import React from 'react';
import { ShieldCheck, Cpu, Database, Activity, Lock } from 'lucide-react';
import { PREPROD_CONTRACT_ADDRESS } from '../../config';

interface TickerItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: string;
}

export function MarqueeTicker() {
  const items: TickerItem[] = [
    {
      icon: <Activity size={14} className="text-emerald-500" />,
      label: 'Network',
      value: 'Midnight Preprod Testnet',
      badge: 'Live',
    },
    {
      icon: <Lock size={14} className="text-emerald-500" />,
      label: 'Privacy Model',
      value: 'Zero-Knowledge Cryptography',
    },
    {
      icon: <Cpu size={14} className="text-emerald-500" />,
      label: 'Prover',
      value: 'Local Client WASM Circuit',
      badge: '< 2.4s',
    },
    {
      icon: <Database size={14} className="text-emerald-500" />,
      label: 'Contract',
      value: `${PREPROD_CONTRACT_ADDRESS.slice(0, 10)}...${PREPROD_CONTRACT_ADDRESS.slice(-6)}`,
    },
    {
      icon: <ShieldCheck size={14} className="text-emerald-500" />,
      label: 'Security',
      value: 'Non-Custodial · Zero Data Leaks',
    },
  ];

  // Repeat items for seamless infinite marquee
  const displayItems = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden border-y border-slate-200/80 bg-white/50 backdrop-blur-sm py-3.5 my-8">
      {/* Left and right fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10" />

      <div className="animate-marquee flex items-center gap-10">
        {displayItems.map((item, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-100/70 border border-slate-200/80 text-xs text-slate-700 whitespace-nowrap shadow-2xs hover:border-emerald-300 transition-colors"
          >
            {item.icon}
            <span className="font-semibold text-slate-500">{item.label}:</span>
            <span className="font-bold text-slate-800">{item.value}</span>
            {item.badge && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarqueeTicker;
