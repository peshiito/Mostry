import { useState } from 'react';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { AreaTexto, Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import css from './HojaPromo.module.css';

const VACIA = { titulo: '', descripcion: '', desde: '', hasta: '', activa: true };

// Alta de promoción con vista previa de cómo la ve el cliente.
export function HojaPromo({ abierta, onCerrar, onGuardar }) {
  const [p, setP] = useState(VACIA);
  const [error, setError] = useState('');
  const set = (k) => (e) => setP({ ...p, [k]: e.target.value });
  function guardar() {
    if (p.titulo.trim().length < 3 || !p.desde || !p.hasta)
      return setError('Completá título y fechas.');
    if (p.hasta < p.desde)
      return setError('La fecha de fin tiene que ser después del inicio.');
    onGuardar(p);
    setP(VACIA);
  }
  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Nueva promoción">
      <Campo etiqueta="Título">
        {(c) => <Entrada c={c} value={p.titulo} onChange={set('titulo')} />}
      </Campo>
      <Campo etiqueta="Descripción">
        {(c) => <AreaTexto c={c} value={p.descripcion} onChange={set('descripcion')} />}
      </Campo>
      <div className={css.fechas}>
        <Campo etiqueta="Desde">
          {(c) => <Entrada c={c} type="date" value={p.desde} onChange={set('desde')} />}
        </Campo>
        <Campo etiqueta="Hasta" error={error}>
          {(c) => <Entrada c={c} type="date" value={p.hasta} onChange={set('hasta')} />}
        </Campo>
      </div>
      <div className={css.previa} aria-label="Vista previa">
        <span className={css.sello}>Promo</span>
        <strong>{p.titulo || 'Título de la promo'}</strong>
        <span>{p.descripcion}</span>
      </div>
      <Boton variante="principal" tamano="lg" anchoCompleto onClick={guardar}>
        Guardar promoción
      </Boton>
    </Hoja>
  );
}
