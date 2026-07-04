import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import 'aos/dist/aos.css';
import { useAOS } from './hooks/useAOS';

const AOSInitializer = () => {
  useAOS();
  return null;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AOSInitializer />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);