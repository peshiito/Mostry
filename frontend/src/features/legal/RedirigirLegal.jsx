import { Navigate, useSearchParams } from 'react-router';

// La dirección vieja /legal (y /legal?privacidad) sigue andando.
export function RedirigirLegal() {
  const [params] = useSearchParams();
  return <Navigate to={params.has('privacidad') ? '/privacidad' : '/terminos'} replace />;
}
