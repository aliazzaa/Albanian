import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// تسجيل ملف الـ Service Worker لتفعيل التشغيل دون اتصال (Offline PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[PWA] تم تسجيل وكيل الخدمة بنجاح ضمن النطاق: ', registration.scope);
      })
      .catch((error) => {
        console.error('[PWA] فشل تسجيل وكيل الخدمة الـ Service Worker: ', error);
      });
  });
}