// src/App.tsx
import React from 'react';

import { RefreshProvider } from './context/RefreshContext';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {
  return (
  
      <RefreshProvider>
        <AppRoutes />
      </RefreshProvider>
    
  );
};

export default App;