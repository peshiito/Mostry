import { useState } from 'react';
import { Link } from 'react-router';
import { hoyLargo } from '../../../shared/lib/fechas.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { EsqueletoResumen } from '../../../shared/ui/esqueletos/index.js';
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

// Caja del día (Stitch 34 y 35).
export function PantallaCaja() {
  const { caja, accion, ...c } = useCaja();
  const { soloLectura } = useSuscripcion();
  const [tipo, setTipo] = useState(null);
  if (c.cargando) return <EsqueletoResumen />;
  if (c.errorCarga)
    return <ErrorCarga error={c.errorCarga} que="la caja" onReintentar={c.recargar} />;
  return (
    <Pagina>
      <TituloPagina
        titulo="Caja"
        bajada={hoyLargo()}
        accion={<Link to="/panel/caja/resumen">Resumen</Link>}
      />
      <AvisoError error={accion.error} />
      {caja.cerrada ? (
        <Aviso tipo="ok" titulo="La caja de hoy ya está cerrada">
          Las transferencias que lleguen se registran igual.
        </Aviso>
      ) : caja.abierta ? (
        <>
          <TarjetaEfectivo caja={caja} esperado={c.esperado} />
          <AccionesCaja onElegir={setTipo} deshabilitado={soloLectura} />
        </>
      ) : (
        <AbrirCaja onAbrir={c.abrir} deshabilitado={soloLectura} />
      )}
      <Seccion
        titulo={
          caja.abierta || caja.cerrada ? 'Movimientos de hoy' : 'Transferencias de hoy'
        }
      >
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
          if ((await c.registrar(m)).ok) setTipo(null);
        }}
      />
    </Pagina>
  );
}
