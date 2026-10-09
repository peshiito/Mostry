import { hora } from '../../../shared/lib/fechas.js';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { QuePuedeVer } from '../components/QuePuedeVer.jsx';
import { RegistroSoporte } from '../components/RegistroSoporte.jsx';
import { useSoportePanel } from '../hooks/useSoportePanel.js';

// "Acceso de soporte" (Etapa 14.5, parte E): el comercio decide si Mostry entra a
// ayudarlo, por cuánto tiempo, y ve todo lo que se cambió.
export function PantallaSoporte() {
  const s = useSoportePanel();
  if (s.cargando && !s.acceso && !s.registro.length) return <Esqueleto filas={4} />;
  if (s.error) return <ErrorCarga que="el acceso de soporte" onReintentar={s.recargar} />;
  return (
    <Pagina>
      <TituloPagina
        migas="Ayuda"
        titulo="Acceso de soporte"
        bajada="Dejá que Mostry entre a ayudarte, por una hora."
      />
      <AvisoError error={s.accion.error} />
      {s.acceso ? (
        <Aviso
          tipo="ok"
          titulo={`Mostry tiene acceso hasta las ${hora(s.acceso.venceEn)}`}
          icono="shield_person"
        >
          Podés cortarlo cuando quieras.
        </Aviso>
      ) : null}
      <Tarjeta>
        <QuePuedeVer />
      </Tarjeta>
      {s.acceso ? (
        <Boton
          variante="peligro"
          anchoCompleto
          icono="lock"
          cargando={s.accion.enviando}
          onClick={s.cortar}
        >
          Cortar acceso ahora
        </Boton>
      ) : (
        <Boton
          variante="principal"
          tamano="lg"
          anchoCompleto
          icono="lock_open"
          cargando={s.accion.enviando}
          onClick={s.dar}
        >
          Dar acceso a Mostry por 1 hora
        </Boton>
      )}
      <RegistroSoporte registro={s.registro} />
    </Pagina>
  );
}
