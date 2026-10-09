import { db } from '../../../shared/db/db.js';
import type { ClavePlantilla } from './plantillasBase.js';

// Textos editados por el admin (los que no están usan el texto de base).
export const plantillasRepo = {
  editadas: () => db.selectFrom('plantillasMensaje').select(['clave', 'texto']).execute(),

  guardar: (clave: ClavePlantilla, texto: string) =>
    db
      .insertInto('plantillasMensaje')
      .values({ clave, texto })
      .onDuplicateKeyUpdate({ texto })
      .execute(),

  restaurar: (clave: ClavePlantilla) =>
    db.deleteFrom('plantillasMensaje').where('clave', '=', clave).execute(),
};
