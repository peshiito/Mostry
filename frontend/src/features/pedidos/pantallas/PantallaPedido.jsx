import { useState } from 'react';
import { useParams } from 'react-router';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { NoEncontrada } from '../../../shared/ui/NoEncontrada.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { CabeceraPedido } from '../../pedidoPublico/components/CabeceraPedido.jsx';
import { DetallePedido } from '../../pedidoPublico/components/DetallePedido.jsx';
import { LineaTiempo } from '../../pedidoPublico/components/LineaTiempo.jsx';
import { useSuscripcion } from '../../suscripcion/hooks/useSuscripcion.js';
import { AccionesPedido } from '../components/AccionesPedido.jsx';
import { DatosCliente } from '../components/DatosCliente.jsx';
import { HojaCancelar } from '../components/HojaCancelar.jsx';
import { HojaCobroResto } from '../components/HojaCobroResto.jsx';
import { usePedidoPanel } from '../hooks/usePedidoPanel.js';

// Detalle de un pedido en el panel (Stitch 26).
export function PantallaPedido() {
  const { id } = useParams();
  const p = usePedidoPanel(id);
  const { soloLectura } = useSuscripcion();
  const [hoja, setHoja] = useState(null);
  if (p.cargando) return <Esqueleto filas={5} alto={96} />;
  if (!p.pedido) return <NoEncontrada volver="/panel/pedidos" />;
  const { pedido } = p;
  const resto = pedido.total - pedido.sena;
  function avanzar(estado) {
    if (estado === 'entregado' && pedido.tipo === 'encargo' && resto > 0)
      return setHoja('cobro');
    p.cambiarEstado(estado);
  }
  const cerrar = () => setHoja(null);
  return (
    <Pagina>
      <CabeceraPedido pedido={pedido} />
      <AvisoError error={p.accion.error} />
      <DatosCliente pedido={pedido} />
      <DetallePedido pedido={pedido} />
      {pedido.estado !== 'cancelado' ? (
        <Tarjeta>
          <LineaTiempo pedido={pedido} />
        </Tarjeta>
      ) : null}
      <AccionesPedido
        pedido={pedido}
        soloLectura={soloLectura}
        enviando={p.accion.enviando}
        onAvanzar={avanzar}
        onCancelar={() => setHoja('cancelar')}
      />
      <HojaCancelar
        abierta={hoja === 'cancelar'}
        pedido={pedido}
        onCerrar={cerrar}
        onCancelar={(m, d) => (p.cancelar(m, d), cerrar())}
      />
      <HojaCobroResto
        abierta={hoja === 'cobro'}
        resto={resto}
        onCerrar={cerrar}
        onConfirmar={(medio) => (p.cambiarEstado('entregado', medio), cerrar())}
      />
    </Pagina>
  );
}
