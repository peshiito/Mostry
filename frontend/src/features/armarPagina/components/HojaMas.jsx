import { useState } from 'react';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { useVersiones } from '../hooks/useVersiones.js';
import css from './HojaMas.module.css';
import { ListaVersiones } from './ListaVersiones.jsx';

// "Más": cambiar de plantilla, ver el borrador en el celu, volver a una versión publicada o a la página de siempre.
export function HojaMas({
  abierta,
  onCerrar,
  onPlantillas,
  onCelu,
  alRestaurar,
  alVolver,
}) {
  const v = useVersiones(abierta, { alRestaurar, alVolver });
  const [seguro, setSeguro] = useState(false);
  const cerrar = () => {
    setSeguro(false);
    onCerrar();
  };
  const hacer =
    (accion) =>
    async (...args) =>
      (await accion.ejecutar(...args)).ok && cerrar();
  return (
    <Hoja abierta={abierta} onCerrar={cerrar} titulo="Más opciones">
      <div className={css.cuerpo}>
        <Boton icono="dashboard_customize" anchoCompleto onClick={onPlantillas}>
          Cambiar de plantilla
        </Boton>
        <Boton icono="smartphone" anchoCompleto onClick={onCelu}>
          Mirala en tu celu
        </Boton>
        <ListaVersiones lista={v.lista} onVolver={(id) => hacer(v.restaurar)(id)} />
        <section className={css.seccion}>
          <p className={css.nota}>
            La página de siempre es la que tu tienda tenía antes de armar la tuya.
          </p>
          <Boton
            variante={seguro ? 'peligro' : 'secundario'}
            anchoCompleto
            cargando={v.deSiempre.enviando}
            onClick={() => (seguro ? hacer(v.deSiempre)() : setSeguro(true))}
          >
            {seguro ? 'Sí, sacar mi página publicada' : 'Volver a la de siempre'}
          </Boton>
        </section>
      </div>
    </Hoja>
  );
}
