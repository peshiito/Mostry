import { zonaDesdeHost } from './zona.js';

// Zona y slug de la página actual (se calculan una vez, al cargar).
export const DOMINIO_BASE = import.meta.env.VITE_DOMINIO_BASE ?? 'mostry.localhost';
export const ZONA_ACTUAL = zonaDesdeHost(window.location.hostname, DOMINIO_BASE);
