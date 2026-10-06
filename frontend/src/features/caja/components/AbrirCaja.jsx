import { useState } from 'react';
import { aCentavos } from '../../../shared/lib/plata.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import css from './AbrirCaja.module.css';

// Apertura con el efectivo inicial (una caja por día, 6.4).
export function AbrirCaja({ onAbrir, deshabilitado }) {
  const [monto, setMonto] = useState('');
  const [error, setError] = useState('');
  function abrir(e) {
    e.preventDefault();
    const c = aCentavos(monto || '0');
    if (c === null) return setError('Escribí el efectivo con el que arrancás.');
    onAbrir(c);
  }
  return (
    <Tarjeta as="form" onSubmit={abrir} className={css.tarjeta} noValidate>
      <h2 className={css.titulo}>Abrí la caja de hoy</h2>
      <p className={css.texto}>
        Para registrar efectivo. Las transferencias entran igual.
      </p>
      <Campo etiqueta="Efectivo inicial (cambio en el cajón)" error={error}>
        {(c) => (
          <Entrada
            c={c}
            prefijo="$"
            inputMode="decimal"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        )}
      </Campo>
      <Boton
        type="submit"
        variante="principal"
        tamano="lg"
        anchoCompleto
        disabled={deshabilitado}
      >
        Abrir caja
      </Boton>
    </Tarjeta>
  );
}
