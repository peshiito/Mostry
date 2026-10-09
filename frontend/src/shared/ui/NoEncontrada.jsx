import { Boton } from './Boton.jsx';
import { Estado } from './Estado.jsx';
import { Pagina } from './Pagina.jsx';

export function NoEncontrada({ volver = '/' }) {
  return (
    <Pagina>
      <Estado
        nivel={1}
        icono="search"
        titulo="Acá no hay nada"
        accion={<Boton to={volver}>Volver al inicio</Boton>}
      >
        La dirección no existe o cambió.
      </Estado>
    </Pagina>
  );
}
