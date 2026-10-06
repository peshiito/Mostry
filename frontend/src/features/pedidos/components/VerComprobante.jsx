import { fechaHora } from '../../../shared/lib/fechas.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import css from './VerComprobante.module.css';

// El archivo vive en el bucket privado: se abre con una URL firmada de 5 minutos.
export function VerComprobante({ comprobante, onAbrir }) {
  return (
    <Tarjeta className={css.caja}>
      <span className={css.icono}>
        <Icono
          nombre={comprobante.archivoTipo === 'pdf' ? 'description' : 'image'}
          tamano={32}
        />
      </span>
      <div className={css.textos}>
        <p className={css.nombre}>
          Comprobante de {comprobante.tipo === 'sena' ? 'seña' : 'pago'}
        </p>
        <p className={css.detalle}>Subido el {fechaHora(comprobante.creadoEn)}</p>
      </div>
      <Boton
        tamano="sm"
        icono="open_in_new"
        disabled={!comprobante.archivoDisponible}
        onClick={onAbrir}
      >
        Abrir
      </Boton>
    </Tarjeta>
  );
}
