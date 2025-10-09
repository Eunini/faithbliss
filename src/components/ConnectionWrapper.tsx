'use client';

import React from 'react';

// TODO: The connection error logic was tied to the old NextAuthContext.
// This wrapper is currently a pass-through and needs to be refactored
// with a new connection management strategy.

interface ConnectionWrapperProps {
  children: React.ReactNode;
}

export const ConnectionWrapper: React.FC<ConnectionWrapperProps> = ({
  children,
}) => {
  return <>{children}</>;
};

export default ConnectionWrapper;