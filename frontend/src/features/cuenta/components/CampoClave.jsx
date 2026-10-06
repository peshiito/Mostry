import { useState } from 'react';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { FuerzaClave } from './FuerzaClave.jsx';

// Contraseña con botón para mostrarla. `nueva` muestra la barra de seguridad.
export function CampoClave({
  etiqueta = 'Contraseña',
  valor,
  onCambio,
  error,
  nueva,
  extra,
}) {
  const [ver, setVer] = useState(false);
  return (
    <Campo etiqueta={etiqueta} error={error} extra={extra}>
      {(c) => (
        <>
          <Entrada
            c={c}
            type={ver ? 'text' : 'password'}
            autoComplete={nueva ? 'new-password' : 'current-password'}
            value={valor}
            onChange={(e) => onCambio(e.target.value)}
            sufijo={
              <BotonIcono
                icono={ver ? 'visibility_off' : 'visibility'}
                etiqueta={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setVer(!ver)}
              />
            }
          />
          {nueva ? <FuerzaClave clave={valor} /> : null}
        </>
      )}
    </Campo>
  );
}
