import { useEffect, useState } from 'react';
import { urlTienda } from '../../../shared/lib/urls.js';
import { usePanelApi } from '../../panelBase/BasePanel.jsx';

// "Mirala en tu celu": guarda el borrador (así el celu ve lo último) y pide un
// link firmado que vence en 24 h. Se pide de nuevo cada vez que se abre.
export function useLinkBorrador(abierta, slug, guardarYa) {
  const panel = usePanelApi();
  const [res, setRes] = useState({ link: null, error: null, para: 0 });
  const [vez, setVez] = useState(0);
  useEffect(() => {
    if (!abierta) return undefined;
    let vigente = true;
    (async () => {
      try {
        await guardarYa();
        const { token } = await panel.post('/tienda/pagina/vista-previa');
        const link = urlTienda(slug, `/?borrador=${encodeURIComponent(token)}`);
        if (vigente) setRes({ link, error: null, para: vez });
      } catch (error) {
        if (vigente) setRes({ link: null, error, para: vez });
      }
    })();
    return () => {
      vigente = false;
    };
  }, [abierta, slug, guardarYa, panel, vez]);
  const listo = abierta && res.para === vez;
  return {
    link: listo ? res.link : null,
    error: listo ? res.error : null,
    reintentar: () => setVez((n) => n + 1),
  };
}
