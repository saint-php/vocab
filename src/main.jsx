import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ExamProvider } from './contexts/ExamContext'
import { AuthProvider } from './contexts/AuthContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ExamProvider>
          <App />
        </ExamProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)