import { Interruptor } from '../../../shared/ui/Interruptor.jsx';
import { Opcion } from './campos.jsx';
import css from './Formularios.module.css';

export const FormSeparador = ({ datos, cambiar }) => (
  <div className={css.form}>
    <Opcion
      etiqueta="Tamaño"
      opciones={[
        ['chico', 'Chico'],
        ['medio', 'Medio'],
        ['grande', 'Grande'],
      ]}
      valor={datos.tamano}
      onCambio={(tamano) => cambiar({ tamano })}
    />
    <Interruptor
      etiqueta="Con una línea"
      activo={datos.linea}
      onCambio={(linea) => cambiar({ linea })}
    />
  </div>
);

export const SinFormulario = () => (
  <p className={css.nota}>
    Este bloque se arma solo con los datos de tu tienda. Podés moverlo, ocultarlo o
    sacarlo.
  </p>
);
