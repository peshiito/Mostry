import { useState } from 'react';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import css from './Ayuda.module.css';
import { HojasAyuda } from './HojasAyuda.jsx';
import { useAyuda } from './useAyuda.js';

// Ayudar al dueño cuando se trabó (email, link, contraseña) y, si la tienda está
// suspendida o nunca verificó su email, eliminarla (Mejoras 4).
export function TarjetaAyuda({ tienda: t, recargar }) {
  const [hoja, setHoja] = useState(null);
  const a = useAyuda(t.id, recargar);
  const cerrar = () => setHoja(null);
  const eliminable = t.estado === 'suspendida' || !t.verificado;
  const abrir = (h) => () => setHoja(h);
  return (
    <Tarjeta>
      <h2>Ayudar con la cuenta</h2>
      <p className={css.texto}>
        Para cuando se equivocó al registrarse, cambió de email o no puede entrar. Todo
        queda anotado.
      </p>
      <div className={css.acciones}>
        <Boton icono="person" onClick={abrir('dueno')}>
          Email o nombre del dueño
        </Boton>
        <Boton icono="storefront" onClick={abrir('datos')}>
          Corregir datos de la tienda
        </Boton>
        <Boton icono="key" onClick={abrir('clave')}>
          Problemas con la contraseña
        </Boton>
      </div>
      {eliminable ? (
        <div className={css.peligro}>
          <p className={css.texto}>
            {t.verificado
              ? 'Está suspendida: si no regulariza, la podés eliminar.'
              : 'Nunca verificó su email: el registro quedó a medias.'}
          </p>
          <Boton variante="peligro" icono="delete" onClick={abrir('eliminar')}>
            Eliminar tienda
          </Boton>
        </div>
      ) : null}
      <HojasAyuda hoja={hoja} onCerrar={cerrar} tienda={t} a={a} />
    </Tarjeta>
  );
}
