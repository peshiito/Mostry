import { useState } from 'react';
import { useAccion } from '../../shared/api/useAccion.js';
import { Aviso } from '../../shared/ui/Aviso.jsx';
import { AvisoError } from '../../shared/ui/AvisoError.jsx';
import { Boton } from '../../shared/ui/Boton.jsx';
import { Hoja } from '../../shared/ui/Hoja.jsx';
import { cuentaApi } from '../cuenta/api/cuenta.js';
import { CampoClave } from '../cuenta/components/CampoClave.jsx';

// Cambiar la contraseña: pide la actual (acción sensible).
export function HojaCambiarClave({ abierta, onCerrar }) {
  const [d, setD] = useState({ claveActual: '', claveNueva: '' });
  const accion = useAccion(cuentaApi.cambiarClave, { exito: 'Contraseña cambiada' });
  const [listo, setListo] = useState(false);
  const enviar = async () => setListo((await accion.ejecutar(d)).ok);
  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Cambiar contraseña">
      {listo ? (
        <Aviso tipo="ok" titulo="Listo. Cerramos tus otras sesiones." />
      ) : (
        <>
          <AvisoError error={accion.error} />
          <CampoClave
            etiqueta="Contraseña actual"
            valor={d.claveActual}
            onCambio={(v) => setD({ ...d, claveActual: v })}
          />
          <CampoClave
            etiqueta="Contraseña nueva"
            nueva
            valor={d.claveNueva}
            onCambio={(v) => setD({ ...d, claveNueva: v })}
          />
          <Boton
            variante="principal"
            tamano="lg"
            anchoCompleto
            cargando={accion.enviando}
            onClick={enviar}
          >
            Guardar contraseña
          </Boton>
        </>
      )}
    </Hoja>
  );
}
