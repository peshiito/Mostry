import { Icono } from './Icono.jsx';
import css from './Buscador.module.css';

export function Buscador({ valor, onCambio, placeholder = 'Buscá medialunas, tortas…' }) {
  return (
    <label className={css.buscador}>
      <Icono nombre="search" className={css.icono} />
      <span className="soloLector">Buscar productos</span>
      <input
        type="search"
        className={css.input}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onCambio(e.target.value)}
      />
    </label>
  );
}
