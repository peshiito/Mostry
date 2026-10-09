import { useState } from 'react';
import { linkWhatsapp } from '../../../shared/lib/linkSeguro.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { AreaTexto, Campo } from '../../../shared/ui/Campo.jsx';
import { Chips } from '../../../shared/ui/Chips.jsx';
import { usePlantillas } from '../hooks/usePlantillas.js';
import { armarMensaje, plantillaSugerida } from '../lib/mensaje.js';
import css from './HojaWhatsapp.module.css';

// Elegís la plantilla, el texto se completa con los datos de la tienda y lo
// podés retocar antes de abrir WhatsApp.
export function Mensaje({ tienda }) {
  const p = usePlantillas();
  const [clave, setClave] = useState(() => plantillaSugerida(tienda));
  const [editado, setEditado] = useState(null);
  const plantilla = p.plantillas.find((x) => x.clave === clave);
  const texto =
    editado ?? (plantilla ? armarMensaje(plantilla.texto, tienda, p.datos) : '');
  const link = linkWhatsapp(tienda.whatsapp, texto);
  if (!tienda.whatsapp) {
    return (
      <Aviso tipo="alerta" titulo="Esta tienda no cargó su WhatsApp">
        Escribile a {tienda.emailDueno ?? tienda.email ?? 'su email'} o pedile que lo
        cargue en Mi tienda.
      </Aviso>
    );
  }
  return (
    <div className={css.cuerpo}>
      <Chips
        etiqueta="Plantilla"
        opciones={p.plantillas.map((x) => ({ valor: x.clave, texto: x.titulo }))}
        valor={clave}
        onCambio={(v) => (setClave(v), setEditado(null))}
      />
      <Campo etiqueta="Mensaje" ayuda="Podés cambiar lo que quieras antes de mandarlo.">
        {(c) => (
          <AreaTexto
            c={c}
            rows={8}
            maxLength={1500}
            value={texto}
            onChange={(e) => setEditado(e.target.value)}
          />
        )}
      </Campo>
      <Boton
        variante="principal"
        tamano="lg"
        anchoCompleto
        icono="chat"
        href={link ?? undefined}
        disabled={!link || !texto.trim()}
      >
        Abrir WhatsApp
      </Boton>
    </div>
  );
}
