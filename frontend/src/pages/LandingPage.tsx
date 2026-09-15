import React from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { 
  ShieldCheck, 
  LockKeyhole, 
  Zap, 
  ChevronRight, 
  User, 
  Cpu, 
  Database, 
  Sparkles, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { BackgroundPaths } from '../components/ui/BackgroundPaths';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { MarqueeTicker } from '../components/ui/MarqueeTicker';
import { ZkSimulator } from '../components/ui/ZkSimulator';

export default function LandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="flex flex-col gap-14 pb-20 relative overflow-hidden"
    >
      {/* Background Animated Paths */}
      <BackgroundPaths />

      {/* Hero Section */}
      <section className="relative pt-10 md:pt-18 pb-6 text-center max-w-4xl mx-auto flex flex-col items-center px-4 z-10">
        
        {/* Animated Network Pill */}
        <motion.div 
          variants={itemVariants} 
          className="group inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/90 border border-emerald-200/90 shadow-sm text-slate-800 font-bold text-xs uppercase tracking-widest mb-8 hover:shadow-md hover:border-emerald-400 hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-md"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-700">Midnight Network Preprod</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-medium">Privacy-First Verifications</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1 
          variants={itemVariants} 
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.08]"
        >
          Zero-Knowledge <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            Scholarship Eligibility
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p 
          variants={itemVariants} 
          className="text-slate-600 mb-10 max-w-2xl leading-relaxed text-lg md:text-xl px-2 font-normal"
        >
          Prove academic merit and financial need on the blockchain without ever exposing your sensitive GPA or annual household income.
        </motion.p>

        {/* Hero Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-20">
          <Link
            to="/verify"
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-emerald-500 text-white font-bold transition-all text-base hover:bg-emerald-600 rounded-2xl shadow-[0_4px_16px_rgba(16,185,129,0.36)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.28)] hover:-translate-y-1"
          >
            <span>Verify Eligibility</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center justify-center px-8 py-4 bg-white/80 text-slate-700 font-bold hover:text-emerald-700 hover:bg-slate-50/90 border border-slate-200/90 transition-all text-base rounded-2xl shadow-sm hover:shadow backdrop-blur-md"
          >
            Architecture Guide
          </Link>
        </motion.div>
      </section>

      {/* Infinite Marquee Ticker */}
      <motion.div variants={itemVariants} className="w-full">
        <MarqueeTicker />
      </motion.div>

      {/* Metrics Bar */}
      <motion.section variants={itemVariants} className="w-full flex justify-center px-4">
        <div className="glass-card flex flex-col md:flex-row items-center justify-around w-full max-w-5xl p-8 md:p-10 gap-8 md:gap-0 relative overflow-hidden bg-white/90">
          <div className="text-center px-4">
            <p className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-1 tracking-tight">100%</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Client-Side Privacy</p>
            <p className="text-xs text-slate-400 mt-0.5">Data never touches servers</p>
          </div>
          <div className="hidden md:block w-px h-14 bg-slate-200" />
          <div className="text-center px-4">
            <p className="text-4xl md:text-5xl font-extrabold text-emerald-500 mb-1 tracking-tight">&lt; 2.5s</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">WASM Proof Generation</p>
            <p className="text-xs text-slate-400 mt-0.5">High-speed local circuit</p>
          </div>
          <div className="hidden md:block w-px h-14 bg-slate-200" />
          <div className="text-center px-4">
            <p className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-1 tracking-tight">Zero</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Information Leakage</p>
            <p className="text-xs text-slate-400 mt-0.5">ZK-SNARK math assertion</p>
          </div>
        </div>
      </motion.section>

      {/* Interactive ZK Playground Section */}
      <motion.section variants={itemVariants} className="w-full max-w-5xl mx-auto px-4 mt-2">
        <ZkSimulator />
      </motion.section>

      {/* Bento Feature Grid with Spotlight Cards */}
      <section className="w-full max-w-5xl mx-auto px-4 mt-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Engineered for Uncompromising Privacy
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base">
            Traditional applications leak transcripts, tax returns, and identity documents. ScholarShield inverts this model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SpotlightCard>
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 shadow-inner text-emerald-600">
              <LockKeyhole size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2.5">Private Witnesses</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Your exact GPA and household earnings act as private witnesses computed purely inside your local browser runtime.
            </p>
          </SpotlightCard>

          <SpotlightCard>
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 shadow-inner text-emerald-600">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2.5">Decentralized Verifier</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              The Midnight Preprod ledger checks the ZK proof validity against immutable smart contract criteria without human bias.
            </p>
          </SpotlightCard>

          <SpotlightCard>
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 shadow-inner text-emerald-600">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2.5">Instant Verifiable Proof</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Receive a tamper-proof cryptographic credential token that you can present to universities or scholarship boards.
            </p>
          </SpotlightCard>
        </div>
      </section>

      {/* 3-Stage Cryptographic Pipeline (How It Works) */}
      <motion.section variants={itemVariants} className="max-w-4xl mx-auto px-4 mt-12 w-full">
        <div className="text-center mb-12">
          <span className="text-emerald-600 font-extrabold text-xs tracking-widest uppercase mb-2 block">
            Cryptographic Pipeline
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How ScholarShield Works</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Card 1 */}
          <div className="glass-card p-7 flex flex-col items-start bg-white/90 border-slate-200/90 relative">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0 mb-5 font-mono font-bold text-lg shadow-md">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Input Sensitive Data</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Enter your credentials in your browser. Raw values are stored temporarily in browser memory and never transmitted over HTTP.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 font-mono">
              [Device-Only Memory]
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-7 flex flex-col items-start bg-white/90 border-slate-200/90 relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 mb-5 font-mono font-bold text-lg shadow-md shadow-emerald-500/30">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">WASM Proof Synthesis</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Midnight Compact circuit executes locally. It synthesizes a zero-knowledge proof stating you satisfy the scholarship criteria.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-emerald-600 font-mono">
              [Zero-Knowledge Math]
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-7 flex flex-col items-start bg-white/90 border-slate-200/90 relative">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0 mb-5 font-mono font-bold text-lg shadow-md">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">On-Chain Attestation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Only the cryptographic proof is submitted to Midnight Preprod. The ledger records your verified status immutably.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 font-mono">
              [Preprod Blockchain]
            </div>
          </div>
        </div>
      </motion.section>

      {/* Bottom CTA Banner */}
      <motion.section variants={itemVariants} className="max-w-4xl mx-auto px-4 mt-10 w-full">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-5">
              <Sparkles size={28} />
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
              Ready to verify without sacrificing privacy?
            </h3>
            <p className="text-slate-300 text-base mb-8 leading-relaxed">
              Experience the future of zero-knowledge privacy on the Midnight Network in just two minutes.
            </p>
            <Link
              to="/verify"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 text-base"
            >
              <span>Launch Verifier Now</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </motion.section>

    </motion.div>
  );
}
