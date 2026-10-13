import { lazy } from 'react';
import { iniciarTarea } from '../carga/progreso.js';

// Pantalla que se descarga recién cuando se abre (carga diferida por pantalla):
// el celular baja solo lo que usa. `nombre` es el export de ese archivo.
// Bajar el archivo cuenta como una tarea de la barra de carga.
export const cargarPantalla = (importar, nombre) =>
  lazy(() => {
    const terminar = iniciarTarea();
    return importar()
      .then((m) => ({ default: m[nombre] }))
      .finally(terminar);
  });
