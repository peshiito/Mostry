import { useState } from 'react';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import { MuestraTema } from '../components/MuestraTema.jsx';
import { useVistaTienda } from './useVistaTienda.js';
import { VistaPrevia } from './VistaPrevia.jsx';
import css from './VistaPrevia.module.css';

const MODOS = [
  { valor: 'claro', texto: 'Claro' },
  { valor: 'oscuro', texto: 'Oscuro' },
];

// Arriba del editor: tu tienda de verdad con el diseño elegido, en claro u oscuro.
export function VistaDiseno({ slug, tema }) {
  const [modo, setModo] = useState('claro');
  const { valor } = useVistaTienda(slug);
  return (
    <div className={css.vista}>
      {valor ? (
        <VistaPrevia valor={valor} tema={tema} modo={modo} />
      ) : (
        <MuestraTema tema={tema} nombre="Así se ve" modo={modo} />
      )}
      <Segmentado
        etiqueta="Ver en modo"
        opciones={MODOS}
        valor={modo}
        onCambio={setModo}
      />
      <p className={css.nota}>Deslizá adentro del celular para ver toda la tienda.</p>
    </div>
  );
}
