import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('CampusFind: Starting initialization...');

try {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Failed to find the root element');
  }
  
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('CampusFind: Rendered successfully');
} catch (error) {
  console.error('CampusFind Initialization Error:', error);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `<div style="padding: 20px; color: red; font-family: sans-serif;">
      <h2>Something went wrong</h2>
      <pre>${error instanceof Error ? error.stack : String(error)}</pre>
    </div>`;
  }
}

