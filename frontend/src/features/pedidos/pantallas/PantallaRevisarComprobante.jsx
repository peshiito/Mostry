import { useState } from 'react';
import { useParams } from 'react-router';
import { plata } from '../../../shared/lib/plata.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { usePanel } from '../../panelBase/PanelContexto.jsx';
import { FormAprobacion } from '../components/FormAprobacion.jsx';
import { HojaRechazo } from '../components/HojaRechazo.jsx';
import { VerComprobante } from '../components/VerComprobante.jsx';
import { usePedidoPanel } from '../hooks/usePedidoPanel.js';
import { useRevision } from '../hooks/useRevision.js';

// Revisar el comprobante: aprobar con los datos del pago o rechazar (Stitch 27 y 28).
export function PantallaRevisarComprobante() {
  const { id } = useParams();
  const { pedido, cargando } = usePedidoPanel(id);
  const { tienda } = usePanel();
  const r = useRevision(pedido);
  const [rechazando, setRechazando] = useState(false);
  if (cargando || r.cargando) return <Esqueleto filas={4} alto={96} />;
  if (!pedido || !r.comprobante)
    return <Estado icono="check_circle" titulo="No hay comprobantes para revisar" />;
  return (
    <Pagina>
      <TituloPagina migas={`Pedido #${pedido.numero}`} titulo="Revisar comprobante" />
      <Aviso
        icono="account_balance"
        titulo={`Tenés que recibir ${plata(r.montoEsperado)} en ${tienda.alias}`}
      >
        Fijate en tu cuenta que la plata haya entrado antes de aprobar.
      </Aviso>
      <VerComprobante comprobante={r.comprobante} onAbrir={r.abrir} />
      <AvisoError error={r.accion.error} />
      <FormAprobacion datos={r.datos} errores={r.errores} onCambio={r.setDatos} />
      <Boton
        variante="principal"
        tamano="lg"
        anchoCompleto
        icono="check"
        cargando={r.accion.enviando}
        onClick={r.aprobar}
      >
        Aprobar pago
      </Boton>
      <Boton anchoCompleto onClick={() => setRechazando(true)}>
        Rechazar
      </Boton>
      <HojaRechazo
        abierta={rechazando}
        onCerrar={() => setRechazando(false)}
        pedido={pedido}
        onRechazar={r.rechazar}
      />
    </Pagina>
  );
}
