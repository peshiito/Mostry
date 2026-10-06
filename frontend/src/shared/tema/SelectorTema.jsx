import { Segmentado } from '../ui/Segmentado.jsx';
import { useTema } from './useTema.js';

const OPCIONES = [
  { valor: 'sistema', texto: 'Automático' },
  { valor: 'claro', texto: 'Claro' },
  { valor: 'oscuro', texto: 'Oscuro' },
];

// Elegir el modo de la pantalla: como el celular, siempre claro o siempre oscuro.
export function SelectorTema() {
  const { preferencia, elegir } = useTema();
  return (
    <Segmentado
      etiqueta="Apariencia"
      opciones={OPCIONES}
      valor={preferencia}
      onCambio={elegir}
    />
  );
}
