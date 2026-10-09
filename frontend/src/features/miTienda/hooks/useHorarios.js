import { useState } from 'react';
import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';

import { tramosPorDia } from '../../tienda/lib/adaptar.js';
import { NOMBRES_DIAS, errorTramos } from '../lib/tramos.js';
import { useBasePanel, usePanelApi } from '../../panelBase/BasePanel.jsx';

// Horarios (PUT /horarios con la semana entera) y feriados (/feriados).
export function useHorarios() {
  const panel = usePanelApi();
  const { api } = useBasePanel();
  const h = useConsulta(`${api}/horarios`);
  const f = useConsulta(`${api}/feriados`);
  const [editados, setEditados] = useState(null);
  const base = tramosPorDia(h.datos ?? []);
  const dias =
    editados ??
    [1, 2, 3, 4, 5, 6, 0].map((d) => ({
      d,
      nombre: NOMBRES_DIAS[d],
      tramos: base[d] ?? [],
    }));
  const cambiarDia = (d, tramos) =>
    setEditados(dias.map((x) => (x.d === d ? { ...x, tramos } : x)));
  // Mismo horario para toda la semana (atajo "Abrimos las 24 horas").
  const cambiarTodos = (tramos) => setEditados(dias.map((x) => ({ ...x, tramos })));
  const errores = Object.fromEntries(dias.map((x) => [x.d, errorTramos(x.tramos)]));
  const guardar = useAccion(
    async () => {
      const tramos = dias.flatMap((x) =>
        x.tramos.map(([abre, cierra]) => ({ diaSemana: x.d, abre, cierra })),
      );
      await panel.put('/horarios', { tramos });
      setEditados(null);
      h.recargar();
    },
    { exito: 'Horarios guardados' },
  );
  const feriado = useAccion(
    async (fn) => {
      await fn();
      f.recargar();
    },
    { exito: (_, _fn, texto) => texto },
  );
  return {
    dias,
    cambiarDia,
    cambiarTodos,
    errores,
    cargando: h.cargando,
    // Si falló la carga NO se puede editar: guardar borraría los horarios reales.
    errorCarga: h.error ?? f.error,
    recargar: () => (h.recargar(), f.recargar()),
    guardar,
    feriados: f.datos ?? [],
    agregarFeriado: (fecha, motivo) =>
      feriado.ejecutar(
        () => panel.post('/feriados', { fecha, motivo }),
        'Feriado agregado',
      ),
    quitarFeriado: (id) =>
      feriado.ejecutar(() => panel.borrar(`/feriados/${id}`), 'Feriado quitado'),
    errorFeriado: feriado.error,
  };
}
