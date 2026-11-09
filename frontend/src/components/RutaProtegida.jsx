import { Navigate, useLocation } from 'react-router-dom';

/** Protege rutas: exige sesión y, opcionalmente, rol administrador. */
export default function RutaProtegida({ usuario, soloAdmin = false, children }) {
  const ubicacion = useLocation();
  if (!usuario) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  if (soloAdmin && usuario.rol !== 'admin') return <Navigate to="/" replace />;
  return children;
}
