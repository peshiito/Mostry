import { useState } from 'react';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { CopiarDato } from '../../../shared/ui/CopiarDato.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { Mensaje } from '../components/MensajeWhatsapp.jsx';
import css from './Ayuda.module.css';

// Problemas con la contraseña: una clave temporal para mandarle por WhatsApp
// (al entrar elige una nueva), o reenviarle el mail con el código.
export function HojaClave({ abierta, onCerrar, tienda, clave, mail }) {
  // La clave se muestra una sola vez: vive solo mientras la hoja está abierta.
  const [generada, setGenerada] = useState(null);
  const generar = async () => {
    const r = await clave.ejecutar();
    if (r.ok) setGenerada(r.datos.clave);
  };
  const cerrar = () => (setGenerada(null), onCerrar());
  return (
    <Hoja abierta={abierta} onCerrar={cerrar} titulo="Problemas con la contraseña" ancha>
      <AvisoError error={clave.error ?? mail.error} />
      {generada ? (
        <div className={css.bloque}>
          <Aviso tipo="ok" titulo="Clave temporal lista">
            Se ve una sola vez. Al entrar, le va a pedir que elija una nueva.
          </Aviso>
          <CopiarDato etiqueta="Clave temporal" valor={generada} mono />
          <Mensaje tienda={tienda} inicial="clave_temporal" extra={{ clave: generada }} />
        </div>
      ) : (
        <div className={css.bloque}>
          <p className={css.texto}>
            La clave temporal sirve aunque no tenga acceso a su mail. El mail le manda un
            código para elegir una nueva{' '}
            {tienda.verificado ? '' : '(o para verificar su email)'}.
          </p>
          <Boton
            variante="principal"
            icono="key"
            cargando={clave.enviando}
            textoCargando="Generando…"
            onClick={generar}
          >
            Generar clave temporal
          </Boton>
          <Boton
            icono="mail"
            cargando={mail.enviando}
            textoCargando="Enviando…"
            onClick={() => mail.ejecutar()}
          >
            Reenviar mail con código
          </Boton>
        </div>
      )}
    </Hoja>
  );
}
