import { useRef, useState } from 'react';
import { Boton } from './Boton.jsx';
import { Hoja } from './Hoja.jsx';
import { Icono } from './Icono.jsx';
import { RuedaNumeros } from './RuedaNumeros.jsx';
import css from './SelectorHora.module.css';

const HORAS = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0'));
const MINUTOS = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

// Elegir una hora "HH:MM" con ruedas propias (en vez del reloj del navegador).
// Se elige en un borrador y se confirma con "Listo".
export function SelectorHora({ valor, onCambio, etiqueta }) {
  const [abierta, setAbierta] = useState(false);
  const [hora, minuto] = valor.split(':');
  const [borrador, setBorrador] = useState([hora, minuto]);
  const minutos = MINUTOS.includes(minuto) ? MINUTOS : [...MINUTOS, minuto].sort();
  const abrir = () => (setBorrador([hora, minuto]), setAbierta(true));
  const ruedaHora = useRef(null);
  const ruedaMinuto = useRef(null);
  // Lee las ruedas al tocar "Listo": vale aunque todavía estén frenando.
  const listo = () => {
    onCambio(`${ruedaHora.current.leer()}:${ruedaMinuto.current.leer()}`);
    setAbierta(false);
  };
  return (
    <>
      <button
        type="button"
        className={css.disparador}
        aria-label={`${etiqueta}: ${valor}. Cambiar`}
        onClick={abrir}
      >
        <Icono nombre="schedule" tamano={18} />
        <span className={css.valor}>{valor}</span>
      </button>
      <Hoja abierta={abierta} onCerrar={() => setAbierta(false)} titulo={etiqueta}>
        <div className={css.ruedas}>
          <RuedaNumeros
            ref={ruedaHora}
            abierta={abierta}
            etiqueta="Hora"
            valores={HORAS}
            valor={borrador[0]}
            onCambio={(h) => setBorrador((b) => [h, b[1]])}
          />
          <span className={css.dosPuntos} aria-hidden="true">
            :
          </span>
          <RuedaNumeros
            ref={ruedaMinuto}
            abierta={abierta}
            etiqueta="Minutos"
            valores={minutos}
            valor={borrador[1]}
            onCambio={(m) => setBorrador((b) => [b[0], m])}
          />
        </div>
        <Boton variante="principal" tamano="lg" anchoCompleto onClick={listo}>
          Listo · {borrador.join(':')}
        </Boton>
      </Hoja>
    </>
  );
}
