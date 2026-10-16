import { VERSION_LEGAL } from '../../../config/legal.js';
import type { Insertable } from 'kysely';
import { db } from '../../../shared/db/db.js';
import type { ClientesTabla } from '../../../shared/db/tipos/club.js';
import { idInsertado } from '../../../shared/db/idInsertado.js';
import type { DatosClub } from './schemas.js';

const columnas = [
  'id',
  'email',
  'hashClave',
  'nombre',
  'whatsapp',
  'direccion',
  'emailVerificadoEn',
  'activo',
] as const;

type PerfilNuevo = Pick<
  Insertable<ClientesTabla>,
  'hashClave' | 'nombre' | 'whatsapp' | 'direccion'
>;

const seleccionar = () => db.selectFrom('clientes').select(columnas);

export const clientesRepo = {
  buscarPorEmail: (email: string) =>
    seleccionar().where('email', '=', email).executeTakeFirst(),

  buscarPorId: (id: number) => seleccionar().where('id', '=', id).executeTakeFirst(),

  async crear(datos: PerfilNuevo & { email: string }) {
    const r = await db
      .insertInto('clientes')
      .values({ ...datos, aceptoTerminosEn: new Date(), terminosVersion: VERSION_LEGAL })
      .executeTakeFirstOrThrow();
    return idInsertado(r);
  },

  // Registro repetido sobre una cuenta que nunca se verificó: valen los datos nuevos.
  pisarSinVerificar: (id: number, datos: PerfilNuevo) =>
    db
      .updateTable('clientes')
      .set({ ...datos, aceptoTerminosEn: new Date(), terminosVersion: VERSION_LEGAL })
      .where('id', '=', id)
      .where('emailVerificadoEn', 'is', null)
      .execute(),

  marcarEmailVerificado: (id: number) =>
    db
      .updateTable('clientes')
      .set({ emailVerificadoEn: new Date() })
      .where('id', '=', id)
      .execute(),

  cambiarClave: (id: number, hashClave: string) =>
    db.updateTable('clientes').set({ hashClave }).where('id', '=', id).execute(),

  actualizar: (id: number, datos: DatosClub) =>
    db.updateTable('clientes').set(datos).where('id', '=', id).execute(),
};

export type Cliente = NonNullable<Awaited<ReturnType<typeof clientesRepo.buscarPorId>>>;
