import { AvisoError } from '../../shared/ui/AvisoError.jsx';
import { Boton } from '../../shared/ui/Boton.jsx';
import { Pagina } from '../../shared/ui/Pagina.jsx';
import { Seccion } from '../../shared/ui/Seccion.jsx';
import { TituloPagina } from '../../shared/ui/TituloPagina.jsx';
import { SeccionModulos, SeccionRubro, SeccionStock } from './SeccionesPerfil.jsx';
import { usePerfil } from './usePerfil.js';

// Más → "Qué uso de Mostry": las mismas preguntas del inicio, todas juntas, para
// prender o apagar partes cuando quiera. Apagar no borra nada.
export function PantallaUso() {
  const p = usePerfil({ exito: 'Listo, tu panel se acomodó' });
  return (
    <Pagina>
      <TituloPagina
        migas="Mi tienda"
        titulo="Qué uso de Mostry"
        bajada="Prendé o apagá partes. Lo que apagás no se borra."
      />
      <AvisoError error={p.accion.error} />
      <Seccion titulo="Qué hacés con Mostry">
        <SeccionModulos p={p} />
      </Seccion>
      <Seccion titulo="Tu rubro">
        <SeccionRubro p={p} />
      </Seccion>
      <Seccion titulo="Stock de los productos nuevos">
        <SeccionStock p={p} />
      </Seccion>
      <Boton
        variante="principal"
        tamano="lg"
        anchoCompleto
        cargando={p.accion.enviando}
        textoCargando="Guardando…"
        textoHecho={p.accion.hecho ? 'Guardado' : undefined}
        onClick={() => p.accion.ejecutar()}
      >
        Guardar cambios
      </Boton>
    </Pagina>
  );
}
