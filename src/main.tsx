import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'              // ⬅️ Import Provider
// Update the path below if your store file is in a different location or filename
import { store } from './store'              // ⬅️ Import your Redux store
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
    <Provider store={store}>                       {/* ✅ Wrap Provider at the top */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
