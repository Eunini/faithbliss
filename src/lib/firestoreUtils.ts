// lib/firestoreUtils.ts

// Retry utility for Firestore operations
export const retryFirestoreOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      console.log(`Firestore operation attempt ${i + 1} failed:`, err.message);
      
      if (i === maxRetries) {
        throw error;
      }
      
      // Check if it's a network-related error that we can retry
      const isRetryableError = 
        err.code === 'unavailable' || 
        err.code === 'deadline-exceeded' ||
        err.code === 'cancelled' ||
        err.code === 'aborted' ||
        err.message?.includes('webchannel') ||
        err.message?.includes('network') ||
        err.message?.includes('WebChannelConnection') ||
        err.message?.includes('transport errored') ||
        err.message?.includes('ERR_ABORTED');

      if (isRetryableError) {
        const retryDelay = Math.min(delay * Math.pow(2, i), 10000); // Exponential backoff with max 10s
        console.log(`Retrying after ${retryDelay}ms (attempt ${i + 2}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        throw error; // Don't retry non-network errors
      }
    }
  }
  throw new Error('Max retries exceeded');
};