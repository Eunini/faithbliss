'use client';

import dynamic from 'next/dynamic';

// Dynamically import ConnectionStatusBanner to avoid SSR issues
const ConnectionStatusBanner = dynamic(
  () => import('./ConnectionStatusBanner').then((mod) => ({ default: mod.ConnectionStatusBanner })),
  { 
    ssr: false,
    loading: () => null
  }
);

export default ConnectionStatusBanner;