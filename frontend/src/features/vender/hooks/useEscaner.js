import { useEffect, useRef, useState } from 'react';

const CODIGO = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/;
export const hayEscaner = () =>
  typeof window !== 'undefined' && 'BarcodeDetector' in window;

// La cámara trasera mirando QR (BarcodeDetector del navegador). Cuando lee un
// código del Club llama a onCodigo. Si el navegador no lo trae o no hay permiso,
// queda el código para tipear. Apaga la cámara al cerrarse.
export function useEscaner(activo, onCodigo) {
  const video = useRef(null);
  const [estado, setEstado] = useState(hayEscaner() ? 'abriendo' : 'sin_soporte');
  const aviso = useRef(onCodigo);
  useEffect(() => {
    aviso.current = onCodigo;
  });
  useEffect(() => {
    if (!activo || !hayEscaner()) return undefined;
    let flujo;
    let timer;
    let vivo = true;
    const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
    const mirar = async () => {
      const [qr] = await detector.detect(video.current).catch(() => []);
      const codigo = qr?.rawValue?.trim().toUpperCase();
      // Si el código no sirve (una captura vieja), sigue mirando.
      if (vivo && codigo && CODIGO.test(codigo) && (await aviso.current(codigo))) return;
      if (vivo) timer = setTimeout(mirar, 250);
    };
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(async (f) => {
        flujo = f;
        if (!vivo) return f.getTracks().forEach((t) => t.stop());
        video.current.srcObject = f;
        await video.current.play();
        setEstado('mirando');
        mirar();
      })
      .catch(() => vivo && setEstado('sin_permiso'));
    return () => {
      vivo = false;
      clearTimeout(timer);
      flujo?.getTracks().forEach((t) => t.stop());
    };
  }, [activo]);
  return { video, estado };
}
