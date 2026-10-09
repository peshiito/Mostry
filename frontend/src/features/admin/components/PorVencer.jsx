import { Link } from 'react-router';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { adaptarTiendaAdmin } from '../api/admin.js';
import { textoDias } from '../lib/mensaje.js';
import css from './PorVencer.module.css';

// Franja de arriba del dashboard: tiendas que vencen en 2 días o menos (o en
// gracia), la más urgente primero, con su botón para escribirles.
export function PorVencer({ onWhatsapp }) {
  const { datos, error, recargar } = useConsulta('/admin/tiendas?porVencer=1');
  const tiendas = (datos?.tiendas ?? []).map((t) => adaptarTiendaAdmin(t));
  // Si no cargó, se dice: callar haría creer que no vence nadie.
  if (error) return <ErrorCarga que="las tiendas por vencer" onReintentar={recargar} />;
  if (tiendas.length === 0) return null;
  return (
    <section className={css.franja} aria-labelledby="por-vencer">
      <h2 id="por-vencer" className={css.titulo}>
        Por vencer <span className={css.cuenta}>{tiendas.length}</span>
      </h2>
      <ul className={css.lista}>
        {tiendas.map((t) => (
          <li key={t.id} className={css.item}>
            <Link to={`/tiendas/${t.id}`} className={css.nombre}>
              {t.nombre}
            </Link>
            <Etiqueta tono={t.estado === 'gracia' ? 'ladrillo' : 'gris'}>
              {t.estado === 'gracia' ? 'En gracia' : textoDias(t.diasRestantes)}
            </Etiqueta>
            <BotonIcono
              icono="chat"
              etiqueta={`Mandar WhatsApp a ${t.nombre}`}
              onClick={() => onWhatsapp(t)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
