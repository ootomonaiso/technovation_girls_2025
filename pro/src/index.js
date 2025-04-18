import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // よく知らんけどReactはブラウザルーターのこと嫌いらしいよ
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="107285687559-nqjudb9mfrsaua8gdcjbjpt69d4f457r.apps.googleusercontent.com">
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </HashRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
