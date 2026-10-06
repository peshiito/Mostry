import { z } from 'zod';
import { plata, plataPositiva } from '../../shared/utils/esquemas.js';
import { enArgentina } from '../../shared/utils/horaArgentina.js';

const fecha = z.iso.date();

export const esquemaAbrir = z.strictObject({ montoApertura: plata });
export const esquemaCerrar = z.strictObject({ montoContado: plata });

// Movimiento cargado a mano por el comerciante (origen "manual").
export const esquemaMovimiento = z.strictObject({
  tipo: z.enum(['ingreso', 'egreso', 'deposito']),
  medio: z.enum(['efectivo', 'transferencia']),
  monto: plataPositiva,
  concepto: z.string().trim().min(2).max(150),
});

const hoy = () => enArgentina(new Date()).fecha;
export const esquemaPeriodo = z
  .strictObject({ desde: fecha.default(hoy), hasta: fecha.default(hoy) })
  .refine((p) => p.desde <= p.hasta, '"desde" no puede ser posterior a "hasta"')
  .refine(
    (p) => (Date.parse(p.hasta) - Date.parse(p.desde)) / 86_400_000 <= 366,
    'Como máximo un año',
  );
