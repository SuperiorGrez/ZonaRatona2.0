import { Link } from 'react-router-dom';
import EstadoVacio from '../../components/EstadoVacio';

export default function NoEncontrado() {
  return (
    <EstadoVacio titulo="Página no encontrada" mensaje="Parece que te saliste del mapa. Vuelve al inicio para seguir jugando.">
      <Link to="/" className="btn btn-amarillo">Ir al inicio</Link>
    </EstadoVacio>
  );
}
