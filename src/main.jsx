import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { PasswordProvider } from './contexts/PasswordContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PasswordProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </PasswordProvider>
  </StrictMode>,
)
