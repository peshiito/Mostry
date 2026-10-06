import { fechaCorta } from '../../../shared/lib/fechas.js';
import { plata } from '../../../shared/lib/plata.js';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { Fila } from '../../../shared/ui/Fila.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
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
        {s.pagos.length ? (
          <Lista>
            {s.pagos.map((p) => (
              <Fila
                key={p.id}
                titulo={plata(p.monto)}
                detalle={`Pagado el ${fechaCorta(p.fecha)} · cubre hasta el ${fechaCorta(p.hasta)}`}
              />
            ))}
          </Lista>
        ) : (
          <Estado icono="receipt_long" titulo="Todavía no registramos pagos" />
        )}
      </Seccion>
    </Pagina>
  );
}
