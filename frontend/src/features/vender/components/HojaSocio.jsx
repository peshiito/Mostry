import { useState } from 'react';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { useEscaner } from '../hooks/useEscaner.js';
import css from './Socio.module.css';

const TEXTOS = {
  abriendo: 'Abriendo la cámara…',
  mirando: 'Apuntá al QR que muestra tu cliente en su celular.',
  sin_permiso: 'No pudimos usar la cámara. Tipeá el código de 6 letras.',
  sin_soporte: 'Este navegador no lee QR: tipeá el código de 6 letras.',
};

// Identificar al cliente del Club: cámara o el código corto tipeado.
export function HojaSocio({ abierta, onCerrar, identificar }) {
  const [codigo, setCodigo] = useState('');
  const buscar = (c) => identificar.ejecutar(c);
  const { video, estado } = useEscaner(abierta, buscar);
  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Cliente del club">
      {estado === 'mirando' || estado === 'abriendo' ? (
        <video ref={video} className={css.video} muted playsInline aria-hidden="true" />
      ) : null}
      <p className={css.ayuda}>{TEXTOS[estado]}</p>
      <Campo etiqueta="Código del cliente" error={identificar.error?.message}>
        {(c) => (
          <Entrada
            c={c}
            className={css.codigo}
            maxLength={6}
            autoCapitalize="characters"
            autoComplete="off"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          />
        )}
      </Campo>
      <Boton
        variante="verde"
        tamano="lg"
        anchoCompleto
        disabled={codigo.trim().length !== 6}
        cargando={identificar.enviando}
        onClick={() => buscar(codigo.trim())}
      >
        Buscar
      </Boton>
    </Hoja>
  );
}
