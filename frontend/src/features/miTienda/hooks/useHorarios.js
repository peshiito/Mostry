import { useState } from 'react';
import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { panel } from '../../panelBase/panelApi.js';
import { tramosPorDia } from '../../tienda/lib/adaptar.js';
import { errorTramos } from '../lib/tramos.js';

const NOMBRES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

// Horarios (PUT /panel/horarios con la semana entera) y feriados (/panel/feriados).
export function useHorarios() {
  const h = useConsulta('/panel/horarios');
  const f = useConsulta('/panel/feriados');
  const [editados, setEditados] = useState(null);
  const base = tramosPorDia(h.datos ?? []);
  const dias =
    editados ??
    [1, 2, 3, 4, 5, 6, 0].map((d) => ({ d, nombre: NOMBRES[d], tramos: base[d] ?? [] }));
  const cambiarDia = (d, tramos) =>
    setEditados(dias.map((x) => (x.d === d ? { ...x, tramos } : x)));
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
    errores,
    cargando: h.cargando,
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
