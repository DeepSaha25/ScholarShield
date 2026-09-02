import React, { useEffect, useState } from 'react';
import { BarChart3, CheckCircle, XCircle, FileText, ExternalLink, Trash2 } from 'lucide-react';
import { getStats, getProofHistory, clearProofHistory } from '../lib/proofHistory';
import type { ProofRecord } from '../lib/proofHistory';
import { explorerTxUrl } from '../constants';
import { ProofExport } from '../components/ProofExport';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, passed: 0, failed: 0 });
  const [history, setHistory] = useState<ProofRecord[]>([]);

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

        {stats.total > 0 && (
          <div className="card mb-lg" style={{ padding: '2rem' }}>
            <h2 className="title-md mb-md">Pass/Fail Ratio</h2>
            <div style={{ width: '100%', height: '40px', display: 'flex', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${(stats.passed / stats.total) * 100}%`, 
                  backgroundColor: 'var(--accent-color)',
                  transition: 'width 0.5s ease' 
                }} 
                title={`Passed: ${stats.passed}`}
              />
              <div 
                style={{ 
                  width: `${(stats.failed / stats.total) * 100}%`, 
                  backgroundColor: '#ff4444',
                  transition: 'width 0.5s ease' 
                }} 
                title={`Failed: ${stats.failed}`}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--accent-color)' }}>{Math.round((stats.passed / stats.total) * 100)}% Eligible</span>
              <span style={{ color: '#ff4444' }}>{Math.round((stats.failed / stats.total) * 100)}% Ineligible</span>
            </div>
          </div>
        )}

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="title-md">Proof History</h2>
            {history.length > 0 && (
              <button 
                onClick={handleClear}
                className="btn btn-secondary btn-sm"
                style={{ color: '#ff4444', borderColor: '#ff4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Trash2 size={14} /> Clear
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-secondary text-center py-md">No proofs submitted yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Date</th>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>GPA Range</th>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Income Range</th>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Result</th>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 0.5rem' }}>{new Date(record.timestamp).toLocaleString()}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{record.gpaRange}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{record.incomeRange}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        {record.result === 'eligible' ? (
                          <span style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={14} /> Eligible</span>
                        ) : record.result === 'ineligible' ? (
                          <span style={{ color: '#ff4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><XCircle size={14} /> Ineligible</span>
                        ) : (
                          <span style={{ color: '#ffaa00' }}>Error</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        {record.txId ? (
                          <a href={explorerTxUrl(record.txId)} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}>
                            View <ExternalLink size={14} />
                          </a>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
