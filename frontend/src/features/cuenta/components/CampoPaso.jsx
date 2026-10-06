import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { CodigoDigitos } from '../../../shared/ui/CodigoDigitos.jsx';
import { CampoClave } from './CampoClave.jsx';

// El campo que corresponde a cada paso de la recuperación.
export function CampoPaso({ paso, valor, onCambio }) {
  if (paso === 1)
    return (
      <Campo etiqueta="Email de tu cuenta">
        {(c) => (
          <Entrada
            c={c}
            type="email"
            autoComplete="email"
            value={valor}
            onChange={(e) => onCambio(e.target.value)}
          />
        )}
      </Campo>
    );
  if (paso === 2)
    return (
      <>
        <p>Si el email está registrado, te llegó un código de 6 dígitos.</p>
        <CodigoDigitos valor={valor} onCambio={onCambio} />
      </>
    );
  return (
    <CampoClave etiqueta="Nueva contraseña" nueva valor={valor} onCambio={onCambio} />
  );
}
