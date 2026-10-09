import { useEffect, useState } from 'react';
import { Boton } from '../../../shared/ui/Boton.jsx';

// "Reenviar código" con espera de 45 segundos (y rate limit en la API).
// La espera vuelve a arrancar solo si el reenvío salió bien (onReenviar → true).
export function BotonReenviar({ onReenviar }) {
  const [espera, setEspera] = useState(45);
  useEffect(() => {
    if (!espera) return;
    const id = setTimeout(() => setEspera(espera - 1), 1000);
    return () => clearTimeout(id);
  }, [espera]);
  return (
    <Boton
      variante="texto"
      disabled={espera > 0}
      onClick={async () => {
        if (await onReenviar?.()) setEspera(45);
      }}
    >
      {espera
        ? `Reenviar código (en 0:${String(espera).padStart(2, '0')})`
        : 'Reenviar código'}
    </Boton>
  );
}
