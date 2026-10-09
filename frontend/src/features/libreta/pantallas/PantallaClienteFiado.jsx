import { linkWhatsapp } from '../../../shared/lib/linkSeguro.js';
import { useState } from 'react';
import { useParams } from 'react-router';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { CargaCliente } from '../components/CargaCliente.jsx';
import { HistorialFiado } from '../components/HistorialFiado.jsx';
import { HojaFiado } from '../components/HojaFiado.jsx';
import { useClienteFiado } from '../hooks/useLibreta.js';
import css from './PantallaClienteFiado.module.css';

// Ficha de un cliente de la libreta (Stitch 43).
export function PantallaClienteFiado() {
  const { id } = useParams();
  const { cliente, movimientos, saldo, anotar, cargando, error, recargar } =
    useClienteFiado(id);
  const [tipo, setTipo] = useState(null);
  if (cargando || !cliente) return <CargaCliente error={error} onReintentar={recargar} />;
  return (
    <Pagina>
      <TituloPagina
        migas="Libreta"
        titulo={cliente.nombre}
        accion={
          <Boton
            tamano="sm"
            icono="chat"
            href={linkWhatsapp(cliente.telefono) ?? undefined}
          >
            WhatsApp
          </Boton>
        }
      />
      <Tarjeta className={css.saldo}>
        <span>{saldo > 0 ? 'Debe' : 'Al día'}</span>
        <Monto
          centavos={Math.max(saldo, 0)}
          tamano="xl"
          tono={saldo > 0 ? 'ladrillo' : 'ok'}
        />
      </Tarjeta>
      <div className={css.acciones}>
        <Boton icono="add" onClick={() => setTipo('deuda')} disabled={!cliente.activo}>
          Anotar deuda
        </Boton>
        <Boton variante="principal" onClick={() => setTipo('pago')}>
          Registrar pago
        </Boton>
      </div>
      <AvisoError error={anotar.error} />
      <Seccion titulo="Historial">
        <HistorialFiado movimientos={movimientos} />
      </Seccion>
      <HojaFiado
        key={tipo}
        tipo={tipo}
        onCerrar={() => setTipo(null)}
        onGuardar={async (m) => {
          if ((await anotar.ejecutar(m)).ok) setTipo(null);
        }}
      />
    </Pagina>
  );
}
