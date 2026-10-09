import { Link } from 'react-router';
import { fechaCorta } from '../../../shared/lib/fechas.js';
import { DOMINIO_BASE } from '../../../shared/lib/zonaActual.js';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { ESTADOS_TIENDA } from '../estados.js';
import css from './TablaTiendas.module.css';

export function FilaTienda({ tienda: t, onWhatsapp }) {
  const est = ESTADOS_TIENDA[t.estado];
  return (
    <tr>
      <td>
        <Link to={`/tiendas/${t.id}`} className={css.nombre}>
          {t.nombre}
        </Link>
        <span className={css.slug}>
          {t.slug}.{DOMINIO_BASE}
        </span>
      </td>
      <td>{t.email}</td>
      <td>
        <Etiqueta tono={est.tono} punto>
          {est.texto}
        </Etiqueta>
      </td>
      <td className={['gracia', 'suspendida'].includes(t.estado) ? css.vencido : ''}>
        {t.vence ? fechaCorta(t.vence) : '—'}
      </td>
      <td>{fechaCorta(t.alta)}</td>
      <td>
        <BotonIcono
          icono="chat"
          etiqueta={`Mandar WhatsApp a ${t.nombre}`}
          onClick={() => onWhatsapp(t)}
        />
      </td>
    </tr>
  );
}
