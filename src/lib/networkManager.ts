// lib/networkManager.ts

let isOnline = true;
let networkListeners: ((online: boolean) => void)[] = [];

export const getNetworkStatus = () => isOnline;

export const addNetworkListener = (callback: (online: boolean) => void) => {
  networkListeners.push(callback);
  // Return unsubscribe function
  return () => {
    networkListeners = networkListeners.filter(listener => listener !== callback);
  };
};

// Enhanced network monitoring
if (typeof window !== "undefined") {
  const updateNetworkStatus = () => {
    const wasOnline = isOnline;
    isOnline = navigator.onLine;
    
    if (wasOnline !== isOnline) {
      console.log(`Network status changed: ${isOnline ? 'online' : 'offline'}`);
      networkListeners.forEach(listener => listener(isOnline));
    }
  };

  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  
  // Initial check
  isOnline = navigator.onLine;
}