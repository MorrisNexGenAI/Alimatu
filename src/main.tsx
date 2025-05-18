import React from 'react'
import App from './App.tsx'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New version available. Reload?")) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log("App is ready to work offline.")
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* 🔥 This is what's missing */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
