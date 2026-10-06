import { useRef } from 'react';
import css from './CodigoDigitos.module.css';

// 6 casillas con autoavance y pegado del código completo.
export function CodigoDigitos({
  valor,
  onCambio,
  etiqueta = 'Código de 6 dígitos',
  error,
}) {
  const refs = useRef([]);
  const digitos = valor.padEnd(6, ' ').slice(0, 6).split('');
  function cambiar(i, texto) {
    const solo = texto.replace(/\D/g, '');
    if (solo.length > 1) {
      onCambio(solo.slice(0, 6));
      refs.current[Math.min(solo.length, 5)]?.focus();
      return;
    }
    const nuevo = digitos.map((d, k) => (k === i ? solo || ' ' : d)).join('');
    onCambio(nuevo.trimEnd());
    if (solo && i < 5) refs.current[i + 1]?.focus();
  }
  function tecla(i, e) {
    if (e.key === 'Backspace' && digitos[i] === ' ' && i > 0)
      refs.current[i - 1]?.focus();
  }
  return (
    <fieldset className={css.grupo}>
      <legend className={css.leyenda}>{etiqueta}</legend>
      <div className={css.casillas}>
        {digitos.map((d, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            className={`${css.casilla} ${error ? css.error : ''}`}
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            aria-label={`Dígito ${i + 1}`}
            value={d.trim()}
            onChange={(e) => cambiar(i, e.target.value)}
            onKeyDown={(e) => tecla(i, e)}
          />
        ))}
      </div>
      {error ? (
        <p className={css.mensaje} role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
