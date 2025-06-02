// src/context/RefreshContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface RefreshContextType {
  refresh: number;
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider = ({ children }: { children: ReactNode }) => {
  const [refresh, setRefresh] = useState(0);

  return (
    <RefreshContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
};