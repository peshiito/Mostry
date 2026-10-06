import { ESTADOS, recorrido } from '../../../shared/lib/estadosPedido.js';
import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './LineaTiempo.module.css';

// Recorrido del pedido: hechos en verde, el actual en mostaza, los que faltan en gris.
export function LineaTiempo({ pedido }) {
  const pasos = recorrido(pedido);
  const actual = pasos.indexOf(pedido.estado);
  return (
    <ol className={css.linea}>
      {pasos.map((p, i) => {
        const estado = i < actual ? 'hecho' : i === actual ? 'actual' : 'falta';
        return (
          <li
            key={p}
            className={`${css.paso} ${css[estado]}`}
            aria-current={estado === 'actual' ? 'step' : undefined}
          >
            <span className={css.punto} aria-hidden="true">
              {estado === 'hecho' ? <Icono nombre="check" tamano={16} /> : null}
            </span>
            <span className={css.texto}>
              {ESTADOS[p].texto}
              {estado === 'actual' ? <span className={css.ahora}>Ahora</span> : null}
              <span className="soloLector">
                {estado === 'hecho'
                  ? ' (listo)'
                  : estado === 'falta'
                    ? ' (pendiente)'
                    : ''}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
