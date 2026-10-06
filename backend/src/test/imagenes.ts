import { deflateSync } from 'node:zlib';
import sharp from 'sharp';

export const lienzo = (width: number, height: number) =>
  sharp({ create: { width, height, channels: 3, background: '#0E5A4A' } });

// JPG de celular: 1600×1200 con EXIF (que tiene que desaparecer al procesar).
export const jpgConExif = () =>
  lienzo(1600, 1200)
    .jpeg()
    .withExif({ IFD0: { Copyright: 'DATO-PRIVADO-EXIF' } })
    .toBuffer();

export const png = () => lienzo(300, 300).png().toBuffer();

export const maliciosos = {
  svgConScript: Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
  ),
  textoDisfrazado: Buffer.from('esto no es una imagen, aunque se llame foto.jpg'),
  gif: Buffer.from('GIF89a\x01\x00\x01\x00\x00\x00\x00;', 'binary'),
  // Empieza como JPG pero sigue con HTML: tiene la firma pero no es una imagen válida.
  poliglota: Buffer.concat([
    Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
    Buffer.from('<html><script>x</script>'),
  ]),
};

// PNG que declara 30.000 × 30.000 píxeles (900 millones): "bomba" de descompresión.
export function pngBomba(): Buffer {
  const chunk = (tipo: string, datos: Buffer) => {
    const largo = Buffer.alloc(4);
    largo.writeUInt32BE(datos.length);
    return Buffer.concat([largo, Buffer.from(tipo), datos, Buffer.alloc(4)]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(30_000, 0);
  ihdr.writeUInt32BE(30_000, 4);
  ihdr.set([8, 0, 0, 0, 0], 8);
  const firma = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([
    firma,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.alloc(100))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Descarga una URL pública (RustFS) y devuelve status, tipo y metadatos.
export async function descargar(url: string) {
  const res = await fetch(url);
  if (!res.ok) return { status: res.status };
  const datos = Buffer.from(await res.arrayBuffer());
  return {
    status: res.status,
    tipo: res.headers.get('content-type'),
    meta: await sharp(datos).metadata(),
    datos,
  };
}
