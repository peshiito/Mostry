import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { EsqueletoDetalle } from '../../../shared/ui/esqueletos/index.js';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { AyudaAvisos } from '../components/AyudaAvisos.jsx';
import { EstadoAvisos } from '../components/EstadoAvisos.jsx';
import { SilencioAvisos } from '../components/SilencioAvisos.jsx';
import { useAvisos } from '../hooks/useAvisos.js';
import css from '../components/Avisos.module.css';

const telefonos = (n) =>
  n === 1
    ? ' Tenés 1 teléfono con avisos.'
    : n > 1
      ? ` Tenés ${n} teléfonos con avisos.`
      : '';

// Avisos 1: que le llegue cada pedido al celular, aunque la compu esté cerrada.
export function PantallaAvisos() {
  const a = useAvisos();
  const { datos, cargando, error, recargar } = a.consulta;
  if (cargando) return <EsqueletoDetalle />;
  if (error) return <ErrorCarga error={error} que="tus avisos" onReintentar={recargar} />;
  return (
    <Pagina>
      <TituloPagina
        migas="Cuenta"
        titulo="Avisos en el teléfono"
        bajada="Te avisamos cada pedido, encargo y comprobante nuevo."
      />
      <AvisoError error={a.activar.error ?? a.desactivar.error ?? a.probar.error} />
      <AyudaAvisos situacion={a.situacion} configurado={datos.configurado} />
      <EstadoAvisos a={a} />
      <Seccion titulo="De noche">
        <SilencioAvisos silencio={datos.silencio} onGuardado={recargar} />
      </Seccion>
      <p className={css.texto}>
        Todas las mañanas, cuando abrís, te mandamos un resumen por mail (y al celular, si
        tenés los avisos) si quedó algo esperando.
        {telefonos(datos.telefonos)}
      </p>
    </Pagina>
  );
}
