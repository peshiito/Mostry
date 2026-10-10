import { db } from '../../../shared/db/db.js';
import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import { idInsertado } from '../../../shared/db/idInsertado.js';

const columnas = [
  'id',
  'email',
  'hashClave',
  'nombre',
  'esAdmin',
  'emailVerificadoEn',
  'activo',
] as const;

const seleccionar = () => db.selectFrom('usuarios').select(columnas);

export const usuariosRepo = {
  buscarPorEmail: (email: string) =>
    seleccionar().where('email', '=', email).executeTakeFirst(),

  buscarPorId: (id: number) => seleccionar().where('id', '=', id).executeTakeFirst(),

  async crear(
    datos: { email: string; hashClave: string; nombre: string },
    ej: Ejecutor = db,
  ) {
    return idInsertado(
      await ej.insertInto('usuarios').values(datos).executeTakeFirstOrThrow(),
    );
  },

  marcarEmailVerificado: (id: number) =>
    db
      .updateTable('usuarios')
      .set({ emailVerificadoEn: new Date() })
      .where('id', '=', id)
      .execute(),

  cambiarClave: (id: number, hashClave: string) =>
    db.updateTable('usuarios').set({ hashClave }).where('id', '=', id).execute(),
};
