import { useState } from 'react';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { AreaTexto, Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';

const OPCIONES = [
  { valor: '7', texto: '7 días' },
  { valor: '10', texto: '10 días' },
  { valor: '15', texto: '15 días' },
  { valor: 'otro', texto: 'Otro' },
];

// S1: regalarle días a una tienda (en la prueba o en el plan). Motivo obligatorio.
export function HojaCortesia({ abierta, onCerrar, tienda, onRegalar }) {
  const [opcion, setOpcion] = useState('7');
  const [otro, setOtro] = useState('');
  const [motivo, setMotivo] = useState('');
  const dias = Number(opcion === 'otro' ? otro : opcion);
  const valido = Number.isInteger(dias) && dias >= 1 && dias <= 60;
  return (
    <Hoja
      abierta={abierta}
      onCerrar={onCerrar}
      ancha
      titulo={`Regalar días · ${tienda.nombre}`}
    >
      <Segmentado
        etiqueta="Días de cortesía"
        opciones={OPCIONES}
        valor={opcion}
        onCambio={setOpcion}
      />
      {opcion === 'otro' ? (
        <Campo etiqueta="Cuántos días (1 a 60)">
          {(c) => (
            <Entrada
              c={c}
              inputMode="numeric"
              sufijo="días"
              value={otro}
              onChange={(e) => setOtro(e.target.value.replace(/\D/g, ''))}
            />
          )}
        </Campo>
      ) : null}
      <Campo etiqueta="Motivo (obligatorio)" ayuda="Lo ve el comercio en Suscripción.">
        {(c) => (
          <AreaTexto
            c={c}
            value={motivo}
            maxLength={200}
            onChange={(e) => setMotivo(e.target.value)}
          />
        )}
      </Campo>
      <Boton
        variante="principal"
        tamano="lg"
        anchoCompleto
        disabled={!valido || motivo.trim().length < 3}
        onClick={() => onRegalar({ dias, motivo: motivo.trim() })}
      >
        {valido ? `Regalar ${dias} días` : 'Regalar días'}
      </Boton>
    </Hoja>
  );
}
