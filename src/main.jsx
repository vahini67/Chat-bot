import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import nhost from './nhost';
import { NhostProvider } from '@nhost/react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NhostProvider nhost={nhost}>
      <App />
    </NhostProvider>
  </StrictMode>
);
