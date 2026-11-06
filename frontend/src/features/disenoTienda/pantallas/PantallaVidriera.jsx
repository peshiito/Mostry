import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { urlTienda } from '../../../shared/lib/urls.js';
import { EditorFotos } from '../contenido/EditorFotos.jsx';
import { EditorSecciones } from '../contenido/EditorSecciones.jsx';
import { EditorTextos } from '../contenido/EditorTextos.jsx';
import { useVidriera } from '../contenido/useVidriera.js';

// Contenido de la vidriera (Vidriera 2.0, V4): fotos, historia, redes y orden.
export function PantallaVidriera() {
  const v = useVidriera();
  const error = v.guardar.error ?? v.portada.error ?? v.foto.error ?? v.borrarFoto.error;
  return (
    <Pagina>
      <TituloPagina
        migas="Mi tienda"
        titulo="Tu vidriera"
        bajada="Fotos, tu historia y lo que se ve primero cuando entran."
      />
      <EditorFotos v={v} />
      <EditorTextos contenido={v.contenido} onCambio={v.setContenido} />
      <EditorSecciones
        secciones={v.contenido.secciones}
        onCambio={(secciones) => v.setContenido({ ...v.contenido, secciones })}
      />
      <AvisoError error={error} />
      <Boton
        variante="principal"
        tamano="lg"
        anchoCompleto
        cargando={v.guardar.enviando}
        textoCargando="Guardando…"
        onClick={() => v.guardar.ejecutar()}
      >
        Guardar cambios
      </Boton>
      <Boton href={urlTienda(v.tienda.slug)} icono="open_in_new">
        Ver mi tienda
      </Boton>
    </Pagina>
  );
}
