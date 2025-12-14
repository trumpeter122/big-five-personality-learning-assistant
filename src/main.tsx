import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container missing');
}

const basePath = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/';

createRoot(container).render(
  <StrictMode>
    <BrowserRouter basename={basePath === '/' ? undefined : basePath}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
