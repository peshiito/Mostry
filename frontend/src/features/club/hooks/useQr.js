import { useEffect, useState } from 'react';
import { clubApi } from '../api/club.js';

const segundosHasta = (hasta, ahora) => Math.max(0, Math.ceil((hasta - ahora) / 1000));

// El QR del cliente: lo pide, cuenta los segundos que le quedan y, al rotar,
// pide el siguiente solo. Cuenta con `quedanMs` de la API (no con la hora del
// celular, que puede estar adelantada). Si falla, reintenta a los 10 segundos.
export function useQr() {
  const [qr, setQr] = useState(null);
  const [error, setError] = useState(null);
  const [ahora, setAhora] = useState(() => Date.now());
  const [vuelta, setVuelta] = useState(0);

  useEffect(() => {
    const control = new AbortController();
    let proxima;
    const otraVuelta = (ms) => {
      proxima = setTimeout(() => setVuelta((v) => v + 1), ms);
    };
    clubApi
      .qr(control.signal)
      .then((d) => {
        setQr({ codigo: d.codigo, hasta: Date.now() + d.quedanMs });
        setError(null);
        otraVuelta(d.quedanMs);
      })
      .catch((e) => {
        if (e.name === 'AbortError') return;
        setError(e);
        otraVuelta(10_000);
      });
    return () => (control.abort(), clearTimeout(proxima));
  }, [vuelta]);

  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const quedan = qr ? segundosHasta(qr.hasta, ahora) : null;
  return { codigo: qr?.codigo ?? null, quedan, error, cargando: !qr && !error };
}
