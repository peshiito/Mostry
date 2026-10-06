import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Pasos } from '../../../shared/ui/Pasos.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { LayoutCuenta } from '../components/LayoutCuenta.jsx';
import { PasoRecuperar } from '../components/PasoRecuperar.jsx';
import { useRecuperar } from '../hooks/useRecuperar.js';

const PASOS = ['Email', 'Código por email', 'Nueva clave'];

// Recuperar contraseña con un código que llega por email (Stitch 10).
export function PantallaRecuperar({ base = '/panel' }) {
  const r = useRecuperar();
  return (
    <LayoutCuenta volver={`${base}/ingresar`}>
      {r.paso <= 3 ? <Pasos pasos={PASOS} actual={r.paso} /> : null}
      <TituloPagina titulo="Recuperar contraseña" />
      <AvisoError error={r.error} />
      {r.error && r.paso === 3 ? (
        <Boton variante="texto" onClick={r.reiniciar}>
          Empezar de nuevo
        </Boton>
      ) : null}
      <PasoRecuperar
        key={r.paso}
        paso={r.paso}
        onSeguir={r.seguir}
        enviando={r.enviando}
        base={base}
      />
    </LayoutCuenta>
  );
}
