import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './QuePuedeVer.module.css';

const PUEDE = [
  'Productos, fotos y categorías',
  'Horarios y feriados',
  'Datos y apariencia de la tienda',
];
const NUNCA = [
  'Ventas, pedidos ni clientes',
  'Caja, gastos ni fiados',
  'Tu alias de cobro ni tu contraseña',
];

// Antes de dar permiso, que quede claro qué se puede tocar y qué jamás.
export function QuePuedeVer() {
  return (
    <div className={css.grilla}>
      <Columna
        titulo="Puede revisar y corregir"
        items={PUEDE}
        icono="check_circle"
        tono="ok"
      />
      <Columna titulo="Nunca ve" items={NUNCA} icono="lock" tono="nunca" />
    </div>
  );
}

function Columna({ titulo, items, icono, tono }) {
  return (
    <div>
      <h2 className={css.titulo}>{titulo}</h2>
      <ul className={css.lista}>
        {items.map((i) => (
          <li key={i} className={css.item} data-tono={tono}>
            <Icono nombre={icono} tamano={18} />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
