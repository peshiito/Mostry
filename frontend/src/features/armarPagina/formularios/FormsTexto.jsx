import { Opcion, TextoLargo, TextoOpcional } from './campos.jsx';
import css from './Formularios.module.css';

export const FormTexto = ({ datos, cambiar }) => (
  <div className={css.form}>
    <TextoOpcional
      etiqueta="Título"
      valor={datos.titulo}
      max={80}
      onCambio={(titulo) => cambiar({ titulo })}
      ayuda="Opcional"
    />
    <TextoLargo
      etiqueta="Texto"
      valor={datos.cuerpo}
      max={1500}
      onCambio={(cuerpo) => cambiar({ cuerpo })}
    />
    <Opcion
      etiqueta="Alineación"
      opciones={[
        ['izquierda', 'A la izquierda'],
        ['centro', 'Centrado'],
      ]}
      valor={datos.alineacion}
      onCambio={(alineacion) => cambiar({ alineacion })}
    />
  </div>
);

export const FormTitulo = ({ datos, cambiar }) => (
  <div className={css.form}>
    <TextoOpcional
      etiqueta="Título"
      valor={datos.titulo}
      max={60}
      onCambio={(titulo) => cambiar({ titulo })}
      ayuda="Vacío: el título de siempre"
    />
  </div>
);

export const FormCierre = ({ datos, cambiar }) => (
  <div className={css.form}>
    <TextoOpcional
      etiqueta="Título"
      valor={datos.titulo}
      defecto="¿Buscás algo que no está?"
      max={80}
      onCambio={(titulo) => cambiar({ titulo })}
    />
    <TextoOpcional
      etiqueta="Texto"
      valor={datos.texto}
      max={200}
      largo
      onCambio={(texto) => cambiar({ texto })}
      ayuda="Vacío: el texto de siempre"
    />
  </div>
);
