import { Boton } from '../../../shared/ui/Boton.jsx';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { Interruptor } from '../../../shared/ui/Interruptor.jsx';
import { SelectorHora } from '../../../shared/ui/SelectorHora.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import css from './DiaHorario.module.css';

// Un día de la semana con sus tramos (mañana y tarde, por ejemplo).
export function DiaHorario({ dia, error, onCambio }) {
  const abierto = dia.tramos.length > 0;
  const editar = (i, j, v) =>
    onCambio(
      dia.tramos.map((t, k) => (k === i ? t.map((x, m) => (m === j ? v : x)) : t)),
    );
  return (
    <Tarjeta className={css.dia}>
      <Interruptor
        etiqueta={dia.nombre}
        ayuda={abierto ? 'Abierto' : 'Cerrado'}
        activo={abierto}
        onCambio={(v) => onCambio(v ? [['08:00', '13:00']] : [])}
      />
      {dia.tramos.map(([abre, cierra], i) => (
        <div key={i} className={css.tramo}>
          <SelectorHora
            etiqueta={`${dia.nombre}, abre`}
            valor={abre}
            onCambio={(v) => editar(i, 0, v)}
          />
          <span aria-hidden="true">a</span>
          <SelectorHora
            etiqueta={`${dia.nombre}, cierra`}
            valor={cierra}
            onCambio={(v) => editar(i, 1, v)}
          />
          <BotonIcono
            icono="close"
            etiqueta={`Quitar tramo ${i + 1} del ${dia.nombre}`}
            onClick={() => onCambio(dia.tramos.filter((_, k) => k !== i))}
          />
        </div>
      ))}
      {error ? (
        <p className={css.error} role="alert">
          {error}
        </p>
      ) : null}
      {abierto ? (
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
