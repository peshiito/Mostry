// Antes de todos los tests: deja la base mostry_test con el esquema al día.
export default async function prepararBaseDeTest(): Promise<void> {
  await import('./cargarEntorno.js');
  const { db } = await import('../shared/db/db.js');
  const { crearMigrador } = await import('../db/migrador.js');
  const { error } = await crearMigrador(db).migrateToLatest();
  await db.destroy();
  if (error) throw error;
}
