import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createConnectedSession, type ConnectedSession } from '../lib/midnight';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type WalletType = '1am' | 'lace' | 'nightly' | null;
type WalletStatus = 'checking' | 'detected' | 'not-found';

type WalletContextType = {
  address: string | null;
  isConnected: boolean;
  walletType: WalletType;
  isConnecting: boolean;
  walletStatus: WalletStatus;
  session: ConnectedSession | null;
  connectionError: string | null;
  connect: (network?: string) => Promise<ConnectedSession | undefined>;
  disconnect: () => void;
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const WalletContext = createContext<WalletContextType | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletStatus, setWalletStatus] = useState<WalletStatus>('checking');
  const [session, setSession] = useState<ConnectedSession | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const connectingRef = useRef(false);

  // Poll for wallet injection — runs once on mount
  useEffect(() => {
    const startedAt = Date.now();
    const id = setInterval(() => {
      const w1am = (window as any).midnight?.['1am'];
      const wLace = (window as any).midnight?.mnLace;
      const wNightly = (window as any).midnight?.nightly;
      if (w1am) {
        setWalletType('1am');
        setWalletStatus('detected');
        clearInterval(id);
        return;
      }
      if (wLace) {
        setWalletType('lace');
        setWalletStatus('detected');
        clearInterval(id);
        return;
      }
      if (wNightly) {
        setWalletType('nightly');
        setWalletStatus('detected');
        clearInterval(id);
        return;
      }
      if (Date.now() - startedAt >= 6000) {
        setWalletStatus('not-found');
        clearInterval(id);
      }
    }, 300);
    return () => clearInterval(id);
  }, []);

  const connect = useCallback(async (network = 'preprod') => {
    if (connectingRef.current) return;
    connectingRef.current = true;
    setIsConnecting(true);
    setConnectionError(null);
    try {
      const wallet =
        (window as any).midnight?.['1am'] ?? (window as any).midnight?.mnLace ?? (window as any).midnight?.nightly;
      if (!wallet) throw new Error('No wallet found. Please install 1AM, Lace, or Nightly wallet.');
      const api = await wallet.connect(network);
      const sess = await createConnectedSession(api);
      setSession(sess);
      setAddress(sess.unshieldedAddress);
      setIsConnected(true);
      return sess;
    } catch (e: any) {
      console.error('Wallet connection failed:', e);
      let errorMsg = e?.message ?? String(e);
      if (errorMsg.includes('Wallet is syncing')) {
        errorMsg = 'Wallet is syncing — please open the 1AM extension and wait for sync to finish.';
      }
      setConnectionError(errorMsg);
      return undefined;
    } finally {
      connectingRef.current = false;
      setIsConnecting(false);
    }
  }, []);

  const disconnectPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
    setSession(null);
    setConnectionError(null);
    setWalletStatus('checking');
    setWalletType(null);
    // Clean up any previous disconnect poll
    if (disconnectPollRef.current) {
      clearInterval(disconnectPollRef.current);
    }
    // Re-poll for wallet after disconnect
    const startedAt = Date.now();
    const id = setInterval(() => {
      const w1am = (window as any).midnight?.['1am'];
      const wLace = (window as any).midnight?.mnLace;
      const wNightly = (window as any).midnight?.nightly;
      if (w1am) { setWalletType('1am'); setWalletStatus('detected'); clearInterval(id); disconnectPollRef.current = null; return; }
      if (wLace) { setWalletType('lace'); setWalletStatus('detected'); clearInterval(id); disconnectPollRef.current = null; return; }
      if (wNightly) { setWalletType('nightly'); setWalletStatus('detected'); clearInterval(id); disconnectPollRef.current = null; return; }
      if (Date.now() - startedAt >= 3000) { setWalletStatus('not-found'); clearInterval(id); disconnectPollRef.current = null; }
    }, 200);
    disconnectPollRef.current = id;
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        walletType,
        isConnecting,
        walletStatus,
        session,
        connectionError,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useWallet(): WalletContextType {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
}
