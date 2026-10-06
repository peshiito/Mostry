import { Navigate } from 'react-router';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { HeaderTienda } from '../../tienda/components/HeaderTienda.jsx';
import { useTienda } from '../../tienda/hooks/useTienda.js';
import { DatosComprador } from '../components/DatosComprador.jsx';
import { OpcionesEntrega } from '../components/OpcionesEntrega.jsx';
import { ResumenCompra } from '../components/ResumenCompra.jsx';
import { useCheckout } from '../hooks/useCheckout.js';

// Checkout en un solo scroll (Stitch 16).
export function PantallaCheckout() {
  const { tienda, estado } = useTienda();
  const c = useCheckout(tienda, estado);
  if (!c.items.length) return <Navigate to="/carrito" replace />;
  return (
    <>
      <HeaderTienda volver="/carrito" titulo="Completá tu pedido" />
      <Pagina as="form" onSubmit={c.confirmar} noValidate>
        <TituloPagina
          titulo="Completá tu pedido"
          bajada="Revisá tus datos y cómo lo recibís."
        />
        <AvisoError error={c.error} />
        <DatosComprador datos={c.datos} errores={c.errores} onCambio={c.setDatos} />
        <OpcionesEntrega
          tienda={tienda}
          entrega={c.entrega}
          onEntrega={c.setEntrega}
          datos={c.datos}
          errores={c.errores}
          onCambio={c.setDatos}
        />
        <ResumenCompra
          items={c.items}
          costoEnvio={c.entrega === 'envio' ? tienda.costoEnvio : 0}
        />
        {c.encargo ? null : (
          <Aviso tipo="alerta" icono="schedule">
            Después de confirmar te mostramos los datos para transferir y el plazo para
            mandar el comprobante.
          </Aviso>
        )}
        <Boton
          type="submit"
          variante="principal"
          tamano="lg"
          anchoCompleto
          cargando={c.enviando}
        >
          {c.encargo ? 'Elegir día y hora' : 'Confirmar pedido'}
        </Boton>
      </Pagina>
    </>
  );
}
