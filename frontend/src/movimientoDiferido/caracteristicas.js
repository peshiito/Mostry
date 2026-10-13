// Funciones de Motion (animaciones, gestos y layout). Se bajan aparte, después
// de mostrar la pantalla, así la app nunca espera a las animaciones. Vive fuera
// de src/shared a propósito: si no, cae en el bloque "compartido" y se baja al
// arrancar (ver MovimientoProveedor y vite.config.js).
export { domMax as default } from 'motion/react';
