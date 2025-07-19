import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "685a67ffa2e3e5975077a34f", 
  requiresAuth: true // Ensure authentication is required for all operations
});
