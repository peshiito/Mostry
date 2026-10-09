import { useSyncExternalStore } from 'react';

// true si el dispositivo tiene red (eventos online/offline del navegador).
const suscribir = (avisar) => {
  window.addEventListener('online', avisar);
  window.addEventListener('offline', avisar);
  return () => {
    window.removeEventListener('online', avisar);
    window.removeEventListener('offline', avisar);
  };
};

export const useConexion = () =>
  useSyncExternalStore(
    suscribir,
    () => navigator.onLine,
    () => true,
  );
