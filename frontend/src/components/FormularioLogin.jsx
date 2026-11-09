import { useRef, useState } from 'react';
import Alerta from './Alerta';
import { validarLogin, hayErrores } from '../utils/validaciones';

export default function FormularioLogin({ onIngresar }) {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [error, setError] = useState('');
  const refClave = useRef(null);

  function pasarAClave(evento) {
    if (evento.key === 'Enter' && usuario.trim()) {
      evento.preventDefault();
      refClave.current.focus();
    }
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (hayErrores(validarLogin({ usuario, clave }))) {
      setError('Escribe tu usuario y tu contraseña.');
      return;
    }
    const resultado = await onIngresar(usuario.trim(), clave);
    if (!resultado.ok) {
      setError(resultado.error);
      setClave('');
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-4">
      <Alerta mensaje={error} />
      <div>
        <label htmlFor="login-usuario" className="etiqueta">Usuario o correo</label>
        <input id="login-usuario" className="campo" autoComplete="username" value={usuario} onChange={(e) => setUsuario(e.target.value)} onKeyDown={pasarAClave} />
      </div>
      <div>
        <label htmlFor="login-clave" className="etiqueta">Contraseña</label>
        <div className="flex gap-2">
          <input
            id="login-clave"
            ref={refClave}
            type={verClave ? 'text' : 'password'}
            className="campo"
            autoComplete="current-password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
          />
          <button type="button" className="btn btn-sm btn-borde text-gray-300" onClick={() => setVerClave(!verClave)}>
            {verClave ? 'Ocultar' : 'Ver'}
          </button>
        </div>
      </div>
      <button type="submit" className="btn btn-amarillo w-full">
        Entrar
      </button>
    </form>
  );
}
