import { useNavigate } from 'react-router';
import { HojaClave } from './HojaClave.jsx';
import { HojaDatosTienda } from './HojaDatosTienda.jsx';
import { HojaDueno } from './HojaDueno.jsx';
import { HojaEliminar } from './HojaEliminar.jsx';

// Las hojas de la tarjeta "Ayudar con la cuenta" (una abierta a la vez).
export function HojasAyuda({ hoja, onCerrar, tienda, a }) {
  const navegar = useNavigate();
  return (
    <>
      <HojaDueno
        abierta={hoja === 'dueno'}
        onCerrar={onCerrar}
        tienda={tienda}
        accion={a.dueno}
      />
      <HojaDatosTienda
        abierta={hoja === 'datos'}
        onCerrar={onCerrar}
        tienda={tienda}
        accion={a.datos}
      />
      <HojaClave
        abierta={hoja === 'clave'}
        onCerrar={onCerrar}
        tienda={tienda}
        clave={a.clave}
        mail={a.mail}
      />
      <HojaEliminar
        abierta={hoja === 'eliminar'}
        onCerrar={onCerrar}
        tienda={tienda}
        accion={a.eliminar}
        onEliminada={() => navegar('/', { replace: true })}
      />
    </>
  );
}
