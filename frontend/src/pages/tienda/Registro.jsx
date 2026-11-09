import { Link, useNavigate } from 'react-router-dom';
import FormularioRegistro from '../../components/FormularioRegistro';
import authService from '../../services/authService';

/** Página de registro de nuevos clientes. */
export default function Registro() {
  const navegar = useNavigate();

  async function crearCuenta(datos) {
    const resultado = await authService.registrar(datos);
    if (resultado.ok) {
      navegar('/login', { state: { mensaje: '¡Cuenta creada con éxito! Ya puedes iniciar sesión.' } });
    }
    return resultado;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="tarjeta-oscura p-8">
        <h1 className="text-center text-3xl font-bold text-amarillo">Crear cuenta</h1>
        <p className="mb-6 text-center text-gray-400">Regístrate para comprar más rápido.</p>
        <FormularioRegistro onRegistrar={crearCuenta} />
        <p className="mt-4 text-center text-sm">
          ¿Ya tienes cuenta? <Link to="/login" className="font-bold text-amarillo">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
