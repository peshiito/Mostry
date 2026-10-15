import { useState } from 'react';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { CampoClave } from '../../cuenta/components/CampoClave.jsx';
import css from '../../cuenta/pantallas/Cuenta.module.css';

// Borrar la cuenta (Ley 25.326): explica qué se pierde y pide la clave.
export function HojaBorrarCuenta({ abierta, onCerrar, accion, onBorrar }) {
  const [clave, setClave] = useState('');
  const enviar = (e) => {
    e.preventDefault();
    onBorrar(clave);
  };
  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Borrar mi cuenta">
      <form className={css.form} onSubmit={enviar} noValidate>
        <p>
          Se borran tus datos y tus sellos en todas las tiendas. No se puede deshacer.
        </p>
        <AvisoError error={accion.error} />
        <CampoClave
          etiqueta="Tu clave, para confirmar"
          valor={clave}
          onCambio={setClave}
        />
        <Boton
          type="submit"
          variante="peligro"
          anchoCompleto
          disabled={!clave}
          cargando={accion.enviando}
          textoCargando="Borrando…"
        >
          Borrar para siempre
        </Boton>
      </form>
    </Hoja>
  );
}
