import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { NoEncontrada } from '../../../shared/ui/NoEncontrada.jsx';
import { useParams } from 'react-router';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { CamposProducto } from '../components/CamposProducto.jsx';
import { GrillaFotos } from '../components/GrillaFotos.jsx';
import { OpcionesProducto } from '../components/OpcionesProducto.jsx';
import { useEditarProducto } from '../hooks/useEditarProducto.js';
import css from './PantallaProductoEditar.module.css';
import { useBasePanel } from '../../panelBase/BasePanel.jsx';

// Crear o editar un producto (Stitch 31).
export function PantallaProductoEditar() {
  const { rutas } = useBasePanel();
  const { id } = useParams();
  const e = useEditarProducto(id);
  if (e.cargando) return <Esqueleto filas={5} alto={96} />;
  // Nunca un formulario vacío con el título "Editar": guardar pisaría el producto.
  if (e.errorCarga?.status === 404) return <NoEncontrada volver={`${rutas}/productos`} />;
  if (e.errorCarga) return <ErrorCarga que="el producto" onReintentar={e.recargar} />;
  return (
    <Pagina as="form" onSubmit={e.guardar} noValidate className={css.pagina}>
      <TituloPagina
        migas="Productos"
        titulo={e.nuevo ? 'Nuevo producto' : 'Editar producto'}
      />
      <AvisoError error={e.accion.error} />
      <Seccion titulo="Fotos" bajada="La primera es la portada. Hasta 6.">
        {e.nuevo ? (
          <Aviso>Guardá el producto y después le agregás las fotos.</Aviso>
        ) : (
          <GrillaFotos productoId={id} />
        )}
      </Seccion>
      <Tarjeta>
        <CamposProducto form={e.form} errores={e.errores} onCambio={e.setForm} />
      </Tarjeta>
      <OpcionesProducto form={e.form} onCambio={e.setForm} />
      <div className={css.barra}>
        <Boton
          type="submit"
          variante="principal"
          tamano="lg"
          anchoCompleto
          cargando={e.accion.enviando}
        >
          Guardar
        </Boton>
      </div>
    </Pagina>
  );
}
