import { useState } from 'react';
import { useAccion } from '../../../shared/api/useAccion.js';

// El cliente del Club en la venta: se identifica por el código de su QR y el
// servidor devuelve una ficha firmada (30 min) que la venta manda al cobrar.
export function useSocio(panel) {
  const [socio, setSocioCrudo] = useState(null);
  const [premio, setPremio] = useState(null); // el escalón elegido para usar
  const setSocio = (s) => (setSocioCrudo(s), setPremio(null));
  const identificar = useAccion(
    async (codigo) => {
      const datos = await panel.post('/club/identificar', { codigo });
      setSocio(datos); // trae la ficha firmada que se manda al cobrar
      return datos;
    },
    {
      exito: (d) => `${d.nombre} · ${d.sellos === 1 ? '1 sello' : `${d.sellos} sellos`}`,
    },
  );
  const elegido = socio?.premios.find((p) => p.compras === premio && p.disponible);
  return { socio, setSocio, identificar, premio: elegido ?? null, setPremio };
}
