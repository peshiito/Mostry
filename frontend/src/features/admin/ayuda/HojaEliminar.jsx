import { useState } from 'react';
import { DOMINIO_BASE } from '../../../shared/lib/zonaActual.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { CampoClave } from '../../cuenta/components/CampoClave.jsx';

// Eliminar para siempre (solo suspendidas o registros sin verificar). Hay que
// escribir el link y la contraseña del admin: nunca por un toque sin querer.
export function HojaEliminar({ abierta, onCerrar, tienda, accion, onEliminada }) {
  const [slug, setSlug] = useState('');
  const [clave, setClave] = useState('');
  const listo = slug.trim().toLowerCase() === tienda.slug && clave.length > 0;
  async function eliminar() {
    const r = await accion.ejecutar({
      slugConfirmado: slug.trim().toLowerCase(),
      claveAdmin: clave,
    });
    if (r.ok) onEliminada();
  }
  return (
    <Hoja
      abierta={abierta}
      onCerrar={onCerrar}
      titulo="Eliminar tienda"
      subtitulo={tienda.nombre}
    >
      <Aviso tipo="error" titulo="No se puede deshacer">
        Se borran productos, fotos, pedidos, comprobantes, caja, gastos y fiados, y la
        cuenta del dueño si no tiene otra tienda. El email y el link quedan libres. Queda
        solo un resumen con lo que te pagó.
      </Aviso>
      <AvisoError error={accion.error} />
      <Campo
        etiqueta={`Escribí el link: ${tienda.slug}`}
        ayuda={`${tienda.slug}.${DOMINIO_BASE}`}
      >
        {(c) => (
          <Entrada
            c={c}
            autoComplete="off"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        )}
      </Campo>
      <CampoClave etiqueta="Tu contraseña de admin" valor={clave} onCambio={setClave} />
      <Boton
        variante="peligro"
        tamano="lg"
        anchoCompleto
        icono="delete"
        disabled={!listo}
        cargando={accion.enviando}
        textoCargando="Eliminando…"
        onClick={eliminar}
      >
        Eliminar para siempre
      </Boton>
    </Hoja>
  );
}
