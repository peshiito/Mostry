import { Link } from 'react-router';
import { Interruptor } from '../../../shared/ui/Interruptor.jsx';
import { Miniatura } from '../../../shared/ui/Miniatura.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { useBasePanel } from '../../panelBase/BasePanel.jsx';
import { BotonHay } from './BotonHay.jsx';
import css from './FilaProductoPanel.module.css';
import { StockFila } from './StockFila.jsx';
import { ItemAnimado } from '../../../shared/movimiento/ListaAnimada.jsx';

// Producto en la lista del panel: datos, su stock (según la forma) y switch de
// visible. Los de "hay / no hay" se cambian de un toque, sin entrar al producto.
export function FilaProductoPanel({ ref, i, producto: p, onActivo, onAgotado }) {
  const { rutas } = useBasePanel();
  return (
    <ItemAnimado ref={ref} i={i} className={css.fila}>
      <Link to={`${rutas}/productos/${p.id}`} className={css.link}>
        <Miniatura src={p.foto} tamano={56} />
        <span className={css.textos}>
          <span className={css.nombre}>{p.nombre}</span>
          <span className={css.meta}>
            <StockFila p={p} />
          </span>
          <Monto centavos={p.precio} tamano="sm" />
        </span>
      </Link>
      {p.modoStock === 'simple' ? (
        <BotonHay nombre={p.nombre} agotado={p.agotado} onCambio={onAgotado} />
      ) : null}
      <Interruptor
        etiqueta={`${p.nombre} visible en la tienda`}
        oculto
        activo={p.activo}
        onCambio={onActivo}
      />
    </ItemAnimado>
  );
}
