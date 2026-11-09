import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import FormularioLogin from '../../components/FormularioLogin';
import Alerta from '../../components/Alerta';

/** Página de inicio de sesión. Redirige al panel si es admin. */
export default function Login({ usuario, onIniciarSesion }) {
  const navegar = useNavigate();
  const ubicacion = useLocation();

  if (usuario) return <Navigate to={usuario.rol === 'admin' ? '/admin' : '/'} replace />;

  async function ingresar(identificador, clave) {
    const resultado = await onIniciarSesion(identificador, clave);
    if (resultado.ok) {
      const destino = ubicacion.state?.desde || (resultado.sesion.rol === 'admin' ? '/admin' : '/');
      navegar(destino, { replace: true });
    }
    return resultado;
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="tarjeta-oscura p-8">
        <h1 className="mb-6 text-center text-3xl font-bold text-amarillo">Iniciar sesión</h1>
        <Alerta tipo="exito" mensaje={ubicacion.state?.mensaje} />
        <FormularioLogin onIngresar={ingresar} />
        <p className="mt-4 text-center text-sm">
          ¿No tienes cuenta? <Link to="/registro" className="font-bold text-amarillo">Regístrate aquí</Link>
        </p>
        <hr className="my-6 border-neutral-700" />
        <p className="text-sm text-gray-400">
          Cuentas de prueba:
          <br />
          <code>admin / Admin123</code> — administrador
          <br />
          <code>lvial / User123</code> — cliente
        </p>
      </div>
    </div>
  );
}
