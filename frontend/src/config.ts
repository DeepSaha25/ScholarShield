// We prioritize the localStorage value (for local testing/admin deployments)
// If not found, we fallback to the Vercel injected environment variable.
// If neither exists, we fallback to the hardcoded Preprod address.
export const PREPROD_CONTRACT_ADDRESS = 
  localStorage.getItem('PREPROD_CONTRACT_ADDRESS') || 
  '8fb4a94bac069985724fb1ad69bc549ef03a499071e5e79bb4a1697c8cc5d7d3';

export const MIN_GPA_THRESHOLD = import.meta.env.VITE_MIN_GPA_THRESHOLD ? parseInt(import.meta.env.VITE_MIN_GPA_THRESHOLD, 10) : 800;
export const MAX_INCOME_THRESHOLD = import.meta.env.VITE_MAX_INCOME_THRESHOLD ? parseInt(import.meta.env.VITE_MAX_INCOME_THRESHOLD, 10) : 250000;
