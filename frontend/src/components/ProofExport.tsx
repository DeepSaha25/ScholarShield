import React from 'react';
import { Download } from 'lucide-react';

interface ProofExportProps {
  proofId: string;
  txHash: string;
  timestamp: number;
}

export const ProofExport: React.FC<ProofExportProps> = ({ proofId, txHash, timestamp }) => {
  const exportProof = () => {
    const data = {
      version: '1.0',
      proofId,
      txHash,
      timestamp,
      network: 'midnight-preprod',
      contract: 'ScholarShield',
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scholarship-proof-${proofId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button 
      onClick={exportProof}
      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
    >
      <Download size={16} />
      <span>Export Proof Receipt</span>
    </button>
  );
};
