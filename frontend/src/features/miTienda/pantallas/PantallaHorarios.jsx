import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { DiaHorario } from '../components/DiaHorario.jsx';
import { Feriados } from '../components/Feriados.jsx';
import { useHorarios } from '../hooks/useHorarios.js';
import { TODO_EL_DIA, modoDelDia } from '../lib/tramos.js';

// Horarios de atención y feriados (Stitch 46). Fuera de horario solo hay encargos (6.3).
export function PantallaHorarios() {
  const h = useHorarios();
  if (h.cargando) return <Esqueleto filas={7} />;
  if (h.errorCarga) return <ErrorCarga que="tus horarios" onReintentar={h.recargar} />;
  const hayError = Object.values(h.errores).some(Boolean);
  const siempre = h.dias.every((d) => modoDelDia(d.tramos) === '24h');
  return (
    <Pagina>
      <TituloPagina
        migas="Mi tienda"
        titulo="Horarios"
        bajada="Cuándo tu tienda toma pedidos para el momento."
      />
      {siempre ? null : (
        <Boton
          icono="schedule"
          anchoCompleto
          onClick={() => h.cambiarTodos([TODO_EL_DIA])}
        >
          Abrimos las 24 horas, todos los días
        </Boton>
      )}
      {h.dias.map((d) => (
        <DiaHorario
          key={d.d}
          dia={d}
          error={h.errores[d.d]}
          onCambio={(t) => h.cambiarDia(d.d, t)}
        />
      ))}
      <AvisoError error={h.guardar.error} />
      <Boton
        variante="principal"
        tamano="lg"
        anchoCompleto
        disabled={hayError}
        cargando={h.guardar.enviando}
        onClick={() => h.guardar.ejecutar()}
      >
        Guardar horarios
      </Boton>
      <Seccion titulo="Feriados y días cerrados">
        <Feriados
          feriados={h.feriados}
          onAgregar={h.agregarFeriado}
          onQuitar={h.quitarFeriado}
          error={h.errorFeriado}
        />
      </Seccion>
    </Pagina>
  );
}
