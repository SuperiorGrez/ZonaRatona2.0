import { useState } from 'react';
import CampoFormulario from './CampoFormulario';
import SelectorRegionComuna from './SelectorRegionComuna';
import { validarUsuario, hayErrores } from '../utils/validaciones';
import { manejarCambio } from '../utils/formularios';

/** Formulario para que el usuario logueado edite sus propios datos. */
export default function FormularioPerfil({ inicial, onGuardar }) {
  const [valores, setValores] = useState({
    usuario: inicial.usuario,
    nombre: inicial.nombre,
    apellidos: inicial.apellidos,
    email: inicial.email,
    telefono: inicial.telefono || '',
    rol: inicial.rol,
    clave: '',
    calle: inicial.direccion?.calle || '',
    departamento: inicial.direccion?.departamento || '',
    region: inicial.direccion?.region || '',
    comuna: inicial.direccion?.comuna || '',
  });
  const [errores, setErrores] = useState({});
  const cambiar = (e) => manejarCambio(e, setValores, setErrores);

  async function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarUsuario(valores, { claveObligatoria: false });
    if (hayErrores(encontrados)) {
      setErrores(encontrados);
      return;
    }
    const resultado = await onGuardar(valores);
    if (resultado && !resultado.ok) setErrores(resultado.errores || {});
  }

  return (
    <form onSubmit={enviar} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <CampoFormulario etiqueta="Nombre" nombre="nombre" valor={valores.nombre} onChange={cambiar} error={errores.nombre} requerido />
        <CampoFormulario etiqueta="Apellidos" nombre="apellidos" valor={valores.apellidos} onChange={cambiar} error={errores.apellidos} requerido />
        <CampoFormulario etiqueta="Usuario" nombre="usuario" valor={valores.usuario} onChange={cambiar} error={errores.usuario} requerido />
        <CampoFormulario etiqueta="Correo" nombre="email" tipo="email" valor={valores.email} onChange={cambiar} error={errores.email} requerido />
        <CampoFormulario etiqueta="Teléfono" nombre="telefono" valor={valores.telefono} onChange={cambiar} />
        <CampoFormulario
          etiqueta="Nueva contraseña (opcional)"
          nombre="clave"
          tipo="password"
          valor={valores.clave}
          onChange={cambiar}
          error={errores.clave}
          autoComplete="new-password"
          ayuda="Déjala vacía para mantener la actual."
        />
      </div>

      <h2 className="mt-6 mb-2 font-bold">Dirección</h2>
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <CampoFormulario className="md:col-span-2" etiqueta="Calle" nombre="calle" valor={valores.calle} onChange={cambiar} />
        <CampoFormulario etiqueta="Departamento" nombre="departamento" valor={valores.departamento} onChange={cambiar} />
      </div>
      <SelectorRegionComuna region={valores.region} comuna={valores.comuna} onChange={cambiar} requerido={false} />

      <button type="submit" className="btn btn-amarillo mt-6">
        Guardar perfil
      </button>
    </form>
  );
}
