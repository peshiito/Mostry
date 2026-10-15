import { useState } from 'react';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';
import { FilaPremio } from './FilaPremio.jsx';
import { HojaPremio } from './HojaPremio.jsx';

// Los escalones, de menor a mayor, el botón para sumar otro (hasta 6) y la
// hoja para editarlos.
export function ListaPremios({ premios, onPoner, onQuitar }) {
  const [hoja, setHoja] = useState(null); // { premio, vez } abierta; null cerrada
  const [vez, setVez] = useState(0);
  const abrir = (premio) => (setVez(vez + 1), setHoja({ premio }));
  const cerrar = () => setHoja(null);
  const propia = hoja?.premio?.compras;
  return (
    <>
      {premios.length === 0 ? (
        <Aviso icono="redeem" titulo="Todavía no hay premios">
          Por ejemplo: a las 5 compras, 20 % de descuento.
        </Aviso>
      ) : (
        <Lista>
          {premios.map((p) => (
            <FilaPremio key={p.compras} premio={p} onEditar={() => abrir(p)} />
          ))}
        </Lista>
      )}
      {premios.length < 6 ? (
        <Boton
          variante="secundario"
          icono="add"
          anchoCompleto
          onClick={() => abrir(null)}
        >
          Agregar premio
        </Boton>
      ) : null}
      <HojaPremio
        key={vez}
        abierta={hoja !== null}
        premio={hoja?.premio ?? null}
        ocupadas={premios.map((x) => x.compras).filter((n) => n !== propia)}
        onCerrar={cerrar}
        onGuardar={(premio, anterior) => (onPoner(premio, anterior), cerrar())}
        onQuitar={(compras) => (onQuitar(compras), cerrar())}
      />
    </>
  );
}
