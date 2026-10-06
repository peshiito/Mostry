import { useState } from 'react';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';

// Alta de proveedor: nombre y un contacto libre (persona, teléfono, días de reparto).
export function HojaProveedor({ abierta, onCerrar, accion }) {
  const [d, setD] = useState({ nombre: '', contacto: '' });
  async function guardar() {
    if (d.nombre.trim().length < 2) return;
    if ((await accion.ejecutar(d)).ok) {
      setD({ nombre: '', contacto: '' });
      onCerrar();
    }
  }
  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Nuevo proveedor">
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
      <Campo etiqueta="Contacto (opcional)">
        {(c) => (
          <Entrada
            c={c}
            value={d.contacto}
            placeholder="Juan · 11 4444-2222"
            onChange={(e) => setD({ ...d, contacto: e.target.value })}
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
        Guardar proveedor
      </Boton>
    </Hoja>
  );
}
