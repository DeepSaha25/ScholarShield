import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Code, Terminal } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Shield size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">About ScholarShield</h1>
          <p className="text-slate-500 text-lg">
            Privacy-preserving eligibility verification built on the Midnight Network.
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.section 
            className="glass-card p-8 md:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <div className="p-2 bg-rose-100 text-rose-500 rounded-lg">
                <BookOpen size={24} /> 
              </div>
              The Problem
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              Traditional scholarship applications require students to submit highly sensitive 
              personal information, such as their family's annual income and their academic transcripts. 
              This data is often stored on centralized servers, creating significant privacy risks and 
              potential for data breaches.
            </p>
          </motion.section>

          <motion.section 
            className="glass-card p-8 md:p-10 border-l-4 border-l-emerald-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <Code size={24} /> 
              </div>
              The ZK Solution
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg mb-6">
              ScholarShield utilizes Midnight's Zero-Knowledge (ZK) capabilities to invert this model. 
              Instead of sending your data to an authority, the authority's rules (the smart contract) 
              are sent to your device.
            </p>
            <ul className="space-y-4 text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-100">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 shrink-0"></span>
                <span>Your GPA and Income act as <strong className="text-slate-800">private witnesses</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 shrink-0"></span>
                <span>A local WASM circuit computes whether you meet the criteria.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 shrink-0"></span>
                <span>Only a cryptographic proof (a True/False assertion) is submitted to the blockchain.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 shrink-0"></span>
                <span>Your private data never leaves your browser.</span>
              </li>
            </ul>
          </motion.section>

          <motion.section 
            className="glass-card p-8 md:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Terminal size={24} /> 
              </div>
              Open Source
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg mb-6">
              This project was built for the <strong className="text-slate-800">Midnight New Moon to Full Hackathon</strong>. 
              The smart contract is written in Compact, and the frontend uses React and the Midnight.js SDK.
            </p>
            <a 
              href="https://github.com/DeepSaha25/ScholarShield" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors shadow-sm"
            >
              <Code size={20} />
              View Source Code on GitHub
            </a>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
