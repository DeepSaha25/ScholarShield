import React, { useEffect, useState } from 'react';
import { BarChart3, CheckCircle, XCircle, FileText, ExternalLink, Trash2 } from 'lucide-react';
import { getStats, getProofHistory, clearProofHistory } from '../lib/proofHistory';
import type { ProofRecord } from '../lib/proofHistory';
import { explorerTxUrl } from '../constants';
import { ProofExport } from '../components/ProofExport';
import { useLiveCriteria } from '../hooks/useLiveCriteria';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, passed: 0, failed: 0 });
  const [history, setHistory] = useState<ProofRecord[]>([]);
  
  const { deadline, maxClaims, totalClaims, isActive } = useLiveCriteria();

  useEffect(() => {
    setStats(getStats());
    setHistory(getProofHistory());
  }, []);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your proof history?')) {
      clearProofHistory();
      setStats({ total: 0, passed: 0, failed: 0 });
      setHistory([]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto py-8"
    >
      <div className="mb-12 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <BarChart3 size={40} className="text-emerald-500" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">Analytics Dashboard</h1>
        <p className="text-slate-500 text-lg max-w-lg mx-auto">
          View real-time statistics and proof history for Scholarship verifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <FileText size={32} className="text-slate-400 mb-3" />
          <div className="text-4xl font-extrabold text-slate-800">{stats.total}</div>
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Total Proofs</div>
        </div>
        <div className="glass-card p-6 border-b-4 border-b-emerald-500 flex flex-col items-center justify-center text-center">
          <CheckCircle size={32} className="text-emerald-500 mb-3" />
          <div className="text-4xl font-extrabold text-emerald-600">{stats.passed}</div>
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Eligible</div>
        </div>
        <div className="glass-card p-6 border-b-4 border-b-red-400 flex flex-col items-center justify-center text-center">
          <XCircle size={32} className="text-red-400 mb-3" />
          <div className="text-4xl font-extrabold text-red-500">{stats.failed}</div>
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Ineligible</div>
        </div>
      </div>

      <div className="glass-card p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Scholarship Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Status</div>
            <div className={`text-2xl font-extrabold ${isActive ? 'text-emerald-500' : 'text-red-500'}`}>
              {isActive ? 'Active' : 'Paused'}
            </div>
          </div>
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Application Deadline</div>
            <div className="text-2xl font-bold text-slate-800">
              {new Date(deadline * 1000).toLocaleDateString()}
            </div>
          </div>
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Slots Remaining</div>
            <div className="text-2xl font-extrabold text-slate-800">
              {Math.max(0, maxClaims - totalClaims)} <span className="text-slate-400 text-lg">/ {maxClaims}</span>
            </div>
          </div>
        </div>
      </div>

      {stats.total > 0 && (
        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Pass/Fail Ratio</h2>
          <div className="w-full h-10 flex rounded-full overflow-hidden shadow-inner bg-slate-100">
            <div 
              className="bg-emerald-500 transition-all duration-1000 ease-out"
              style={{ width: `${(stats.passed / stats.total) * 100}%` }} 
              title={`Passed: ${stats.passed}`}
            />
            <div 
              className="bg-red-400 transition-all duration-1000 ease-out"
              style={{ width: `${(stats.failed / stats.total) * 100}%` }} 
              title={`Failed: ${stats.failed}`}
            />
          </div>
          <div className="flex justify-between mt-3 text-sm font-bold">
            <span className="text-emerald-600">{Math.round((stats.passed / stats.total) * 100)}% Eligible</span>
            <span className="text-red-500">{Math.round((stats.failed / stats.total) * 100)}% Ineligible</span>
          </div>
        </div>
      )}

      <div className="glass-card p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Proof History</h2>
          {history.length > 0 && (
            <button 
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors"
            >
              <Trash2 size={16} /> Clear History
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No proofs submitted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">GPA Range</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Income Range</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Result</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 text-sm text-slate-600 font-medium">{new Date(record.timestamp).toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{record.gpaRange}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{record.incomeRange}</td>
                    <td className="py-4 px-4">
                      {record.result === 'eligible' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                          <CheckCircle size={14} /> Eligible
                        </span>
                      ) : record.result === 'ineligible' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold">
                          <XCircle size={14} /> Ineligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold">Error</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {record.txId ? (
                        <div className="flex gap-3 items-center">
                          <a href={explorerTxUrl(record.txId)} target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1 transition-colors">
                            View <ExternalLink size={14} />
                          </a>
                          <ProofExport proofId={record.id} txHash={record.txId} timestamp={record.timestamp} />
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
