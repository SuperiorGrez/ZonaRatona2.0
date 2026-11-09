import { useState } from 'react';
import CampoFormulario from './CampoFormulario';
import Alerta from './Alerta';
import { validarContacto, hayErrores } from '../utils/validaciones';
import { manejarCambio } from '../utils/formularios';

const MAX_MENSAJE = 500;

export default function FormularioContacto({ onEnviar, inicial = {} }) {
  const vacio = { nombre: inicial.nombre || '', email: inicial.email || '', asunto: '', mensaje: '' };
  const [valores, setValores] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);
  const cambiar = (e) => manejarCambio(e, setValores, setErrores);

  async function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarContacto(valores);
    if (hayErrores(encontrados)) {
      setErrores(encontrados);
      setEnviado(false);
      return;
    }
    await onEnviar(valores);
    setEnviado(true);
    setValores(vacio);
  }

  return (
    <form onSubmit={enviar} noValidate>
      <Alerta tipo="exito" mensaje={enviado ? '¡Gracias! Tu mensaje fue enviado, te responderemos pronto.' : ''} onCerrar={() => setEnviado(false)} />
      <div className="grid gap-4 md:grid-cols-2">
        <CampoFormulario etiqueta="Nombre" nombre="nombre" valor={valores.nombre} onChange={cambiar} error={errores.nombre} requerido />
        <CampoFormulario etiqueta="Correo" nombre="email" tipo="email" valor={valores.email} onChange={cambiar} error={errores.email} requerido />
        <CampoFormulario className="md:col-span-2" como="select" etiqueta="Asunto" nombre="asunto" valor={valores.asunto} onChange={cambiar} error={errores.asunto} requerido>
          <option value="">Selecciona un asunto</option>
          <option value="consulta">Consulta sobre un producto</option>
          <option value="pedido">Estado de mi pedido</option>
          <option value="garantia">Garantía / devoluciones</option>
          <option value="otro">Otro</option>
        </CampoFormulario>
        <div className="md:col-span-2">
          <CampoFormulario como="textarea" rows={5} etiqueta="Mensaje" nombre="mensaje" valor={valores.mensaje} onChange={cambiar} error={errores.mensaje} maxLength={MAX_MENSAJE} requerido />
          <div className="text-right text-xs text-gray-500">
            {valores.mensaje.length}/{MAX_MENSAJE}
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-amarillo mt-4 px-6">
        Enviar mensaje
      </button>
    </form>
  );
}
