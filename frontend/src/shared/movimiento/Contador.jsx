import { useContar } from './useContar.js';

// Un número entero que cuenta hasta su valor (KPIs, pedidos por aprobar).
// Si no es un número (por ejemplo "—"), lo muestra tal cual.
export function Contador({ valor }) {
  const visible = useContar(typeof valor === 'number' ? valor : 0, {
    activo: typeof valor === 'number',
    paso: 1,
  });
  return <span className="cifras">{typeof valor === 'number' ? visible : valor}</span>;
}
