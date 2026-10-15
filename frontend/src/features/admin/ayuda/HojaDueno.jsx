import { useState } from 'react';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { cambios } from './useAyuda.js';

// Corregir el email o el nombre del dueño (por ejemplo, se equivocó al
// registrarse). El email nuevo queda verificado y se cierran sus sesiones.
export function HojaDueno({ abierta, onCerrar, tienda, accion }) {
  const viejo = { email: tienda.email, nombre: tienda.duena };
  const [d, setD] = useState(viejo);
  const set = (k) => (e) => setD({ ...d, [k]: e.target.value });
  const guardar = async () => (await accion.ejecutar(cambios(d, viejo))).ok && onCerrar();
  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Email y nombre del dueño">
      <AvisoError error={accion.error} />
      <Campo
        etiqueta="Email"
        error={accion.campos.email}
        ayuda="Se cierran sus sesiones abiertas."
      >
        {(c) => <Entrada c={c} type="email" value={d.email} onChange={set('email')} />}
      </Campo>
      <Campo etiqueta="Nombre" error={accion.campos.nombre}>
        {(c) => <Entrada c={c} value={d.nombre} onChange={set('nombre')} />}
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
