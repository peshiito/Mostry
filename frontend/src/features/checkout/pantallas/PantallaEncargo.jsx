import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Pasos } from '../../../shared/ui/Pasos.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { useCarrito } from '../../carrito/useCarrito.js';
import { HeaderTienda } from '../../tienda/components/HeaderTienda.jsx';
import { useTienda } from '../../tienda/hooks/useTienda.js';
import { ElegirTurno } from '../components/ElegirTurno.jsx';
import { SenaEncargo } from '../components/SenaEncargo.jsx';
import { armarPedido, useCrearPedido } from '../hooks/useCrearPedido.js';

// Día y hora del encargo + seña (Stitch 17, sección 6.2).
export function PantallaEncargo() {
  const { state } = useLocation();
  const { tienda } = useTienda();
  const { items, subtotal } = useCarrito();
  const pedido = useCrearPedido();
  const navegar = useNavigate();
  const [turno, setTurno] = useState(null);
  if (!state || !items.length) return <Navigate to="/checkout" replace />;
  const sena = Math.round((subtotal * tienda.senaPorcentaje) / 100);
  async function confirmar() {
    const cuerpo = armarPedido({
      ...state,
      items,
      costoEnvio: tienda.costoEnvio,
      fechaEncargo: turno.toISOString(),
    });
    const r = await pedido.crear(cuerpo);
    if (!r.ok) return;
    navegar(
      r.datos.estado === 'pendiente_pago'
        ? `/pedido/${r.datos.token}/pago`
        : `/pedido/${r.datos.token}`,
      { state: { recienCreado: true } },
    );
  }
  return (
    <>
      <HeaderTienda volver="/checkout" titulo="Encargo" />
      <Pagina>
        <Pasos pasos={['Datos', 'Día y hora', 'Seña']} actual={2} />
        <TituloPagina
          titulo="¿Para cuándo lo querés?"
          bajada={`Con ${tienda.anticipacionEncargoHoras} h de anticipación como mínimo.`}
        />
        <AvisoError error={pedido.error} />
        <ElegirTurno tienda={tienda} turno={turno} onTurno={setTurno} />
        <SenaEncargo sena={sena} total={subtotal} porcentaje={tienda.senaPorcentaje} />
        <Boton
          variante="principal"
          tamano="lg"
          anchoCompleto
          disabled={!turno}
          cargando={pedido.enviando}
          onClick={confirmar}
        >
          Confirmar encargo
        </Boton>
      </Pagina>
    </>
  );
}
