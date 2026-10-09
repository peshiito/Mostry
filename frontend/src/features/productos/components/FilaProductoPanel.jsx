import { Link } from 'react-router';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { Interruptor } from '../../../shared/ui/Interruptor.jsx';
import { Miniatura } from '../../../shared/ui/Miniatura.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { useBasePanel } from '../../panelBase/BasePanel.jsx';
import css from './FilaProductoPanel.module.css';

// Producto en la lista del panel: datos, alertas de stock y switch de visible.
export function FilaProductoPanel({ producto: p, onActivo }) {
  const { rutas } = useBasePanel();
  const bajo = !p.aceptaEncargo && p.stock > 0 && p.stock <= p.stockMinimo;
  return (
    <li className={css.fila}>
      <Link to={`${rutas}/productos/${p.id}`} className={css.link}>
        <Miniatura src={p.foto} tamano={56} />
        <span className={css.textos}>
          <span className={css.nombre}>{p.nombre}</span>
          <span className={css.meta}>
            {p.aceptaEncargo ? (
              <Etiqueta tono="mostaza">Por encargo</Etiqueta>
            ) : (
              `Stock: ${p.stock}`
            )}
            {bajo ? <Etiqueta tono="mostaza">Stock bajo</Etiqueta> : null}
            {p.stock === 0 && !p.aceptaEncargo ? (
              <Etiqueta tono="ladrillo">Agotado</Etiqueta>
            ) : null}
          </span>
          <Monto centavos={p.precio} tamano="sm" />
        </span>
      </Link>
      <Interruptor
        etiqueta={`${p.nombre} visible en la tienda`}
        oculto
        activo={p.activo}
        onCambio={onActivo}
      />
    </li>
  );
}
