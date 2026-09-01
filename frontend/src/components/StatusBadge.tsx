import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

type BadgeVariant = 'eligible' | 'ineligible' | 'pending' | 'error';

const BADGE_CONFIG: Record<BadgeVariant, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  eligible: {
    icon: <CheckCircle size={14} />,
    label: 'Eligible',
    color: 'var(--accent-color)',
    bg: 'rgba(0, 255, 102, 0.1)',
  },
  ineligible: {
    icon: <XCircle size={14} />,
    label: 'Not Eligible',
    color: '#ff4444',
    bg: 'rgba(255, 68, 68, 0.1)',
  },
  pending: {
    icon: <Clock size={14} />,
    label: 'Pending',
    color: '#ffaa00',
    bg: 'rgba(255, 170, 0, 0.1)',
  },
  error: {
    icon: <AlertTriangle size={14} />,
    label: 'Error',
    color: '#ff6b6b',
    bg: 'rgba(255, 107, 107, 0.1)',
  },
};

export default function StatusBadge({ variant, txHash, timestamp }: { variant: BadgeVariant, txHash?: string, timestamp?: number }) {
  const cfg = BADGE_CONFIG[variant];
  return (
    <span
      className="badge-wrapper"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.25rem 0.65rem',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: cfg.color,
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.color}`,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
      }}
    >
      {cfg.icon}
      {cfg.label}
      {txHash && (
        <>
          <div style={{ width: '1px', height: '12px', backgroundColor: cfg.color, margin: '0 4px', opacity: 0.3 }} />
          <span style={{ fontSize: '0.7rem', opacity: 0.8 }} title={txHash}>
            {txHash.slice(0, 6)}...{txHash.slice(-6)}
          </span>
        </>
      )}
    </span>
  );
}
