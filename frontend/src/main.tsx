import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL as string;
axios.defaults.withCredentials = true;



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
