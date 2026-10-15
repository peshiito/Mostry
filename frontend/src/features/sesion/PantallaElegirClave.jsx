import { useState } from 'react';
import { useAccion } from '../../shared/api/useAccion.js';
import { AvisoError } from '../../shared/ui/AvisoError.jsx';
import { Boton } from '../../shared/ui/Boton.jsx';
import { TituloPagina } from '../../shared/ui/TituloPagina.jsx';
import { cuentaApi } from '../cuenta/api/cuenta.js';
import { CampoClave } from '../cuenta/components/CampoClave.jsx';
import { LayoutCuenta } from '../cuenta/components/LayoutCuenta.jsx';
import css from '../cuenta/pantallas/Cuenta.module.css';

// Entró con la clave temporal que le mandó Mostry: antes de usar el panel elige
// una contraseña nueva (la API tampoco deja hacer otra cosa hasta entonces).
export function PantallaElegirClave({ alTerminar }) {
  const [d, setD] = useState({ claveActual: '', claveNueva: '' });
  const accion = useAccion(cuentaApi.cambiarClave, {
    exito: 'Listo, ya tenés tu contraseña',
  });
  async function guardar(e) {
    e.preventDefault();
    if ((await accion.ejecutar(d)).ok) alTerminar();
  }
  return (
    <LayoutCuenta>
      <TituloPagina
        titulo="Elegí tu contraseña"
        bajada="Entraste con una clave temporal. Elegí una nueva para seguir."
      />
      <form className={css.form} onSubmit={guardar} noValidate>
        <AvisoError error={accion.error} />
        <CampoClave
          etiqueta="Clave temporal"
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
          type="submit"
          variante="principal"
          tamano="lg"
          anchoCompleto
          cargando={accion.enviando}
          textoCargando="Guardando…"
        >
          Guardar y entrar
        </Boton>
      </form>
    </LayoutCuenta>
  );
}
