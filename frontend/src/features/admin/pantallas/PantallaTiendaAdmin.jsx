import { useState } from 'react';
import { useParams } from 'react-router';
import { DOMINIO_BASE } from '../../../shared/lib/zonaActual.js';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { NoEncontrada } from '../../../shared/ui/NoEncontrada.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { ModalPago } from '../components/ModalPago.jsx';
import { ModalSuspender } from '../components/ModalSuspender.jsx';
import { TarjetaSoporte } from '../components/TarjetaSoporte.jsx';
import { TarjetasDetalle } from '../components/TarjetasDetalle.jsx';
import { ESTADOS_TIENDA } from '../estados.js';
import { useTiendaAdmin } from '../hooks/useTiendasAdmin.js';
import css from './PantallaTiendaAdmin.module.css';

// Detalle de una tienda: registrar pago, suspender o reactivar (Stitch 55 a 57).
export function PantallaTiendaAdmin() {
  const { id } = useParams();
  const a = useTiendaAdmin(id);
  const [modal, setModal] = useState(null);
  if (a.cargando && !a.tienda) return <Esqueleto filas={3} alto={140} />;
  if (!a.tienda) return <NoEncontrada />;
  const t = a.tienda;
  const est = ESTADOS_TIENDA[t.estado];
  const cerrar = () => setModal(null);
  const hecho = async (r) => (await r).ok && cerrar();
  const acciones = (
    <div className={css.acciones}>
      <Boton onClick={() => setModal('suspender')}>
        {t.estado === 'suspendida' ? 'Reactivar' : 'Suspender'}
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
      <ModalPago
        abierta={modal === 'pago'}
        tienda={t}
        onCerrar={cerrar}
        onRegistrar={(d) => hecho(a.registrarPago(d))}
      />
      <ModalSuspender
        abierta={modal === 'suspender'}
        tienda={t}
        onCerrar={cerrar}
        onConfirmar={(motivo) =>
          hecho(t.estado === 'suspendida' ? a.reactivar() : a.suspender(motivo))
        }
      />
    </Pagina>
  );
}
