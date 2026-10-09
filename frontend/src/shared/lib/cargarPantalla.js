import { lazy } from 'react';

// Pantalla que se descarga recién cuando se abre (carga diferida por pantalla):
// el celular baja solo lo que usa. `nombre` es el export de ese archivo.
export const cargarPantalla = (importar, nombre) =>
  lazy(() => importar().then((m) => ({ default: m[nombre] })));
