import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from '@/components/common';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary sectionName="Hệ thống Cutlet Spring">
    <App />
  </ErrorBoundary>
);
