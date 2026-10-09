import { useConsulta } from '../../../shared/api/useConsulta.js';
import { fechaCorta } from '../../../shared/lib/fechas.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { ESTADOS_REPORTE, nombrePantalla } from '../lib/pantallas.js';
import css from './PantallaMisReportes.module.css';

// Los reportes que mandó la tienda, con su estado y la respuesta de Mostry.
export function PantallaMisReportes() {
  const { datos, cargando, error, recargar } = useConsulta('/panel/reportes');
  if (cargando && !datos) return <Esqueleto filas={4} />;
  if (error) return <ErrorCarga que="tus reportes" onReintentar={recargar} />;
  return (
    <Pagina>
      <TituloPagina migas="Ayuda" titulo="Mis reportes" />
      <Boton icono="add" anchoCompleto to="/panel/reportar">
        Reportar un problema
      </Boton>
      {datos.length === 0 ? (
        <Estado icono="support_agent" titulo="Todavía no mandaste reportes">
          Si algo no anda, contanos y lo revisamos.
        </Estado>
      ) : (
        <ul className={css.lista}>
          {datos.map((r) => {
            const est = ESTADOS_REPORTE[r.estado];
            return (
              <li key={r.id}>
                <Tarjeta className={css.reporte}>
                  <div className={css.cabeza}>
                    <span className={css.numero}>
                      #{r.numero} · {nombrePantalla(r.pantalla)} ·{' '}
                      {fechaCorta(r.creadoEn)}
                    </span>
                    <Etiqueta tono={est.tono}>{est.texto}</Etiqueta>
                  </div>
                  <p className={css.texto}>{r.descripcion}</p>
                  {r.respuesta ? (
                    <p className={css.respuesta}>
                      <strong>Respuesta de Mostry:</strong> {r.respuesta}
                    </p>
                  ) : null}
                </Tarjeta>
              </li>
            );
          })}
        </ul>
      )}
    </Pagina>
  );
}
