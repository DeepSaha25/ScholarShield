// ---------------------------------------------------------------------------
// Application-wide constants
// Centralizes magic strings and configuration defaults to avoid scattering
// them across multiple files.
// ---------------------------------------------------------------------------

/** The name used when compiling the Compact contract. */
export const CONTRACT_NAME = 'ScholarshipContract';

/** Private state key used during deployment and testing. */
export const PRIVATE_STATE_KEY = 'DeployerState';

/** Default minimum GPA threshold (8.00 scaled to integer × 100). */
export const DEFAULT_MIN_GPA = 800;

/** Default maximum income threshold in INR. */
export const DEFAULT_MAX_INCOME = 250_000;

/** GPA scale factor (user enters 0.0–10.0, stored as 0–1000). */
export const GPA_SCALE_FACTOR = 100;

/** Maximum valid GPA value after scaling (10.0 × 100). */
export const MAX_GPA_SCALED = 1000;

/** Midnight Preprod explorer base URL. */
export const EXPLORER_BASE_URL = 'https://explorer.1am.xyz';

/** Build an explorer link for a transaction. */
export function explorerTxUrl(txId: string, network = 'preprod'): string {
  return `${EXPLORER_BASE_URL}/tx/${txId}?network=${network}`;
}
