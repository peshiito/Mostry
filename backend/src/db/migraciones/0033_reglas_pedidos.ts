import { type Kysely, sql } from 'kysely';

// Reglas de negocio que la base garantiza aunque un servicio se equivoque
// (revisión de la Etapa 11). Montos en centavos.
const REGLAS = [
  // Un pedido inmediato nunca tiene seña: si no, se cobraría la seña en vez del total.
  ['pedidos', 'ck_pedidos_sena_solo_encargo', "tipo = 'encargo' OR sena = 0"],
  // Esperando el pago siempre hay un plazo (el worker cancela por ese plazo).
  [
    'pedidos',
    'ck_pedidos_plazo_pago',
    "estado <> 'pendiente_pago' OR vence_comprobante_en IS NOT NULL",
  ],
  [
    'pedidos',
    'ck_pedidos_cancelado_fecha',
    "estado <> 'cancelado' OR cancelado_en IS NOT NULL",
  ],
  // Un comprobante aprobado guarda los datos del pago (sección 6.1).
  [
    'comprobantes',
    'ck_comprobantes_aprobado_datos',
    "estado <> 'aprobado' OR (monto IS NOT NULL AND fecha_operacion IS NOT NULL" +
      ' AND titular IS NOT NULL AND numero_operacion IS NOT NULL AND aprobado_en IS NOT NULL)',
  ],
] as const;

export async function up(db: Kysely<unknown>): Promise<void> {
  for (const [tabla, nombre, regla] of REGLAS) {
    await sql`ALTER TABLE ${sql.table(tabla)} ADD CONSTRAINT ${sql.ref(nombre)} CHECK (${sql.raw(regla)})`.execute(
      db,
    );
  }
}

export async function down(db: Kysely<unknown>): Promise<void> {
  for (const [tabla, nombre] of [...REGLAS].reverse()) {
    await sql`ALTER TABLE ${sql.table(tabla)} DROP CHECK ${sql.ref(nombre)}`.execute(db);
  }
}
