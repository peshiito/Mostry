import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { useState } from 'react';
import { fechaCorta } from '../../../shared/lib/fechas.js';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { AreaTexto, Campo } from '../../../shared/ui/Campo.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { PestanasLibreta } from '../components/PestanasLibreta.jsx';
import { useNotas } from '../hooks/useNotas.js';
import css from './PantallaNotas.module.css';

// Notas sueltas del negocio (Stitch 44). Se pueden borrar (decisión de la Etapa 4).
export function PantallaNotas() {
  const { notas, agregar, borrar, error, errorCarga, recargar } = useNotas();
  const [texto, setTexto] = useState('');
  async function guardar(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    if ((await agregar(texto.trim())).ok) setTexto('');
  }
  if (errorCarga) return <ErrorCarga que="tus notas" onReintentar={recargar} />;
  return (
    <Pagina>
      <TituloPagina migas="Negocio" titulo="Libreta" />
      <PestanasLibreta />
      <Tarjeta as="form" onSubmit={guardar} className={css.form}>
        <Campo etiqueta="Nueva nota">
          {(c) => (
            <AreaTexto c={c} value={texto} onChange={(e) => setTexto(e.target.value)} />
          )}
        </Campo>
        <Boton type="submit" variante="principal" anchoCompleto>
          Guardar nota
        </Boton>
      </Tarjeta>
      <AvisoError error={error} />
      <ul className={css.notas}>
        {notas.map((n) => (
          <li key={n.id} className={css.nota}>
            <p>{n.texto}</p>
            <span className={css.fecha}>{fechaCorta(n.fecha)}</span>
            <BotonIcono
              icono="delete"
              etiqueta="Borrar nota"
              onClick={() => borrar(n.id)}
            />
          </li>
        ))}
      </ul>
    </Pagina>
  );
}
