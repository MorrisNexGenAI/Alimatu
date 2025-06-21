import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
            // ⬅️ Import Provider
// Update the path below if your store file is in a different location or filename
          // ⬅️ Import your Redux store
import './styles/index.css'
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
                       {/* ✅ Wrap Provider at the top */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    
  </React.StrictMode>
)
