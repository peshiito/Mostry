import { usePlantillas } from '../hooks/usePlantillas.js';
import { HojaBienvenida } from './HojaBienvenida.jsx';
import { HojaCelu } from './HojaCelu.jsx';
import { HojaMas } from './HojaMas.jsx';
import { HojaPlantillas } from './HojaPlantillas.jsx';

// Las hojas de toda la página: la bienvenida (la primera vez), las plantillas y
// "Más" (versiones y volver a la de siempre) y el QR del borrador.
// `hoja`: 'plantillas' | 'mas' | 'celu' | null.
export function HojasEditor({ e, ctx, hoja, setHoja }) {
  const p = usePlantillas(e, ctx);
  // Al cerrarse, un <dialog> avisa tarde: que no cierre la hoja que se abrió después.
  const cerrar = (cual) => () => setHoja((h) => (h === cual ? null : h));
  const poner = (clave) => {
    setHoja(null);
    p.poner(clave);
  };
  return (
    <>
      <HojaBienvenida
        abierta={e.bienvenida && !hoja}
        sugerida={p.sugerida}
        onElegir={poner}
        onVerTodas={() => setHoja('plantillas')}
        onCerrar={e.cerrarBienvenida}
      />
      <HojaPlantillas
        abierta={hoja === 'plantillas'}
        onCerrar={cerrar('plantillas')}
        sugerida={p.sugerida}
        onElegir={poner}
      />
      <HojaMas
        abierta={hoja === 'mas'}
        onCerrar={cerrar('mas')}
        onPlantillas={() => setHoja('plantillas')}
        onCelu={() => setHoja('celu')}
        alRestaurar={(doc) => e.despachar({ tipo: 'reemplazar', doc })}
        alVolver={e.volverALaDeSiempre}
      />
      <HojaCelu
        abierta={hoja === 'celu'}
        onCerrar={cerrar('celu')}
        slug={ctx.tienda.slug}
        guardarYa={e.guardarYa}
      />
    </>
  );
}
