import { useState } from 'react';
import { Link } from 'react-router';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { useSuscripcion } from '../../suscripcion/hooks/useSuscripcion.js';
import { AbrirCaja } from '../components/AbrirCaja.jsx';
import { AccionesCaja } from '../components/AccionesCaja.jsx';
import { HojaMovimiento } from '../components/HojaMovimiento.jsx';
import { ListaMovimientos } from '../components/ListaMovimientos.jsx';
import { TarjetaEfectivo } from '../components/TarjetaEfectivo.jsx';
import { useCaja } from '../hooks/useCaja.js';

const hoy = () =>
  new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

// Caja del día (Stitch 34 y 35).
export function PantallaCaja() {
  const { caja, esperado, abrir, registrar, cargando, accion } = useCaja();
  const { soloLectura } = useSuscripcion();
  const [tipo, setTipo] = useState(null);
  if (cargando) return <Esqueleto filas={4} alto={96} />;
  return (
    <Pagina>
      <TituloPagina
        titulo="Caja"
        bajada={hoy()}
        accion={<Link to="/panel/caja/resumen">Resumen</Link>}
      />
      <AvisoError error={accion.error} />
      {caja.cerrada ? (
        <Aviso tipo="ok" titulo="La caja de hoy ya está cerrada">
          Las transferencias que lleguen se registran igual.
        </Aviso>
      ) : caja.abierta ? (
        <>
          <TarjetaEfectivo caja={caja} esperado={esperado} />
          <AccionesCaja onElegir={setTipo} deshabilitado={soloLectura} />
        </>
      ) : (
        <AbrirCaja onAbrir={abrir} deshabilitado={soloLectura} />
      )}
      <Seccion titulo={caja.abierta ? 'Movimientos de hoy' : 'Transferencias de hoy'}>
        <ListaMovimientos movimientos={caja.movimientos} />
      </Seccion>
      {caja.abierta && !soloLectura ? (
        <Boton variante="principal" tamano="lg" anchoCompleto to="/panel/caja/cerrar">
          Cerrar caja
        </Boton>
      ) : null}
      <HojaMovimiento
        key={tipo}
        tipo={tipo}
        onCerrar={() => setTipo(null)}
        onGuardar={async (m) => {
          if ((await registrar(m)).ok) setTipo(null);
        }}
      />
    </Pagina>
  );
}
