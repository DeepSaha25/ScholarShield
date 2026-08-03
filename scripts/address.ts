import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import type { EnvironmentConfiguration } from '@midnight-ntwrk/testkit-js';
import { getConfig } from '../src/config.js';
import { MidnightWalletProvider, type WalletSecret, syncWallet } from '../src/wallet.js';
import pino from 'pino';

const logger = pino({ level: 'info', transport: { target: 'pino-pretty' } });
const network = process.env['MIDNIGHT_NETWORK'] ?? 'local';

function resolveSecret(net: string): WalletSecret {
  const upper = net.toUpperCase();
  const mnemonicEnv = `MIDNIGHT_${upper}_MNEMONIC`;
  const seedEnv = `MIDNIGHT_${upper}_SEED`;
  const mnemonic = process.env[mnemonicEnv]?.trim().replace(/\s+/g, ' ');
  const seedHex = process.env[seedEnv]?.trim();

  if (mnemonic && seedHex) {
    throw new Error(`Set only one of ${mnemonicEnv} or ${seedEnv} (both are defined).`);
  }
  if (mnemonic) return { kind: 'mnemonic', value: mnemonic };
  if (seedHex) {
    if (!/^[0-9a-fA-F]+$/.test(seedHex) || seedHex.length % 2 !== 0) {
      throw new Error(`${seedEnv} must be a hex string of even length (no 0x prefix).`);
    }
    return { kind: 'seed', value: seedHex };
  }
  throw new Error(
    `Either ${mnemonicEnv} or ${seedEnv} is required for network '${net}'.`,
  );
}

async function main() {
  const config = getConfig();
  setNetworkId(config.networkId);
  const secret = resolveSecret(network);
  const envConfig: EnvironmentConfiguration = {
    walletNetworkId: config.networkId,
    networkId: config.networkId,
    indexer: config.indexer,
    indexerWS: config.indexerWS,
    node: config.node,
    nodeWS: config.nodeWS,
    faucet: config.faucet,
    proofServer: config.proofServer,
  };

  const provider = await MidnightWalletProvider.build(logger, envConfig, secret);
  await provider.wallet.start();
  
  const state = await syncWallet(logger, provider.wallet);
  console.log('UNSHIELDED_ADDRESS=' + state.unshielded.localState.address);
  console.log('UNSHIELDED_BALANCES=' + JSON.stringify(state.unshielded.balances));
  console.log('DUST_BALANCES=' + JSON.stringify(state.dust.state.balances));
  process.exit(0);
}

main().catch(console.error);
