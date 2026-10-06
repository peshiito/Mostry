import { lienzo } from './imagenes.js';

// JPG válido con un script pegado después del final de la imagen (marcador EOI).
export const jpgConPayload = async () =>
  Buffer.concat([
    await lienzo(200, 200).jpeg().toBuffer(),
    Buffer.from('<?php system($_GET["c"]); ?><script>x</script>'),
  ]);

// Firma de PNG con el cuerpo de un JPG: el contenido no coincide con la firma.
export const firmaPngCuerpoJpg = async () =>
  Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    (await lienzo(50, 50).jpeg().toBuffer()).subarray(8),
  ]);

// WebP real: sharp lo decodifica, pero no está en la lista blanca (solo JPG/PNG).
export const webpReal = () => lienzo(50, 50).webp().toBuffer();
