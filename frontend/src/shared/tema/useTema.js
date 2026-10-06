import { useSyncExternalStore } from 'react';
import { almacenTema, elegirTema } from './tema.js';

// Preferencia de tema actual y cómo cambiarla (se comparte en toda la app).
export function useTema() {
  const preferencia = useSyncExternalStore(almacenTema.suscribir, almacenTema.leer);
  return { preferencia, elegir: elegirTema };
}
