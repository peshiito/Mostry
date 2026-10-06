import { useState } from 'react';
import { useNavigate } from 'react-router';
import { aCentavos } from '../../../shared/lib/plata.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { Diferencia } from '../components/Diferencia.jsx';
import { useCaja } from '../hooks/useCaja.js';
import css from './PantallaCerrarCaja.module.css';

// Arqueo y cierre (Stitch 36). La API calcula el esperado y guarda la diferencia (6.4).
export function PantallaCerrarCaja() {
  const { esperado, cerrar, accion } = useCaja();
  const [contado, setContado] = useState('');
  const navegar = useNavigate();
  const c = aCentavos(contado);
  async function confirmar() {
    if ((await cerrar(c)).ok) navegar('/panel/caja');
  }
  return (
    <Pagina>
      <TituloPagina migas="Caja" titulo="Cierre de caja" />
      <Tarjeta className={css.esperado}>
        <span>Debería haber en efectivo</span>
        <Monto centavos={esperado} tamano="lg" />
      </Tarjeta>
      <Campo etiqueta="¿Cuánto contaste?" ayuda="Billetes y monedas del cajón.">
        {(k) => (
          <Entrada
            c={k}
            prefijo="$"
            inputMode="decimal"
            className={css.grande}
            value={contado}
            onChange={(e) => setContado(e.target.value)}
          />
        )}
      </Campo>
      <Diferencia valor={c === null ? null : c - esperado} />
      <Aviso>Las transferencias que lleguen después se registran igual.</Aviso>
      <AvisoError error={accion.error} />
      <Boton
        variante="principal"
        tamano="lg"
        anchoCompleto
        disabled={c === null}
        cargando={accion.enviando}
        onClick={confirmar}
      >
        Cerrar caja
      </Boton>
    </Pagina>
  );
}
