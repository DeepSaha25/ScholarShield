import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Code, Globe, Mail, Copy, Check, ExternalLink } from 'lucide-react';
import { PREPROD_CONTRACT_ADDRESS } from '../config';

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(PREPROD_CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="border-t border-slate-200/80 mt-24 py-16 bg-white/70 backdrop-blur-md relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Shield size={18} />
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">ScholarShield</span>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed">
            Privacy-preserving eligibility verification built on Midnight Network using Compact Zero-Knowledge circuits.
          </p>
          <div className="flex gap-3 mt-1">
            <a 
              href="https://github.com/DeepSaha25/ScholarShield" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 flex items-center justify-center transition-colors"
              title="GitHub Repository"
            >
              <Code size={18} />
            </a>
            <a 
              href="https://scholar-shield-ten.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 flex items-center justify-center transition-colors"
              title="Live Deployment"
            >
              <Globe size={18} />
            </a>
            <a 
              href="https://x.com/georgian_deep" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 flex items-center justify-center transition-colors"
              title="Contact / X"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div className="flex flex-col gap-3">
          <h4 className="text-slate-900 font-bold text-sm tracking-wider uppercase mb-1">Navigation</h4>
          <Link to="/" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium">Home</Link>
          <Link to="/verify" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium">Verify Eligibility</Link>
          <Link to="/dashboard" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium">Proof Dashboard</Link>
          <Link to="/about" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium">How It Works</Link>
          <Link to="/admin" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium">Admin Portal</Link>
        </div>

        {/* Resources Column */}
        <div className="flex flex-col gap-3">
          <h4 className="text-slate-900 font-bold text-sm tracking-wider uppercase mb-1">Midnight Docs</h4>
          <a href="https://midnight.network/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium inline-flex items-center gap-1.5">
            <span>Midnight Network</span>
            <ExternalLink size={13} className="text-slate-400" />
          </a>
          <a href="https://docs.midnight.network/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium inline-flex items-center gap-1.5">
            <span>Developer Docs</span>
            <ExternalLink size={13} className="text-slate-400" />
          </a>
          <a href="https://github.com/midnight-ntwrk" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium inline-flex items-center gap-1.5">
            <span>Compact Toolchain</span>
            <ExternalLink size={13} className="text-slate-400" />
          </a>
        </div>

        {/* Status Column */}
        <div className="flex flex-col gap-3">
          <h4 className="text-slate-900 font-bold text-sm tracking-wider uppercase mb-1">Preprod Status</h4>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-700 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Preprod Testnet Active</span>
          </div>

          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Contract Address:</span>
              <button 
                onClick={copyAddress}
                className="text-emerald-600 hover:text-emerald-700 font-bold inline-flex items-center gap-1"
                title="Copy Address"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div 
              className="text-slate-700 text-xs font-mono bg-slate-100/90 p-2.5 rounded-xl border border-slate-200 truncate select-all cursor-pointer hover:border-emerald-300 transition-colors"
              onClick={copyAddress}
              title={PREPROD_CONTRACT_ADDRESS}
            >
              {PREPROD_CONTRACT_ADDRESS}
            </div>
          </div>
        </div>

      </div>

      <div className="border-t border-slate-200/60 mt-12 pt-6 text-center relative z-10 px-4">
        <p className="text-slate-500 text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} ScholarShield. Built for the Midnight New Moon to Full Hackathon by Deep Saha.
        </p>
      </div>
    </footer>
  );
}
