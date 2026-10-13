import { Component } from 'react';
import { useLocation } from 'react-router';
import { esErrorDeCarga, recargarUnaVez } from './recargarUnaVez.js';
import { PantallaFalla } from './PantallaFalla.jsx';

// Atrapa cualquier error al dibujar una zona o una pantalla: nunca una pantalla
// en blanco. Al cambiar de ruta se limpia, así el resto de la app sigue andando.
class Red extends Component {
  state = { error: null, recargando: false };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    // Lo publica como error global (consola, y Sentry en la Etapa 16).
    globalThis.reportError?.(error);
    if (esErrorDeCarga(error) && recargarUnaVez()) this.setState({ recargando: true });
  }

  componentDidUpdate(previas) {
    if (previas.ruta !== this.props.ruta && this.state.error) {
      this.setState({ error: null, recargando: false });
    }
  }

  render() {
    const { error, recargando } = this.state;
    if (!error) return this.props.children;
    if (recargando) return null;
    return <PantallaFalla version={esErrorDeCarga(error)} inicio={this.props.inicio} />;
  }
}

export function RedSeguridad({ inicio = '/', children }) {
  const { pathname } = useLocation();
  return (
    <Red ruta={pathname} inicio={inicio}>
      {children}
    </Red>
  );
}
