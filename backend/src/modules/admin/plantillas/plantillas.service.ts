import { config } from '../../../config/env.js';
import { plantillasRepo } from './plantillas.repository.js';
import {
  CLAVES_PLANTILLA,
  PLANTILLAS_BASE,
  type ClavePlantilla,
} from './plantillasBase.js';

// Las 4 plantillas con su texto actual (editado o de base) y los datos de pago
// de Mostry que usan las variables {precio}, {alias} y {titular}.
export async function verPlantillas() {
  const editadas = new Map(
    (await plantillasRepo.editadas()).map((p) => [p.clave, p.texto]),
  );
  return {
    plantillas: CLAVES_PLANTILLA.map((clave) => ({
      clave,
      titulo: PLANTILLAS_BASE[clave].titulo,
      texto: editadas.get(clave) ?? PLANTILLAS_BASE[clave].texto,
      editada: editadas.has(clave),
    })),
    datos: {
      alias: config.MOSTRY_ALIAS,
      titular: config.MOSTRY_TITULAR,
      precio: config.PRECIO_MENSUAL,
    },
  };
}

export async function guardarPlantilla(clave: ClavePlantilla, texto: string) {
  await plantillasRepo.guardar(clave, texto);
  return verPlantillas();
}

// Vuelve al texto de base (borra la versión editada).
export async function restaurarPlantilla(clave: ClavePlantilla) {
  await plantillasRepo.restaurar(clave);
  return verPlantillas();
}
