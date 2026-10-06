import { useState } from 'react';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import css from '../pantallas/Cuenta.module.css';
import { CampoPaso } from './CampoPaso.jsx';

// Un paso de la recuperación. Los mensajes no revelan si la cuenta existe.
export function PasoRecuperar({ paso, onSeguir, enviando, base }) {
  const [valor, setValor] = useState('');
  if (paso === 4) {
    return (
      <Aviso
        tipo="ok"
        titulo="Listo, ya podés ingresar con tu nueva contraseña."
        accion={<Boton to={`${base}/ingresar`}>Ingresar</Boton>}
      />
    );
  }
  const enviar = (e) => {
    e.preventDefault();
    onSeguir(valor);
  };
  return (
    <form className={css.form} onSubmit={enviar} noValidate>
      <CampoPaso paso={paso} valor={valor} onCambio={setValor} />
      <Boton
        type="submit"
        variante="principal"
        tamano="lg"
        anchoCompleto
        iconoFin="arrow_forward"
        cargando={enviando}
        disabled={!valor}
      >
        {paso === 3 ? 'Guardar contraseña' : 'Seguir'}
      </Boton>
    </form>
  );
}
