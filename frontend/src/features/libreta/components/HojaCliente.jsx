import { useState } from 'react';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';

// Alta de cliente de la libreta: nombre y teléfono (opcional).
export function HojaCliente({ abierta, onCerrar, accion }) {
  const [d, setD] = useState({ nombre: '', telefono: '' });
  async function guardar() {
    if (d.nombre.trim().length < 2) return;
    if ((await accion.ejecutar(d)).ok) {
      setD({ nombre: '', telefono: '' });
      onCerrar();
    }
  }
  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Nuevo cliente">
      <AvisoError error={accion.error} />
      <Campo etiqueta="Nombre">
        {(c) => (
          <Entrada
            c={c}
            value={d.nombre}
            onChange={(e) => setD({ ...d, nombre: e.target.value })}
          />
        )}
      </Campo>
      <Campo etiqueta="Teléfono (opcional)">
        {(c) => (
          <Entrada
            c={c}
            type="tel"
            prefijo="+54"
            value={d.telefono}
            onChange={(e) => setD({ ...d, telefono: e.target.value })}
          />
        )}
      </Campo>
      <Boton
        variante="principal"
        tamano="lg"
        anchoCompleto
        cargando={accion.enviando}
        onClick={guardar}
      >
        Guardar cliente
      </Boton>
    </Hoja>
  );
}
