import { useState } from 'react';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import css from '../../cuenta/pantallas/Cuenta.module.css';
import { CamposCliente } from '../components/CamposCliente.jsx';
import { HojaBorrarCuenta } from '../components/HojaBorrarCuenta.jsx';
import { useMisDatos } from '../hooks/useMisDatos.js';

// Mis datos: lo que ven las tiendas donde compra (nombre y WhatsApp), y la cuenta.
export function PantallaMisDatos() {
  const d = useMisDatos();
  const [borrando, setBorrando] = useState(false);
  return (
    <>
      <TituloPagina titulo="Mis datos" bajada={d.cliente.email} />
      <form className={css.form} onSubmit={d.alGuardar} noValidate>
        <AvisoError error={d.guardar.error} />
        <CamposCliente f={d.f} cambiar={d.cambiar} errores={d.guardar.campos} />
        <Boton
          type="submit"
          variante="principal"
          anchoCompleto
          cargando={d.guardar.enviando}
          textoCargando="Guardando…"
        >
          Guardar cambios
        </Boton>
      </form>
      <div className={css.links}>
        <Boton icono="logout" onClick={d.alSalir} cargando={d.salir.enviando}>
          Cerrar sesión
        </Boton>
        <Boton variante="texto" icono="delete" onClick={() => setBorrando(true)}>
          Borrar mi cuenta
        </Boton>
      </div>
      <HojaBorrarCuenta
        abierta={borrando}
        onCerrar={() => setBorrando(false)}
        accion={d.borrar}
        onBorrar={d.alBorrar}
      />
    </>
  );
}
