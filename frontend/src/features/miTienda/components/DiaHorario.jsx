import { Boton } from '../../../shared/ui/Boton.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TRAMOS_DEL_MODO, modoDelDia } from '../lib/tramos.js';
import css from './DiaHorario.module.css';
import { TramoHorario } from './TramoHorario.jsx';

const MODOS = [
  { valor: 'cerrado', texto: 'Cerrado' },
  { valor: 'horario', texto: 'Horario' },
  { valor: '24h', texto: '24 horas' },
];

// Un día de la semana: cerrado, con sus tramos (mañana y tarde) o las 24 horas.
export function DiaHorario({ dia, error, onCambio }) {
  const modo = modoDelDia(dia.tramos);
  const editar = (i, j, v) =>
    onCambio(
      dia.tramos.map((t, k) => (k === i ? t.map((x, m) => (m === j ? v : x)) : t)),
    );
  return (
    <Tarjeta className={css.dia}>
      <h2 className={css.nombre}>{dia.nombre}</h2>
      <Segmentado
        etiqueta={`Horario del ${dia.nombre}`}
        opciones={MODOS}
        valor={modo}
        onCambio={(m) => onCambio(TRAMOS_DEL_MODO[m])}
      />
      {modo === '24h' ? (
        <p className={css.nota}>Abierto todo el día, sin cortes.</p>
      ) : null}
      {modo === 'horario'
        ? dia.tramos.map((t, i) => (
            <TramoHorario
              key={i}
              dia={dia.nombre}
              i={i}
              tramo={t}
              onEditar={(j, v) => editar(i, j, v)}
              onQuitar={() => onCambio(dia.tramos.filter((_, k) => k !== i))}
            />
          ))
        : null}
      {error ? (
        <p className={css.error} role="alert">
          {error}
        </p>
      ) : null}
      {modo === 'horario' ? (
        <Boton
          variante="texto"
          icono="add"
          onClick={() => onCambio([...dia.tramos, ['16:00', '20:00']])}
        >
          Agregar tramo
        </Boton>
      ) : null}
    </Tarjeta>
  );
}
