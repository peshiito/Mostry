import { Icono } from '../../shared/ui/Icono.jsx';
import { FORMAS_STOCK } from '../productos/components/FormaStock.jsx';
import { MODULOS } from './opciones.js';
import css from './Empezar.module.css';

// "Así queda tu Mostry": lo que se va a ver y lo que queda escondido.
export function Resumen({ perfil }) {
  const forma = FORMAS_STOCK.find((f) => f.valor === perfil.modoStock);
  return (
    <ul className={css.resumen}>
      <li className={`${css.item} ${css.si}`}>
        <Icono nombre="check" tamano={20} /> Caja y productos
      </li>
      {MODULOS.filter((m) => m.clave !== 'usaEncargos' || perfil.vendeOnline).map((m) => (
        <li key={m.clave} className={`${css.item} ${perfil[m.clave] ? css.si : css.no}`}>
          <Icono nombre={perfil[m.clave] ? 'check' : 'remove'} tamano={20} /> {m.titulo}
        </li>
      ))}
      <li className={css.item}>
        <Icono nombre="inventory_2" tamano={20} /> Stock: {forma?.titulo.toLowerCase()}
      </li>
    </ul>
  );
}
