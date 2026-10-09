// Fecha dentro de `dias`, con el mismo texto que usa el calendario de la tienda
// (aria-label "jueves, 9 de octubre"), en hora argentina.
export function diaDentroDe(dias) {
  const f = new Date(Date.now() + dias * 24 * 60 * 60 * 1000);
  const opciones = { timeZone: 'America/Argentina/Buenos_Aires' };
  return {
    etiqueta: f.toLocaleDateString('es-AR', {
      ...opciones,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }),
    otroMes:
      f.toLocaleDateString('es-AR', { ...opciones, month: 'numeric' }) !==
      new Date().toLocaleDateString('es-AR', { ...opciones, month: 'numeric' }),
  };
}

// Elige HOY en un selector de fecha de Mostry: toca el campo y el día en el calendario.
export async function elegirHoy(page, etiqueta) {
  await page.getByRole('button', { name: etiqueta, exact: true }).click();
  const hoja = page.getByRole('dialog', { name: etiqueta });
  await hoja.getByRole('button', { name: diaDentroDe(0).etiqueta }).click();
}
