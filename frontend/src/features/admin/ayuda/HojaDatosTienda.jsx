import { useState } from 'react';
import { DOMINIO_BASE } from '../../../shared/lib/zonaActual.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { cambios } from './useAyuda.js';

// Corregir nombre, link o WhatsApp de la tienda (un link mal escrito al registrarse).
export function HojaDatosTienda({ abierta, onCerrar, tienda, accion }) {
  const viejo = {
    nombre: tienda.nombre,
    slug: tienda.slug,
    whatsapp: tienda.whatsapp ?? '',
  };
  const [d, setD] = useState(viejo);
  const set = (k) => (e) => setD({ ...d, [k]: e.target.value });
  const guardar = async () => {
    const c = cambios(d, viejo);
    if (c.whatsapp === '') c.whatsapp = null; // borrarlo
    if ((await accion.ejecutar(c)).ok) onCerrar();
  };
  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Datos de la tienda">
      <AvisoError error={accion.error} />
      <Campo etiqueta="Nombre del negocio" error={accion.campos.nombre}>
        {(c) => <Entrada c={c} value={d.nombre} onChange={set('nombre')} />}
      </Campo>
      <Campo
        etiqueta="Link"
        error={accion.campos.slug}
        ayuda={`${d.slug}.${DOMINIO_BASE}`}
      >
        {(c) => <Entrada c={c} value={d.slug} onChange={set('slug')} />}
      </Campo>
      {d.slug !== viejo.slug ? (
        <Aviso tipo="alerta" titulo="El link viejo va a dejar de andar">
          Avisale al dueño para que comparta el nuevo.
        </Aviso>
      ) : null}
      <Campo etiqueta="WhatsApp" error={accion.campos.whatsapp}>
        {(c) => (
          <Entrada c={c} inputMode="tel" value={d.whatsapp} onChange={set('whatsapp')} />
        )}
      </Campo>
      <Boton
        variante="principal"
        tamano="lg"
        anchoCompleto
        cargando={accion.enviando}
        textoCargando="Guardando…"
        disabled={!Object.keys(cambios(d, viejo)).length}
        onClick={guardar}
      >
        Guardar cambios
      </Boton>
    </Hoja>
  );
}
