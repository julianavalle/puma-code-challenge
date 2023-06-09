import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import { createRoot } from 'react-dom/client';

axios.defaults.baseURL = 'http://localhost:3000';



createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


reportWebVitals();
