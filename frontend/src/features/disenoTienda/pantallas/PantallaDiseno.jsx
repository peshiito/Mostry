import { useState } from 'react';
import { urlTienda } from '../../../shared/lib/urls.js';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { ColoresTema } from '../components/ColoresTema.jsx';
import { FormaTema } from '../components/FormaTema.jsx';
import { FuentesTema } from '../components/FuentesTema.jsx';
import { GaleriaTemas } from '../components/GaleriaTemas.jsx';
import { MuestraTema } from '../components/MuestraTema.jsx';
import { useDiseno } from '../hooks/useDiseno.js';
import css from './PantallaDiseno.module.css';

const MODOS = [
  { valor: 'claro', texto: 'Claro' },
  { valor: 'oscuro', texto: 'Oscuro' },
];

// Diseño de la vidriera (Vidriera 2.0): estilo, colores, letras y forma.
export function PantallaDiseno() {
  const d = useDiseno();
  const [modo, setModo] = useState('claro');
  return (
    <Pagina>
      <TituloPagina
        migas="Mi tienda"
        titulo="Diseño de tu tienda"
        bajada="Así la ven tus clientes. Cambiá lo que quieras y guardá."
      />
      <div className={css.vista}>
        <MuestraTema tema={d.tema} nombre="Así se ve" modo={modo} />
        <Segmentado
          etiqueta="Ver en modo"
          opciones={MODOS}
          valor={modo}
          onCambio={setModo}
        />
      </div>
      <GaleriaTemas actual={d.tema.base} onElegir={d.setTema} />
      <ColoresTema
        colores={d.tema.colores}
        onCambio={(colores) => d.cambiar({ colores })}
      />
      <FuentesTema
        fuentes={d.tema.fuentes}
        onCambio={(fuentes) => d.cambiar({ fuentes })}
      />
      <FormaTema tema={d.tema} onCambio={d.cambiar} />
      <AvisoError error={d.accion.error} />
      <div className={css.acciones}>
        <Boton
          variante="principal"
          tamano="lg"
          anchoCompleto
          disabled={!d.cambios}
          cargando={d.accion.enviando}
          textoCargando="Guardando…"
          onClick={d.guardar}
        >
          Guardar diseño
        </Boton>
        <Boton href={urlTienda(d.slug)} icono="open_in_new">
          Ver mi tienda
        </Boton>
      </div>
    </Pagina>
  );
}
