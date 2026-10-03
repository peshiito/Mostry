import type { Kysely } from 'kysely';
import type { Database } from './tipos/index.js';

// La base o una transacción: los repositorios aceptan cualquiera de los dos.
export type Ejecutor = Kysely<Database>;
