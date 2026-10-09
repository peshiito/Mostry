import { useState } from 'react';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { fechaCorta } from '../../../shared/lib/fechas.js';
import { Chips } from '../../../shared/ui/Chips.jsx';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { Fila } from '../../../shared/ui/Fila.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { ESTADOS_REPORTE } from '../../reportes/lib/pantallas.js';
import { HojaReporte } from '../components/HojaReporte.jsx';

const FILTROS = [
  { valor: 'nuevo', texto: 'Nuevos' },
  { valor: 'en_curso', texto: 'En revisión' },
  { valor: 'resuelto', texto: 'Resueltos' },
  { valor: '', texto: 'Todos' },
];

// Bandeja de reportes que mandan los comercios (Etapa 14.5, parte D).
export function PantallaReportes() {
  const [estado, setEstado] = useState('nuevo');
  const [abierto, setAbierto] = useState(null);
  const c = useConsulta(`/admin/reportes${estado ? `?estado=${estado}` : ''}`);
  const reportes = c.datos?.reportes ?? [];
  const opciones = FILTROS.map((f) =>
    f.valor === 'nuevo' ? { ...f, cuenta: c.datos?.nuevos } : f,
  );
  return (
    <Pagina ancho="completo">
      <TituloPagina
        migas="Administración"
        titulo="Reportes"
        bajada="Problemas que te mandan las tiendas desde su panel."
      />
      <Chips etiqueta="Estado" opciones={opciones} valor={estado} onCambio={setEstado} />
      {c.error ? <ErrorCarga que="los reportes" onReintentar={c.recargar} /> : null}
      {c.cargando && !c.datos ? <Esqueleto filas={4} /> : null}
      {c.datos && reportes.length === 0 ? (
        <Estado icono="support_agent" titulo="No hay reportes acá">
          Cuando una tienda reporte algo, aparece en esta lista.
        </Estado>
      ) : null}
      {reportes.length ? (
        <Lista>
          {reportes.map((r) => (
            <Fila
              key={r.id}
              onClick={() => setAbierto(r.id)}
              titulo={`${r.tienda} · #${r.numero}`}
              detalle={`${fechaCorta(r.creadoEn)} · ${r.descripcion.slice(0, 90)}`}
              fin={
                <Etiqueta tono={ESTADOS_REPORTE[r.estado].tono}>
                  {ESTADOS_REPORTE[r.estado].texto}
                </Etiqueta>
              }
              flecha
            />
          ))}
        </Lista>
      ) : null}
      <HojaReporte id={abierto} onCerrar={() => setAbierto(null)} onCambio={c.recargar} />
    </Pagina>
  );
}
