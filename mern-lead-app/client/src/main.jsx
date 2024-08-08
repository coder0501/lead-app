import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import App from './App';
import Login from './components/Login';
import Signup from './components/Signup';
import Lead from './components/Lead';
import './index.css';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey="6LcFZCEqAAAAACjLH-trRCFvkKk4d6wi12Foz6pF">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" component={ResetPassword} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/leads" element={<Lead />} />
          <Route path="/" element={<App />} />
        </Routes>
      </Router>
    </GoogleReCaptchaProvider>
  </React.StrictMode>
);
