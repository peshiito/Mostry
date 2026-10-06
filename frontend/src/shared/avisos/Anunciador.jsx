// Lo que leen los lectores de pantalla. Está siempre montado y visible para
// ellos (fuera del popover, que se esconde): así cada aviso nuevo se anuncia.
export function Anunciador({ lista }) {
  const ultimo = (tipo) =>
    lista.find((a) => !a.saliendo && (tipo === 'error') === (a.tipo === 'error'));
  const texto = (a) => (a ? [a.titulo, a.descripcion].filter(Boolean).join('. ') : '');
  return (
    <>
      <div className="soloLector" role="status" aria-live="polite">
        {texto(ultimo('normal'))}
      </div>
      <div className="soloLector" role="alert">
        {texto(ultimo('error'))}
      </div>
    </>
  );
}
