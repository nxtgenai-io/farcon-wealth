import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './farcon.css';

createRoot(document.getElementById('root')!).render(<App />);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Offline support is optional if the worker cannot register.
    });
  });
}
