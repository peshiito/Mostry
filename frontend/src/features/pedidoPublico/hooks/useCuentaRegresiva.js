import { useEffect, useState } from 'react';

// Minutos y segundos que faltan hasta `hasta` (ISO). Se actualiza cada segundo.
export function useCuentaRegresiva(hasta) {
  const [ahora, setAhora] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const resto = Math.max(0, new Date(hasta).getTime() - ahora);
  const h = Math.floor(resto / 3600000);
  const m = Math.floor((resto % 3600000) / 60000);
  return { vencido: resto === 0, texto: `${h}:${String(m).padStart(2, '0')} h` };
}
