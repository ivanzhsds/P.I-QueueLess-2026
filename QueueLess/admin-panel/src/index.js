import react from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './pages/Dashboard';
import React from 'react';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);