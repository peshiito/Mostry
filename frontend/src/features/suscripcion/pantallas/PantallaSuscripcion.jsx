import { fechaCorta } from '../../../shared/lib/fechas.js';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { FilaPago } from '../components/FilaPago.jsx';
import { TarjetaPagar } from '../components/TarjetaPagar.jsx';
import { useSuscripcion } from '../hooks/useSuscripcion.js';

const ESTADO = {
  prueba: ['mostaza', 'Prueba gratis'],
  activa: ['ok', 'Al día'],
  gracia: ['coral', 'Vencido · en gracia'],
  suspendida: ['ladrillo', 'Suspendida'],
};

// Plan de Mostry: estado, cómo pagar y pagos registrados (Stitch 49).
export function PantallaSuscripcion() {
  const s = useSuscripcion();
  const [tono, texto] = ESTADO[s.estado];
  const vence = s.planHasta;
  return (
    <Pagina>
      <TituloPagina migas="Cuenta" titulo="Suscripción" />
      <Tarjeta>
        <Etiqueta tono={tono}>{texto}</Etiqueta>
        <p>
          {s.estado === 'activa' ? 'Tu plan vence el' : 'Vence el'}{' '}
          <strong>{fechaCorta(vence)}</strong>
        </p>
      </Tarjeta>
      {s.estado === 'activa' ? null : <TarjetaPagar />}
      <Seccion titulo="Pagos registrados">
        {s.errorPagos ? (
          <ErrorCarga
            error={s.errorPagos}
            que="tus pagos"
            onReintentar={s.recargarPagos}
          />
        ) : s.pagos.length ? (
          <Lista>
            {s.pagos.map((p) => (
              <FilaPago key={p.id} pago={p} />
            ))}
          </Lista>
        ) : (
          <Estado icono="receipt_long" titulo="Todavía no registramos pagos" />
        )}
      </Seccion>
    </Pagina>
  );
}
