import { useState } from 'react';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { AreaTexto, Campo } from '../../../shared/ui/Campo.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { armarMensaje } from '../lib/mensaje.js';
import css from './EditorPlantilla.module.css';

// Tienda inventada solo para la vista previa.
const EJEMPLO = {
  nombre: 'La Espiga',
  slug: 'la-espiga',
  nombreDueno: 'Rosa Martínez',
  venceEl: new Date(Date.now() + 2 * 86_400_000).toISOString(),
  diasRestantes: 2,
};

// Una plantilla: su texto editable y cómo le llega a la tienda.
export function EditorPlantilla({ plantilla, datos, onGuardar, onRestaurar, enviando }) {
  const [texto, setTexto] = useState(plantilla.texto);
  const cambio = texto.trim() !== plantilla.texto.trim();
  return (
    <Tarjeta className={css.tarjeta}>
      <h2 className={css.titulo}>{plantilla.titulo}</h2>
      <Campo etiqueta="Texto">
        {(c) => (
          <AreaTexto
            c={c}
            rows={6}
            maxLength={1000}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        )}
      </Campo>
      <div className={css.previa}>
        <span className={css.etiqueta}>Así le llega a La Espiga</span>
        <p>{armarMensaje(texto, EJEMPLO, datos)}</p>
      </div>
      <div className={css.acciones}>
        <Boton
          variante="verde"
          disabled={!cambio || !texto.trim()}
          cargando={enviando}
          onClick={() => onGuardar(texto)}
        >
          Guardar
        </Boton>
        {plantilla.editada ? (
          // Al volver, la pantalla rearma el editor con el texto original (cambia su key).
          <Boton variante="texto" onClick={onRestaurar}>
            Volver al texto original
          </Boton>
        ) : null}
      </div>
    </Tarjeta>
  );
}
