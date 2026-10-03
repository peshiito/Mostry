import { db } from '../../../shared/db/db.js';

// Estado del TOTP (app autenticadora) de cada usuario.
export const usuariosTotpRepo = {
  // Solo mientras el TOTP no esté activado: no se puede pisar uno en uso.
  guardarTotpPendiente: (id: number, secretoCifrado: string) =>
    db
      .updateTable('usuarios')
      .set({ totpSecretoCifrado: secretoCifrado, totpUltimoPaso: null })
      .where('id', '=', id)
      .where('totpActivadoEn', 'is', null)
      .execute(),

  activarTotp: (id: number) =>
    db
      .updateTable('usuarios')
      .set({ totpActivadoEn: new Date() })
      .where('id', '=', id)
      .execute(),

  // Atómico: true solo si el paso es posterior al último usado (anti-replay).
  async usarPasoTotp(id: number, paso: number): Promise<boolean> {
    const r = await db
      .updateTable('usuarios')
      .set({ totpUltimoPaso: paso })
      .where('id', '=', id)
      .where((eb) =>
        eb.or([eb('totpUltimoPaso', 'is', null), eb('totpUltimoPaso', '<', paso)]),
      )
      .executeTakeFirst();
    return r.numUpdatedRows === 1n;
  },
};
