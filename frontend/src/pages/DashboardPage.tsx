import React, { useEffect, useState } from 'react';
import { BarChart3, CheckCircle, XCircle, FileText } from 'lucide-react';
import { getStats, ProofRecord } from '../lib/proofHistory';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, passed: 0, failed: 0 });

  useEffect(() => {
    setStats(getStats());
  }, []);
  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <div className="mb-xl text-center">
          <BarChart3 size={48} className="text-accent mx-auto mb-md" />
          <h1 className="title-lg mb-sm">Analytics Dashboard</h1>
          <p className="text-secondary text-lg">
            View real-time statistics and proof history for Scholarship verifications.
          </p>
        </div>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card text-center" style={{ padding: '2rem' }}>
            <FileText size={32} className="mx-auto mb-sm text-secondary" />
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-secondary text-sm uppercase tracking-widest mt-xs">Total Proofs</div>
          </div>
          <div className="card text-center" style={{ padding: '2rem', borderColor: 'var(--accent-color)' }}>
            <CheckCircle size={32} className="mx-auto mb-sm text-accent" />
            <div className="text-3xl font-bold text-accent">{stats.passed}</div>
            <div className="text-secondary text-sm uppercase tracking-widest mt-xs">Eligible</div>
          </div>
          <div className="card text-center" style={{ padding: '2rem', borderColor: '#ff4444' }}>
            <XCircle size={32} className="mx-auto mb-sm" style={{ color: '#ff4444' }} />
            <div className="text-3xl font-bold" style={{ color: '#ff4444' }}>{stats.failed}</div>
            <div className="text-secondary text-sm uppercase tracking-widest mt-xs">Ineligible</div>
          </div>
        </div>
      </div>
    </div>
  );
}
