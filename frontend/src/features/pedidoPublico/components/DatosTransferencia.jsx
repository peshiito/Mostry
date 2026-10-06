import { plata } from '../../../shared/lib/plata.js';
import { CopiarDato } from '../../../shared/ui/CopiarDato.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import css from './DatosTransferencia.module.css';

// Monto exacto, alias y titular para transferir, con botones de copiar.
export function DatosTransferencia({ monto, alias, titular }) {
  return (
    <Tarjeta className={css.datos}>
      <div className={css.total}>
        <span className={css.etiqueta}>Monto exacto a transferir</span>
        <Monto centavos={monto} tamano="xl" />
      </div>
      <CopiarDato
        etiqueta="Monto"
        valor={plata(monto)}
        textoACopiar={String(monto / 100)}
      />
      <CopiarDato etiqueta="Alias" valor={alias} mono />
      <CopiarDato etiqueta="Titular de la cuenta" valor={titular} />
    </Tarjeta>
  );
}
