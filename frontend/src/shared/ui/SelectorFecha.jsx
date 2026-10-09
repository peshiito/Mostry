import { useState } from 'react';
import { Calendario } from './Calendario.jsx';
import { Hoja } from './Hoja.jsx';
import { Icono } from './Icono.jsx';
import css from './SelectorHora.module.css';

// 'YYYY-MM-DD' ↔ Date en hora local (sin corrimientos por zona horaria).
const aFecha = (v) => {
  if (!v) return null;
  const [anio, mes, dia] = v.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
};
const aTexto = (f) => f.toLocaleDateString('sv-SE');
const legible = (f) =>
  f.toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

// Elegir una fecha con el calendario de Mostry (en vez del del navegador).
// Va dentro de <Campo>: `c` conecta la etiqueta, la ayuda y el error.
export function SelectorFecha({ c, valor, onCambio, etiqueta, disponible }) {
  const [abierta, setAbierta] = useState(false);
  const fecha = aFecha(valor);
  return (
    <>
      <button
        type="button"
        id={c?.id}
        aria-describedby={c?.describedBy}
        aria-invalid={c?.invalido || undefined}
        className={css.disparador}
        onClick={() => setAbierta(true)}
      >
        <Icono nombre="calendar_month" tamano={18} />
        <span className={css.valor}>{fecha ? legible(fecha) : 'Elegí una fecha'}</span>
      </button>
      <Hoja abierta={abierta} onCerrar={() => setAbierta(false)} titulo={etiqueta}>
        {abierta ? (
          <Calendario
            elegido={fecha}
            disponible={disponible}
            onElegir={(f) => (onCambio(aTexto(f)), setAbierta(false))}
          />
        ) : null}
      </Hoja>
    </>
  );
}
