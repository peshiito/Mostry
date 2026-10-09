import { SubirArchivo } from '../../../shared/ui/SubirArchivo.jsx';

// Zona para elegir el comprobante de pago (imagen o PDF).
export function SubirComprobante({ archivo, onArchivo }) {
  return (
    <SubirArchivo
      archivo={archivo}
      onArchivo={onArchivo}
      tipos={['image/jpeg', 'image/png', 'application/pdf']}
      titulo="Subí la captura o el PDF"
      ayuda="JPG, PNG o PDF, hasta 5 MB"
      errorTipo="Tiene que ser JPG, PNG o PDF."
    />
  );
}
