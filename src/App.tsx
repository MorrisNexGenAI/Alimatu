// src/App.tsx
import React from 'react';

import { RefreshProvider } from './context/RefreshContext';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthProvider';

const App: React.FC = () => {
  return (
  
      <RefreshProvider>
          <AuthProvider>
        <AppRoutes />
        </AuthProvider>
      </RefreshProvider>
      
    
        
    
  );
};

export default App;