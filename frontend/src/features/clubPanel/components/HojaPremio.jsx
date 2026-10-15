import { useState } from 'react';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Cantidad } from '../../../shared/ui/Cantidad.jsx';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import { aForm, desdeForm, TIPOS } from '../lib/formPremio.js';
import { CamposValor } from './CamposValor.jsx';
import css from './HojaPremio.module.css';

// Alta o edición de un escalón. `premio` null = nuevo. Quien la usa le cambia
// la `key` al abrirla, así el formulario arranca de cero cada vez.
export function HojaPremio({ abierta, premio, ocupadas, onCerrar, onGuardar, onQuitar }) {
  const [f, setF] = useState(aForm(premio));
  const [error, setError] = useState('');
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  function guardar() {
    const r = desdeForm(f, ocupadas);
    if (r.error) return setError(r.error);
    onGuardar(r.premio, premio?.compras);
  }
  return (
    <Hoja
      abierta={abierta}
      onCerrar={onCerrar}
      titulo={premio ? 'Editar premio' : 'Nuevo premio'}
    >
      <div className={css.fila}>
        <span className={css.etiqueta}>¿A cuántas compras?</span>
        <Cantidad
          valor={f.compras}
          onCambio={(v) => set('compras', v)}
          max={50}
          nombre="compras"
        />
      </div>
      <Segmentado
        etiqueta="Tipo de premio"
        opciones={TIPOS}
        valor={f.tipo}
        onCambio={(v) => set('tipo', v)}
      />
      <CamposValor f={f} set={set} />
      <Campo
        etiqueta={f.tipo === 'regalo' ? 'Qué regalás' : 'Detalle (opcional)'}
        error={error}
      >
        {(c) => (
          <Entrada
            c={c}
            maxLength={80}
            value={f.descripcion}
            onChange={(e) => set('descripcion', e.target.value)}
          />
        )}
      </Campo>
      <Boton variante="verde" tamano="lg" anchoCompleto onClick={guardar}>
        Listo
      </Boton>
      {premio ? (
        <Boton variante="texto" anchoCompleto onClick={() => onQuitar(premio.compras)}>
          Quitar este premio
        </Boton>
      ) : null}
    </Hoja>
  );
}
