import { useState } from 'react';
import { temaEfectivo } from '../../../shared/temaTienda/temas.js';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import { VistaPrevia } from '../../disenoTienda/vista/VistaPrevia.jsx';
import css from './ColumnaVista.module.css';

const DISPOSITIVO = [
  { valor: 'celu', texto: 'Celu' },
  { valor: 'compu', texto: 'Compu' },
];
const MODO = [
  { valor: 'claro', texto: 'Claro' },
  { valor: 'oscuro', texto: 'Oscuro' },
];

// La página tal como va a quedar, con los cambios al instante, en celu o compu.
export function ColumnaVista({ valor, doc, medios }) {
  const [dispositivo, setDispositivo] = useState('celu');
  const [modo, setModo] = useState('claro');
  return (
    <section className={css.columna} aria-label="Vista previa">
      <div className={css.controles}>
        <Segmentado
          etiqueta="Ver en"
          opciones={DISPOSITIVO}
          valor={dispositivo}
          onCambio={setDispositivo}
        />
        <Segmentado etiqueta="Modo" opciones={MODO} valor={modo} onCambio={setModo} />
      </div>
      <VistaPrevia
        valor={{ ...valor, tienda: { ...valor.tienda, medios } }}
        tema={temaEfectivo(valor.tienda)}
        modo={modo}
        pagina={doc}
        compu={dispositivo === 'compu'}
      />
    </section>
  );
}
