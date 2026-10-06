import { Link } from 'react-router';
import css from '../pantallas/Cuenta.module.css';

// Aceptación de términos y privacidad (obligatoria para registrarse).
export function AceptarTerminos({ valor, onCambio, error }) {
  return (
    <>
      <label className={css.check}>
        <input
          type="checkbox"
          checked={valor}
          onChange={(e) => onCambio(e.target.checked)}
        />
        <span>
          Acepto los <Link to="/legal">términos y la política de privacidad</Link>.
        </span>
      </label>
      {error ? (
        <p className={css.error} role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
