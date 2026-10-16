import { useState } from 'react';
import { Navigate, useLocation } from 'react-router';
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
import { faltaPersonalizar, Personalizar } from '../components/Personalizar.jsx';
import { useConfirmarEncargo } from '../hooks/useConfirmarEncargo.js';
import { cuerpoEncargo } from '../lib/cuerpoEncargo.js';
import { anticipacionDe } from '../lib/anticipacion.js';

// Día y hora del encargo + seña (Stitch 17, sección 6.2).
export function PantallaEncargo() {
  const { state } = useLocation();
  const { tienda } = useTienda();
  const { items, subtotal } = useCarrito();
  const pedido = useConfirmarEncargo();
  const [turno, setTurno] = useState(null);
  const [personal, setPersonal] = useState({});
  if (!state || !items.length) return <Navigate to="/checkout" replace />;
  const horas = anticipacionDe(tienda, items);
  const sena = Math.round((subtotal * tienda.senaPorcentaje) / 100);
  const confirmar = () =>
    pedido.confirmar(cuerpoEncargo({ state, items, tienda, turno, personal }), personal);
  return (
    <>
      <HeaderTienda volver="/checkout" titulo="Encargo" />
      <Pagina>
        <Pasos pasos={['Datos', 'Día y hora', 'Seña']} actual={2} />
        <TituloPagina
          titulo="¿Para cuándo lo querés?"
          bajada={`Con ${horas} h de anticipación como mínimo.`}
        />
        <AvisoError error={pedido.error} />
        <ElegirTurno
          tienda={tienda}
          anticipacion={horas}
          productos={items.map((i) => i.id)}
          turno={turno}
          onTurno={setTurno}
        />
        <Personalizar items={items} valores={personal} onCambio={setPersonal} />
        <SenaEncargo sena={sena} total={subtotal} porcentaje={tienda.senaPorcentaje} />
        <Boton
          variante="principal"
          tamano="lg"
          anchoCompleto
          disabled={!turno || faltaPersonalizar(items, personal)}
          cargando={pedido.enviando}
          textoCargando="Confirmando…"
          onClick={confirmar}
        >
          Confirmar encargo
        </Boton>
      </Pagina>
    </>
  );
}
