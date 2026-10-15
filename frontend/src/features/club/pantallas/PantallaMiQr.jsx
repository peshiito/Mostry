import { useOutletContext } from 'react-router';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { TarjetaQr } from '../components/TarjetaQr.jsx';
import css from './PantallaMiQr.module.css';

// Mi QR: lo muestra en la caja de cualquier tienda con Club para sumar sellos.
export function PantallaMiQr() {
  const { cliente } = useOutletContext();
  return (
    <>
      <TituloPagina titulo={`Hola, ${cliente.nombre.split(' ')[0]}`} />
      <TarjetaQr />
      <p className={css.ayuda}>
        Mostralo al pagar. Si la cámara no lo lee, dictá las 6 letras. Cambia cada 5
        minutos: una foto vieja no sirve.
      </p>
    </>
  );
}
