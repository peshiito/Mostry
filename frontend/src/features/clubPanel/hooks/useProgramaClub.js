import { useState } from 'react';
import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { usePanel } from '../../panelBase/PanelContexto.jsx';
import { usePanelApi } from '../../panelBase/BasePanel.jsx';

// Cada premio con solo los campos de su tipo (la API los pide justos).
const limpiarPremio = ({ compras, tipo, valor, tope, descripcion }) =>
  tipo === 'regalo'
    ? { compras, tipo, descripcion }
    : tipo === 'monto'
      ? { compras, tipo, valor, descripcion }
      : { compras, tipo, valor, tope: tope ?? null, descripcion };

const ordenar = (premios) => [...premios].sort((a, b) => a.compras - b.compras);

// El programa del club (/panel/club): se edita en memoria y se guarda entero.
// El interruptor va aparte y al toque (prender exige premios guardados).
export function useProgramaClub() {
  const api = usePanelApi();
  const { tienda, setTienda } = usePanel();
  const { datos, cargando, error: errorCarga, recargar } = useConsulta('/panel/club');
  // Lo editado en memoria; mientras no se toque nada, lo que vino de la API.
  const [editado, setP] = useState(null);
  const p = editado ?? datos;

  const reflejar = (nuevo) => {
    setP(nuevo);
    setTienda({ ...tienda, usaClub: nuevo.activo });
  };
  const guardado = useAccion(
    async () => {
      const { activo: _, premios, ...resto } = p;
      reflejar(await api.put('/club', { ...resto, premios: premios.map(limpiarPremio) }));
    },
    { exito: 'Guardamos tu club' },
  );
  const interruptor = useAccion(
    // Solo cambia el interruptor: lo que esté editando y sin guardar sigue ahí.
    async (activo) => {
      const nuevo = await api.patch('/club/activo', { activo });
      reflejar({ ...p, activo: nuevo.activo });
    },
    { exito: (_, activo) => (activo ? 'Tu club está prendido' : 'Apagaste el club') },
  );

  const cambiar = (k, v) => setP((x) => ({ ...(x ?? datos), [k]: v }));
  const ponerPremio = (premio, anterior) =>
    cambiar(
      'premios',
      ordenar([...p.premios.filter((x) => x.compras !== anterior), premio]),
    );
  const quitarPremio = (compras) =>
    cambiar(
      'premios',
      p.premios.filter((x) => x.compras !== compras),
    );
  return {
    p,
    cargando: cargando || !p,
    errorCarga,
    recargar,
    cambiar,
    ponerPremio,
    quitarPremio,
    guardado,
    interruptor,
  };
}
