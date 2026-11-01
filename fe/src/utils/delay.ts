/**
 * Simulates network latency for mock service calls.
 */
export const delay = (ms: number = 300): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
