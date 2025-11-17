import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

const appId = import.meta.env.VITE_BASE44_APP_ID;

if (!appId) {
  throw new Error('Missing VITE_BASE44_APP_ID environment variable.');
}

// Create a client with authentication required
export const base44 = createClient({
  appId,
  requiresAuth: true // Ensure authentication is required for all operations
});
