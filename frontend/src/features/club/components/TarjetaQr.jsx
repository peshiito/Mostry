import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { useQr } from '../hooks/useQr.js';
import { minutosYSegundos } from '../lib/tiempo.js';
import { CodigoQr } from './CodigoQr.jsx';
import css from './TarjetaQr.module.css';

// Tarjeta blanca de alto contraste: el QR, el código para dictar y cuándo cambia.
// (Una web no puede subir el brillo de la pantalla: lo compensa el contraste.)
export function TarjetaQr() {
  const qr = useQr();
  if (qr.error && !qr.codigo)
    return <ErrorCarga error={qr.error} que="tu código" conPagina={false} />;
  return (
    <section
      className={css.tarjeta}
      aria-label="Tu código del Club"
      aria-busy={qr.cargando}
    >
      {qr.codigo ? (
        <CodigoQr texto={qr.codigo} />
      ) : (
        <span className={`${css.qr} ${css.esperando}`} />
      )}
      <p className={css.codigo} aria-live="polite">
        {qr.codigo ? qr.codigo.split('').join(' ') : '· · · · · ·'}
      </p>
      <p className={css.cambia}>
        {qr.quedan ? `Cambia en ${minutosYSegundos(qr.quedan)}` : 'Generando tu código…'}
      </p>
    </section>
  );
}
