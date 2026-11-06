import { Link } from 'react-router';

// Link interno (sin recargar), externo (pestaña nueva) o ancla.
export function BotonPortada({ b, ...resto }) {
  if (b.interno) return <Link to={b.href} {...resto} />;
  const fuera = b.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return <a href={b.href} {...fuera} {...resto} />;
}
