import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { DiaHorario } from '../components/DiaHorario.jsx';
import { Feriados } from '../components/Feriados.jsx';
import { useHorarios } from '../hooks/useHorarios.js';

// Horarios de atención y feriados (Stitch 46). Fuera de horario solo hay encargos (6.3).
export function PantallaHorarios() {
  const h = useHorarios();
  if (h.cargando) return <Esqueleto filas={7} />;
  const hayError = Object.values(h.errores).some(Boolean);
  return (
    <Pagina>
      <TituloPagina
        migas="Mi tienda"
        titulo="Horarios"
        bajada="Cuándo tu tienda toma pedidos para el momento."
      />
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
