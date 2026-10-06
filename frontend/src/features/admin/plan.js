// Pago registrado por el admin: el plan se extiende 30 días desde max(plan_hasta, hoy) (6.5).
const DIA = 24 * 3600 * 1000;

export function nuevoVencimiento(planHasta, hoy = new Date()) {
  const desde = Math.max(new Date(planHasta).getTime(), hoy.getTime());
  return new Date(desde + 30 * DIA);
}
