import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { BarraSubida } from '../../../shared/ui/BarraSubida.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { CamposReporte } from '../components/CamposReporte.jsx';
import { ReporteEnviado } from '../components/ReporteEnviado.jsx';
import { useReportar } from '../hooks/useReportar.js';

// "Reportar un problema" (Etapa 14.5, parte D): le llega a Mostry al toque.
export function PantallaReportar() {
  const r = useReportar();
  if (r.enviado) {
    return (
      <Pagina>
        <ReporteEnviado reporte={r.enviado} />
      </Pagina>
    );
  }
  const listo = r.pantalla && r.descripcion.trim().length >= 10;
  return (
    <Pagina as="form" onSubmit={r.enviar} noValidate>
      <TituloPagina
        migas="Ayuda"
        titulo="Reportar un problema"
        bajada="Contanos qué pasó y lo revisamos."
      />
      <AvisoError error={r.accion.error} />
      <CamposReporte r={r} />
      <BarraSubida progreso={r.accion.progreso} />
      <Boton
        type="submit"
        variante="principal"
        tamano="lg"
        anchoCompleto
        disabled={!listo}
        cargando={r.accion.enviando}
        textoCargando="Enviando…"
      >
        Mandar reporte
      </Boton>
    </Pagina>
  );
}
