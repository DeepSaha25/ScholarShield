import React, { useState, useEffect } from 'react';
import '@midnight-ntwrk/dapp-connector-api';
import { CompiledContract, sampleSigningKey } from '@midnight-ntwrk/compact-runtime';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { createUnprovenDeployTx, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { Contract } from './managed/contract/index.js';
import { ContractState } from '@midnight-ntwrk/compact-runtime';

// Hex helpers
function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
function fromHex(hex: string): Uint8Array {
  const normalized = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (normalized.length % 2 !== 0) throw new Error('Invalid hex string');
  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < normalized.length; i += 2) bytes[i / 2] = parseInt(normalized.slice(i, i + 2), 16);
  return bytes;
}

// Custom Public Data Provider patch to avoid offset: null bug
function createPatchedPublicDataProvider(queryUrl: string, subscriptionUrl: string) {
  const base = indexerPublicDataProvider(queryUrl, subscriptionUrl);
  async function queryLatest(query: string, address: string) {
    const res = await fetch(queryUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query, variables: { address } }),
    });
    if (!res.ok) throw new Error(`Indexer error: ${res.status}`);
    const payload = await res.json();
    return payload.data?.contractAction ?? null;
  }
  return {
    ...base,
    async queryContractState(contractAddress: string, config?: any) {
      if (config) return base.queryContractState(contractAddress, config);
      const action = await queryLatest(`query LATEST($address: HexEncoded!) { contractAction(address: $address) { state } }`, contractAddress);
      return action ? ContractState.deserialize(fromHex(action.state)) : null;
    }
  };
}

export default function App() {
  const [address, setAddress] = useState<string | null>(null);
  const [api, setApi] = useState<any>(null);
  const [deploying, setDeploying] = useState(false);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      setError(null);
      const injected = (window as any).midnight;
      if (!injected) throw new Error("No Midnight wallet found");
      const wallet = Object.values(injected)[0] as any;
      const connectedApi = await wallet.connect('preprod');
      setApi(connectedApi);
      const { unshieldedAddress } = await connectedApi.getUnshieldedAddress();
      setAddress(unshieldedAddress);
    } catch (e: any) {
      setError(e.message || String(e));
    }
  };

  const deploy = async () => {
    try {
      setDeploying(true);
      setError(null);

      const [config, shieldedAddress] = await Promise.all([
        api.getConfiguration(),
        api.getShieldedAddresses(),
      ]);

      setNetworkId(config.networkId);

      const zkConfigProvider = new FetchZkConfigProvider(
        new URL('/managed', window.location.origin).toString(),
        window.fetch.bind(window)
      );

      const provingProvider = await api.getProvingProvider(zkConfigProvider);
      
      const proofProvider = {
        async proveTx(unprovenTx: any) {
          const { CostModel } = await import('@midnight-ntwrk/ledger-v8');
          return unprovenTx.prove(provingProvider, CostModel.initialCostModel());
        }
      };

      const walletProvider = {
        getCoinPublicKey: () => shieldedAddress.shieldedCoinPublicKey,
        getEncryptionPublicKey: () => shieldedAddress.shieldedEncryptionPublicKey,
        balanceTx: async (tx: any) => {
          const txHex = toHex(tx.serialize());
          const balanced = await api.balanceUnsealedTransaction(txHex);
          const { Transaction } = await import('@midnight-ntwrk/ledger-v8');
          return Transaction.deserialize('signature', 'proof', 'binding', fromHex(balanced.tx));
        }
      };

      const midnightProvider = {
        submitTx: async (tx: any) => {
          const txHex = toHex(tx.serialize());
          const result = await api.submitTransaction(txHex);
          if (typeof result === 'string') return result;
          if (result?.transactionId) return result.transactionId;
          return txHex.slice(0, 64);
        }
      };

      const publicDataProvider = createPatchedPublicDataProvider(config.indexerUri, config.indexerWsUri);

      const providers = {
        zkConfigProvider, proofProvider, walletProvider, midnightProvider, publicDataProvider
      };

      const compiledContract = CompiledContract.make('ScholarshipContract', Contract).pipe(
        CompiledContract.withVacantWitnesses,
        CompiledContract.withCompiledFileAssets(new URL('/managed', window.location.origin).toString())
      );

      console.log("Creating unproven deploy tx...");
      const deployTxData = await createUnprovenDeployTx(
        { zkConfigProvider, walletProvider } as any,
        { compiledContract: compiledContract as any, args: [], signingKey: sampleSigningKey() }
      );

      const cAddr = deployTxData.public.contractAddress;
      console.log("Contract Address:", cAddr);
      setContractAddress(cAddr);

      console.log("Submitting tx...");
      await submitTxAsync(providers as any, { unprovenTx: deployTxData.private.unprovenTx });
      
      console.log("Tx submitted!");

    } catch (e: any) {
      setError(e.message || String(e));
      console.error(e);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Midnight Preprod Deployer</h1>
      {!address ? (
        <button onClick={connectWallet} style={{ padding: '1rem', fontSize: '1rem' }}>
          Connect 1AM Wallet (Preprod)
        </button>
      ) : (
        <div>
          <p>Connected: <code>{address}</code></p>
          {!contractAddress ? (
            <button onClick={deploy} disabled={deploying} style={{ padding: '1rem', fontSize: '1rem' }}>
              {deploying ? 'Deploying...' : 'Deploy Contract'}
            </button>
          ) : (
            <div style={{ marginTop: '2rem', padding: '1rem', border: '2px solid green' }}>
              <h2>Success!</h2>
              <p>Your Contract Address is:</p>
              <h3 style={{ userSelect: 'all' }}>{contractAddress}</h3>
              <p>You have successfully completed Level 1 and 2!</p>
            </div>
          )}
        </div>
      )}
      {error && (
        <div style={{ color: 'red', marginTop: '1rem', padding: '1rem', background: '#fee' }}>
          {error}
        </div>
      )}
    </div>
  );
}
