import { DOMINIO_BASE } from '../../../shared/lib/zonaActual.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { CopiarDato } from '../../../shared/ui/CopiarDato.jsx';
import { Interruptor } from '../../../shared/ui/Interruptor.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { DatosTienda } from '../components/DatosTienda.jsx';
import { SelectorPaleta } from '../components/SelectorPaleta.jsx';
import { useBasePanel } from '../../panelBase/BasePanel.jsx';
import { useAjustesRapidos } from '../hooks/useAjustesRapidos.js';
import { useMiTienda } from '../hooks/useMiTienda.js';

// Datos y apariencia de la tienda (Stitch 45).
export function PantallaMiTienda() {
  const m = useMiTienda();
  const { tienda, pausa, logo } = useAjustesRapidos();
  const { soporte } = useBasePanel();
  return (
    <Pagina as="form" onSubmit={m.guardar}>
      <TituloPagina migas="Mi tienda" titulo="Datos y apariencia" />
      <CopiarDato etiqueta="Link de tu tienda" valor={`${tienda.slug}.${DOMINIO_BASE}`} />
      <AvisoError error={m.accion.error ?? logo.error ?? pausa.error} />
      <Tarjeta>
        <DatosTienda
          t={{ ...m.t, logoUrl: tienda.logoUrl }}
          onCambio={m.setT}
          onLogo={logo.ejecutar}
          subiendoLogo={logo.enviando}
          errores={m.errores}
        />
      </Tarjeta>
      <Tarjeta>
        <SelectorPaleta
          valor={m.t.paleta}
          onCambio={(paleta) => m.setT({ ...m.t, paleta })}
        />
      </Tarjeta>
      {/* Pausar es una decisión del comercio: en el modo soporte no aparece. */}
      {soporte ? null : (
        <Tarjeta tono={tienda.pausada ? 'mostaza' : undefined}>
          <Interruptor
            etiqueta="Pausar tienda"
            ayuda="Tus clientes ven la tienda cerrada y no pueden pedir."
            activo={tienda.pausada}
            onCambio={(v) => pausa.ejecutar(v)}
          />
        </Tarjeta>
      )}
      {m.guardado ? <Aviso tipo="ok" titulo="Cambios guardados" /> : null}
      <Boton
        type="submit"
        variante="principal"
        tamano="lg"
        anchoCompleto
        cargando={m.accion.enviando}
      >
        Guardar cambios
      </Boton>
    </Pagina>
  );
}
