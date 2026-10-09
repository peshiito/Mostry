import mysql from 'mysql2/promise';
import { BASE_DATOS } from './entorno.js';

// Acceso directo a la base de e2e para preparar escenarios que en la vida real
// llevan días (por ejemplo, que venza la prueba gratis). Nunca toca otra base.
export async function sql(consulta, valores = []) {
  const conexion = await mysql.createConnection(BASE_DATOS);
  try {
    const [filas] = await conexion.execute(consulta, valores);
    return filas;
  } finally {
    await conexion.end();
  }
}

export const idDeTienda = async (slug) =>
  (await sql('SELECT id FROM tiendas WHERE slug = ?', [slug]))[0].id;
