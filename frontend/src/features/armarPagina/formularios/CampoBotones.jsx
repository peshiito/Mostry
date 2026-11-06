import { Boton } from '../../../shared/ui/Boton.jsx';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import css from './Formularios.module.css';
import { SelectorDestino } from './SelectorDestino.jsx';

// Los botones de un bloque (hasta `max`): qué dicen y adónde llevan.
export function CampoBotones({ botones, onCambio, max = 2, ctx }) {
  const cambiar = (i, cambio) =>
    onCambio(botones.map((b, j) => (j === i ? { ...b, ...cambio } : b)));
  return (
    <div className={css.form}>
      {botones.map((b, i) => (
        <fieldset key={i} className={css.boton}>
          <div className={css.cabeza}>
            <legend className={css.etiqueta}>Botón {i + 1}</legend>
            <BotonIcono
              icono="delete"
              etiqueta={`Quitar el botón ${i + 1}`}
              onClick={() => onCambio(botones.filter((_, j) => j !== i))}
            />
          </div>
          <Campo etiqueta="Qué dice">
            {(c) => (
              <Entrada
                c={c}
                value={b.texto}
                maxLength={30}
                onChange={(e) => cambiar(i, { texto: e.target.value })}
              />
            )}
          </Campo>
          <SelectorDestino
            destino={b.destino}
            ctx={ctx}
            onCambio={(destino) => cambiar(i, { destino })}
          />
        </fieldset>
      ))}
      {botones.length < max ? (
        <Boton
          icono="add"
          onClick={() =>
            onCambio([
              ...botones,
              { texto: 'Ver productos', destino: { tipo: 'catalogo' } },
            ])
          }
        >
          Agregar botón
        </Boton>
      ) : null}
    </div>
  );
}
