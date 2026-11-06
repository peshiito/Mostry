import { useState } from 'react';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { HojaMedios } from '../components/HojaMedios.jsx';
import css from './Formularios.module.css';

// Las imágenes propias de un bloque: las elegidas, en orden, y el botón para
// abrir la biblioteca (ahí también se suben).
export function CampoMedios({ etiqueta, ids, max, ctx, onCambio }) {
  const [abierta, setAbierta] = useState(false);
  const elegidas = ids
    .map((id) => ctx.medios.lista.find((m) => m.id === id))
    .filter(Boolean);
  return (
    <div className={css.opcion}>
      <span className={css.etiqueta}>{etiqueta}</span>
      {elegidas.length ? (
        <ul className={css.miniaturas}>
          {elegidas.map((m, i) => (
            <li key={m.id}>
              <img src={m.urlChica} alt={`Imagen ${i + 1}`} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={css.nota}>Todavía no elegiste ninguna.</p>
      )}
      <Boton icono="image" onClick={() => setAbierta(true)}>
        {elegidas.length ? 'Cambiar imágenes' : 'Elegir imágenes'}
      </Boton>
      <HojaMedios
        abierta={abierta}
        onCerrar={() => setAbierta(false)}
        medios={ctx.medios}
        elegidos={ids}
        max={max}
        onElegir={(nuevos) => {
          onCambio(nuevos);
          if (max === 1) setAbierta(false);
        }}
      />
    </div>
  );
}
