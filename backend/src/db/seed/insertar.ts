import type { Transaction } from 'kysely';
import type { Database } from '../../shared/db/tipos/index.js';

export { idInsertado } from '../../shared/db/idInsertado.js';
export type Tx = Transaction<Database>;
