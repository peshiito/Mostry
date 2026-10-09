import { useId } from 'react';
import { Link } from 'react-router';
import css from '../pantallas/Cuenta.module.css';

// Aceptación de términos y privacidad (obligatoria para registrarse).
export function AceptarTerminos({ valor, onCambio, error }) {
  const idError = useId();
  return (
    <>
      <label className={css.check}>
        <input
          type="checkbox"
          checked={valor}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? idError : undefined}
          onChange={(e) => onCambio(e.target.checked)}
        />
        <span>
          Acepto los <Link to="/legal">términos y la política de privacidad</Link>.
        </span>
      </label>
      {error ? (
        <p id={idError} className={css.error} role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
