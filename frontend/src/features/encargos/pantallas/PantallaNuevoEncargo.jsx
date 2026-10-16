import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { SeccionTitulo } from '../../../shared/ui/SeccionTitulo.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { ClienteEncargo } from '../components/ClienteEncargo.jsx';
import { CuandoEncargo } from '../components/CuandoEncargo.jsx';
import { ProductosEncargo } from '../components/ProductosEncargo.jsx';
import { SenaCobrada } from '../components/SenaCobrada.jsx';
import { useNuevoEncargo } from '../hooks/useNuevoEncargo.js';

// Encargos 3: un encargo que te llegó por WhatsApp o en persona. Entra ya
// aceptado y queda en la agenda, igual que los de la tienda online.
export function PantallaNuevoEncargo() {
  const n = useNuevoEncargo();
  if (n.consulta.error)
    return (
      <ErrorCarga
        error={n.consulta.error}
        que="tus productos"
        onReintentar={n.consulta.recargar}
      />
    );
  return (
    <Pagina>
      <TituloPagina
        migas="Encargos"
        titulo="Cargar encargo"
        bajada="Lo que te pidieron por WhatsApp o en el local."
      />
      <AvisoError error={n.accion.error} />
      <SeccionTitulo titulo="Cliente" />
      <ClienteEncargo form={n.form} onCambio={n.setForm} />
      <SeccionTitulo titulo="¿Para cuándo?" />
      <CuandoEncargo form={n.form} onCambio={n.setForm} />
      <SeccionTitulo titulo="¿Qué encargó?" />
      <ProductosEncargo form={n.form} productos={n.productos} onCambio={n.setForm} />
      <SenaCobrada form={n.form} total={n.total} onCambio={n.setForm} />
      <Boton
        variante="principal"
        tamano="lg"
        anchoCompleto
        disabled={!!n.falta}
        cargando={n.accion.enviando}
        textoCargando="Guardando…"
        onClick={n.guardar}
      >
        Guardar encargo
      </Boton>
      {n.falta ? <p className="soloLector">{n.falta}</p> : null}
    </Pagina>
  );
}
