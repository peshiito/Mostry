import { fechaHora } from '../../../shared/lib/fechas.js';
import { nombrePantalla } from '../../reportes/lib/pantallas.js';
import css from './DetalleReporte.module.css';

// Lo que mandó la tienda: quién, dónde, qué pasó y la captura (URL firmada).
export function CuerpoReporte({ r }) {
  return (
    <>
      <p className={css.meta}>
        <strong>{r.tienda}</strong> · #{r.numero} · {nombrePantalla(r.pantalla)} ·{' '}
        {fechaHora(r.creadoEn)}
        <br />
        {r.autor} · {r.email}
      </p>
      <p className={css.texto}>{r.descripcion}</p>
      {r.captura ? (
        <a
          href={r.captura}
          target="_blank"
          rel="noopener noreferrer"
          className={css.captura}
        >
          <img src={r.captura} alt={`Captura del reporte #${r.numero}`} />
        </a>
      ) : null}
      {r.navegador ? <p className={css.navegador}>{r.navegador}</p> : null}
    </>
  );
}
