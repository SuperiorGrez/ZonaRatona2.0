import { useState } from 'react';
import CampoFormulario from './CampoFormulario';
import SelectorRegionComuna from './SelectorRegionComuna';
import { validarRegistro, hayErrores } from '../utils/validaciones';
import { manejarCambio } from '../utils/formularios';

const INICIAL = {
  nombre: '',
  apellidos: '',
  usuario: '',
  email: '',
  telefono: '',
  clave: '',
  confirmarClave: '',
  calle: '',
  region: '',
  comuna: '',
  terminos: false,
};

function fortalezaClave(clave) {
  let puntos = 0;
  if (clave.length >= 6) puntos++;
  if (/[A-Z]/.test(clave)) puntos++;
  if (/[0-9]/.test(clave)) puntos++;
  if (/[^A-Za-z0-9]/.test(clave) || clave.length >= 10) puntos++;
  return puntos;
}

const NIVELES = [
  { texto: 'Muy débil', color: 'text-red-500' },
  { texto: 'Débil', color: 'text-red-500' },
  { texto: 'Regular', color: 'text-amber-400' },
  { texto: 'Buena', color: 'text-sky-400' },
  { texto: 'Fuerte', color: 'text-green-500' },
];

export default function FormularioRegistro({ onRegistrar }) {
  const [valores, setValores] = useState(INICIAL);
  const [errores, setErrores] = useState({});
  const cambiar = (e) => manejarCambio(e, setValores, setErrores);
  const nivel = NIVELES[fortalezaClave(valores.clave)];

  async function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarRegistro(valores);
    if (hayErrores(encontrados)) {
      setErrores(encontrados);
      return;
    }
    const resultado = await onRegistrar(valores);
    if (resultado && !resultado.ok) setErrores(resultado.errores || {});
  }

  return (
    <form onSubmit={enviar} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <CampoFormulario etiqueta="Nombre" nombre="nombre" valor={valores.nombre} onChange={cambiar} error={errores.nombre} requerido />
        <CampoFormulario etiqueta="Apellidos" nombre="apellidos" valor={valores.apellidos} onChange={cambiar} error={errores.apellidos} requerido />
        <CampoFormulario etiqueta="Usuario" nombre="usuario" valor={valores.usuario} onChange={cambiar} error={errores.usuario} requerido autoComplete="username" />
        <CampoFormulario etiqueta="Correo" nombre="email" tipo="email" valor={valores.email} onChange={cambiar} error={errores.email} requerido autoComplete="email" />
        <CampoFormulario etiqueta="Teléfono (opcional)" nombre="telefono" valor={valores.telefono} onChange={cambiar} error={errores.telefono} placeholder="+56912345678" />
        <div className="hidden md:block"></div>
        <div>
          <CampoFormulario etiqueta="Contraseña" nombre="clave" tipo="password" valor={valores.clave} onChange={cambiar} error={errores.clave} requerido autoComplete="new-password" ayuda="Mínimo 6 caracteres, una mayúscula y un número." />
          {valores.clave && (
            <div className="mt-1 text-sm font-semibold">
              Seguridad: <span className={nivel.color}>{nivel.texto}</span>
            </div>
          )}
        </div>
        <CampoFormulario etiqueta="Confirmar contraseña" nombre="confirmarClave" tipo="password" valor={valores.confirmarClave} onChange={cambiar} error={errores.confirmarClave} requerido autoComplete="new-password" />
      </div>

      <h2 className="mt-6 mb-2 font-bold">Dirección (opcional, para autocompletar tus compras)</h2>
      <CampoFormulario className="mb-4" etiqueta="Calle y número" nombre="calle" valor={valores.calle} onChange={cambiar} />
      <SelectorRegionComuna region={valores.region} comuna={valores.comuna} onChange={cambiar} requerido={false} />

      <label className="mt-4 flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="terminos" className="h-4 w-4 accent-amarillo" checked={valores.terminos} onChange={cambiar} />
        Acepto los términos y condiciones
      </label>
      {errores.terminos && <p className="mt-1 text-sm text-red-500">{errores.terminos}</p>}

      <button type="submit" className="btn btn-amarillo mt-6 w-full">
        Crear cuenta
      </button>
    </form>
  );
}
