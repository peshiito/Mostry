import { useState } from 'react';
import { useParams } from 'react-router';
import { DOMINIO_BASE } from '../../../shared/lib/zonaActual.js';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { EsqueletoDetalle } from '../../../shared/ui/esqueletos/index.js';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { NoEncontrada } from '../../../shared/ui/NoEncontrada.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { ModalesTienda } from '../components/ModalesTienda.jsx';
import { TarjetaAyuda } from '../ayuda/TarjetaAyuda.jsx';
import { TarjetaSoporte } from '../components/TarjetaSoporte.jsx';
import { TarjetasDetalle } from '../components/TarjetasDetalle.jsx';
import { ESTADOS_TIENDA } from '../estados.js';
import { useTiendaAdmin } from '../hooks/useTiendasAdmin.js';
import css from './PantallaTiendaAdmin.module.css';

// Detalle de una tienda: registrar pago, regalar días, suspender o reactivar (Stitch 55 a 57).
export function PantallaTiendaAdmin() {
  const { id } = useParams();
  const a = useTiendaAdmin(id);
  const [modal, setModal] = useState(null);
  if (a.cargando && !a.tienda) return <EsqueletoDetalle />;
  if (!a.tienda) return <NoEncontrada zona="admin" consulta={a} />;
  const t = a.tienda;
  const est = ESTADOS_TIENDA[t.estado];
  const cerrar = () => setModal(null);
  const acciones = (
    <div className={css.acciones}>
      <Boton onClick={() => setModal('suspender')}>
        {t.estado === 'suspendida' ? 'Reactivar' : 'Suspender'}
      </Boton>
      <Boton icono="redeem" onClick={() => setModal('cortesia')}>
        Regalar días
      </Boton>
      <Boton variante="principal" icono="payments" onClick={() => setModal('pago')}>
        Registrar pago
      </Boton>
    </div>
  );
  return (
    <Pagina ancho="completo">
      <TituloPagina
        migas={`Tiendas · ${t.slug}.${DOMINIO_BASE}`}
        titulo={t.nombre}
        etiqueta={<Etiqueta tono={est.tono}>{est.texto}</Etiqueta>}
        accion={acciones}
      />
      <AvisoError error={a.accion.error} />
      <TarjetasDetalle tienda={t} />
      <TarjetaSoporte tienda={t} />
      <TarjetaAyuda tienda={t} recargar={a.recargar} />
      <ModalesTienda modal={modal} onCerrar={cerrar} tienda={t} acciones={a} />
    </Pagina>
  );
}
