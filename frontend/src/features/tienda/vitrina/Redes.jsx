import css from './Redes.module.css';

const NOMBRES = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  web: 'Web',
};

// Links a las redes de la tienda (el backend ya validó que sean https y de esa red).
export function Redes({ redes }) {
  const lista = Object.entries(redes ?? {}).filter(([, url]) => url);
  if (!lista.length) return null;
  return (
    <ul className={css.redes} aria-label="Redes" data-v="redes">
      {lista.map(([red, url]) => (
        <li key={red}>
          <a href={url} target="_blank" rel="noopener noreferrer" className={css.red}>
            {NOMBRES[red]}
          </a>
        </li>
      ))}
    </ul>
  );
}
