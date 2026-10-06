import { useState } from 'react';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { CampoClave } from '../../cuenta/components/CampoClave.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';

// Cambiar el alias de cobro: acción sensible, pide la contraseña de nuevo.
export function HojaCambiarAlias({ abierta, onCerrar, actual, accion }) {
  const [alias, setAlias] = useState(actual.alias);
  const [titular, setTitular] = useState(actual.titularAlias);
  const [clave, setClave] = useState('');
  async function guardar() {
    const r = await accion.ejecutar({
      alias: alias.trim().toLowerCase(),
      titularAlias: titular.trim(),
      clave,
    });
    if (r.ok) onCerrar();
  }
  return (
    <Hoja
      abierta={abierta}
      onCerrar={onCerrar}
      titulo="Cambiar alias de cobro"
      subtitulo="Por seguridad, te pedimos tu contraseña."
    >
      <AvisoError error={accion.error} />
      <Campo etiqueta="Alias" error={accion.campos.alias}>
        {(c) => (
          <Entrada
            c={c}
            autoCapitalize="none"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
        )}
      </Campo>
      <Campo etiqueta="Titular de la cuenta" error={accion.campos.titularAlias}>
        {(c) => (
          <Entrada c={c} value={titular} onChange={(e) => setTitular(e.target.value)} />
        )}
      </Campo>
      <CampoClave etiqueta="Tu contraseña" valor={clave} onCambio={setClave} />
      <Boton
        variante="principal"
        tamano="lg"
        anchoCompleto
        disabled={!clave}
        cargando={accion.enviando}
        onClick={guardar}
      >
        Guardar alias
      </Boton>
    </Hoja>
  );
}
