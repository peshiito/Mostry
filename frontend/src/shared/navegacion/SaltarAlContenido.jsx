import css from './SaltarAlContenido.module.css';

// Primer elemento con Tab: lleva directo al contenido de la pantalla (#contenido),
// salteando el header y las pestañas. Solo se ve cuando tiene el foco.
export function SaltarAlContenido() {
  function saltar(e) {
    const destino = document.getElementById('contenido');
    if (!destino) return;
    e.preventDefault();
    destino.focus();
  }
  return (
    <a href="#contenido" className={css.saltar} onClick={saltar}>
      Saltar al contenido
    </a>
  );
}
