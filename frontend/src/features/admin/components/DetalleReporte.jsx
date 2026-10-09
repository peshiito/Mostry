import { linkWhatsapp } from '../../../shared/lib/linkSeguro.js';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { AreaTexto, Campo } from '../../../shared/ui/Campo.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import { useReporteAdmin } from '../hooks/useReporteAdmin.js';
import { CuerpoReporte } from './CuerpoReporte.jsx';
import css from './DetalleReporte.module.css';

const ESTADOS = [
  { valor: 'nuevo', texto: 'Nuevo' },
  { valor: 'en_curso', texto: 'En revisión' },
  { valor: 'resuelto', texto: 'Resuelto' },
];

export function DetalleReporte({ id, onCambio }) {
  const d = useReporteAdmin(id, onCambio);
  const r = d.reporte;
  if (d.error) return <ErrorCarga que="el reporte" onReintentar={d.recargar} />;
  if (!r) return <Esqueleto filas={4} />;
  const wa = linkWhatsapp(
    r.whatsapp,
    `Hola ${r.autor?.split(' ')[0] ?? ''}, soy Pedro de Mostry. Te escribo por tu reporte #${r.numero}: `,
  );
  return (
    <div className={css.detalle}>
      <CuerpoReporte r={r} />
      <Segmentado
        etiqueta="Estado del reporte"
        opciones={ESTADOS}
        valor={d.estado}
        onCambio={d.setEstado}
      />
      <Campo etiqueta="Respuesta para la tienda" ayuda="La ve en Mis reportes.">
        {(c) => (
          <AreaTexto
            c={c}
            rows={3}
            maxLength={1000}
            value={d.respuesta}
            onChange={(e) => d.setRespuesta(e.target.value)}
          />
        )}
      </Campo>
      <AvisoError error={d.accion.error} />
      <div className={css.acciones}>
        <Boton
          variante="principal"
          cargando={d.accion.enviando}
          onClick={() => d.accion.ejecutar()}
        >
          Guardar
        </Boton>
        {wa ? (
          <Boton icono="chat" href={wa}>
            Escribir por WhatsApp
          </Boton>
        ) : null}
      </div>
    </div>
  );
}
