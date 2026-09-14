import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Wallet, LogOut, Loader2 } from 'lucide-react';

export default function WalletBanner() {
  const { address, isConnected, walletType, walletStatus, isConnecting, connectionError, connect, disconnect } = useWallet();

  if (walletStatus === 'checking') {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-sm font-medium">
        <Loader2 className="animate-spin" size={16} />
        <span>Detecting wallet...</span>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-200/50 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            {walletType === '1am' ? '1AM' : 'Lace'}
          </span>
        </div>
        <div className="w-px h-4 bg-emerald-200"></div>
        <span className="text-sm font-mono text-emerald-900">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
        <button 
          onClick={disconnect} 
          className="ml-2 text-emerald-600 hover:text-emerald-800 transition-colors"
          title="Disconnect Wallet"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-end">
      <button
        className="glass-button text-sm px-5 py-2.5"
        onClick={() => connect('preprod')}
        disabled={isConnecting || walletStatus === 'not-found'}
      >
        {isConnecting ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Connecting...
          </>
        ) : (
          <>
            <Wallet size={18} />
            Connect Wallet
          </>
        )}
      </button>
      {connectionError && (
        <div className="absolute top-full mt-2 right-0 w-64 p-3 bg-red-50 border border-red-200 rounded-lg shadow-lg z-50 text-xs text-red-700 break-words leading-relaxed">
          {connectionError}
        </div>
      )}
    </div>
  );
}
