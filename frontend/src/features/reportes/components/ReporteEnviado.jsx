import { Link } from 'react-router';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { usePanel } from '../../panelBase/PanelContexto.jsx';
import { avisoReporte } from '../lib/avisoWhatsapp.js';

// Después de mandar el reporte: confirmación y, si querés, aviso por WhatsApp.
export function ReporteEnviado({ reporte }) {
  const { tienda } = usePanel();
  const link = avisoReporte({ ...reporte, tienda: tienda.nombre });
  return (
    <>
      <Estado
        icono="check_circle"
        titulo={`Reporte #${reporte.numero} enviado`}
        nivel={1}
      >
        Lo vemos lo antes posible. La respuesta te aparece en Mis reportes.
      </Estado>
      {reporte.capturaFallo ? (
        <Aviso tipo="alerta" titulo="La captura no se pudo subir">
          {typeof reporte.capturaFallo === 'string' ? `${reporte.capturaFallo} ` : ''}El
          reporte llegó igual. Si hace falta, mandala por WhatsApp.
        </Aviso>
      ) : null}
      {link ? (
        <Boton variante="principal" tamano="lg" anchoCompleto icono="chat" href={link}>
          Avisar a Mostry por WhatsApp
        </Boton>
      ) : null}
      <Link to="/panel/reportes">Ver mis reportes</Link>
    </>
  );
}
