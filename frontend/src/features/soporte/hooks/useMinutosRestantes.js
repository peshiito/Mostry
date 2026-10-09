import { useEffect, useState } from 'react';

// Minutos que le quedan al permiso de soporte (se actualiza cada 15 segundos).
export function useMinutosRestantes(venceEn) {
  const [ahora, setAhora] = useState(() => Date.now());
  useEffect(() => {
    const reloj = setInterval(() => setAhora(Date.now()), 15_000);
    return () => clearInterval(reloj);
  }, []);
  if (!venceEn) return 0;
  return Math.max(0, Math.ceil((new Date(venceEn).getTime() - ahora) / 60_000));
}
