import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { EsqueletoFormulario } from '../../../shared/ui/esqueletos/EsqueletoFormulario.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { TarjetaSellos } from '../../club/components/TarjetaSellos.jsx';
import { InterruptorClub } from '../components/InterruptorClub.jsx';
import { ListaPremios } from '../components/ListaPremios.jsx';
import { ReglasClub } from '../components/ReglasClub.jsx';
import { useProgramaClub } from '../hooks/useProgramaClub.js';
import { pieTarjeta } from '../../club/lib/pieTarjeta.js';

// Club de clientes (Lealtad L2): el programa de sellos de la tienda.
export function PantallaClubPanel() {
  const c = useProgramaClub();
  if (c.errorCarga)
    return <ErrorCarga error={c.errorCarga} que="tu club" onReintentar={c.recargar} />;
  if (c.cargando)
    return (
      <Pagina>
        <EsqueletoFormulario campos={4} />
      </Pagina>
    );
  const { p, guardado } = c;
  return (
    <Pagina>
      <TituloPagina
        migas="Negocio"
        titulo="Club de clientes"
        bajada="Tus clientes juntan sellos con su QR del Club Mostry y ganan los premios que elijas."
      />
      <InterruptorClub activo={p.activo} accion={c.interruptor} />
      <Seccion titulo="Así lo ven tus clientes">
        <TarjetaSellos nombre={p.nombre} premios={p.premios} pie={pieTarjeta(p)} />
      </Seccion>
      <Seccion titulo="Premios" bajada="Hasta 6. Al usar uno, los sellos vuelven a 0.">
        <ListaPremios
          premios={p.premios}
          onPoner={c.ponerPremio}
          onQuitar={c.quitarPremio}
        />
      </Seccion>
      <Seccion titulo="Reglas">
        <ReglasClub p={p} cambiar={c.cambiar} />
      </Seccion>
      <AvisoError error={guardado.error} />
      <Boton
        variante="principal"
        tamano="lg"
        anchoCompleto
        cargando={guardado.enviando}
        textoHecho={guardado.hecho ? 'Guardado' : undefined}
        disabled={p.premios.length === 0 || p.compraMinima === null}
        onClick={() => guardado.ejecutar()}
      >
        Guardar cambios
      </Boton>
    </Pagina>
  );
}
