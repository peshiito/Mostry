import { Fila } from '../../../shared/ui/Fila.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';

// Colores, letras y forma viven en "Diseño de tu tienda" (Vidriera 2.0).
export function LinkDiseno() {
  return (
    <Lista>
      <Fila
        to="/panel/diseno"
        inicio={<Icono nombre="stars" />}
        titulo="Diseño de tu tienda"
        detalle="Estilo, colores, tipografías y forma"
        flecha
      />
    </Lista>
  );
}
