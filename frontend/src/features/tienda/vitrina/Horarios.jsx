import css from './Horarios.module.css';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const ORDEN = [1, 2, 3, 4, 5, 6, 0];
const hoy = () =>
  new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }),
  ).getDay();

const texto = (tramos) =>
  tramos
    ? tramos
        .map(([a, c]) => (a === '00:00' && c === '24:00' ? '24 horas' : `${a} a ${c}`))
        .join(' y ')
    : 'Cerrado';

// Horarios en una tabla que se lee de un vistazo, con el día de hoy marcado.
export function Horarios({ tramos }) {
  const actual = hoy();
  return (
    <table className={css.tabla} data-v="horarios">
      <caption className={css.titulo}>Horarios</caption>
      <tbody>
        {ORDEN.map((d) => (
          <tr key={d} className={d === actual ? css.hoy : undefined}>
            <th scope="row">{DIAS[d]}</th>
            <td>{texto(tramos[d])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
