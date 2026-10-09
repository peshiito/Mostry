import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { useState } from 'react';
import { fechaCorta } from '../../../shared/lib/fechas.js';
import { plata } from '../../../shared/lib/plata.js';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Fila } from '../../../shared/ui/Fila.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { BarrasDias } from '../components/BarrasDias.jsx';
import { TarjetaGanancia } from '../components/TarjetaGanancia.jsx';
import { useResumen } from '../hooks/useResumen.js';

const PERIODOS = ['Hoy', 'Semana', 'Mes'].map((t) => ({ valor: t, texto: t }));
const textoDif = (d) =>
  d === 0 ? 'Coincidió' : `${d > 0 ? 'Sobró' : 'Faltó'} ${plata(Math.abs(d))}`;

// Resumen y ganancia real del período (Stitch 37).
export function PantallaResumen() {
  const [periodo, setPeriodo] = useState('Mes');
  const { resumen, porDia, cajas, cargando, errorCarga, recargar } = useResumen(periodo);
  const dias = Object.keys(porDia).sort();
  if (errorCarga) return <ErrorCarga que="el resumen" onReintentar={recargar} />;
  return (
    <Pagina>
      <TituloPagina migas="Caja" titulo="Resumen y ganancia" />
      <Segmentado
        etiqueta="Período"
        opciones={PERIODOS}
        valor={periodo}
        onCambio={setPeriodo}
      />
      {cargando || !resumen ? (
        <Esqueleto filas={2} alto={140} />
      ) : (
        <TarjetaGanancia
          resumen={{ ...resumen, gastos: resumen.gastos + resumen.inversiones }}
        />
      )}
      {dias.length > 1 ? (
        <Seccion titulo="Ventas por día (en miles)">
          <Tarjeta>
            <BarrasDias valores={dias.map((d) => porDia[d])} etiquetas={dias} />
          </Tarjeta>
        </Seccion>
      ) : null}
      <Seccion titulo="Cajas anteriores">
        {cajas.length ? (
          <Lista>
            {cajas.map((c) => (
              <Fila
                key={c.id}
                titulo={fechaCorta(`${c.fecha}T15:00:00Z`)}
                fin={textoDif(c.diferencia)}
              />
            ))}
          </Lista>
        ) : (
          <Estado icono="point_of_sale" titulo="Todavía no cerraste ninguna caja" />
        )}
      </Seccion>
    </Pagina>
  );
}
