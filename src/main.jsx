import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ProfilePictureUpload from './profilePictureUpload.jsx'
import PaystackTest from './PaystackTest.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <PaystackTest/> */}
  </StrictMode>,
)
