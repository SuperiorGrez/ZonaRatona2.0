import { useState } from 'react';
import CampoFormulario from './CampoFormulario';
import { validarCategoria, hayErrores } from '../utils/validaciones';
import { manejarCambio } from '../utils/formularios';

export default function FormularioCategoria({ inicial, onGuardar, onCancelar, textoBoton = 'Guardar categoría' }) {
  const [valores, setValores] = useState({
    nombre: inicial?.nombre || '',
    descripcion: inicial?.descripcion || '',
    limitePorProducto: String(inicial?.limitePorProducto ?? 3),
    imagen: inicial?.imagen || '',
  });
  const [errores, setErrores] = useState({});
  const cambiar = (e) => manejarCambio(e, setValores, setErrores);

  async function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarCategoria(valores);
    if (hayErrores(encontrados)) {
      setErrores(encontrados);
      return;
    }
    const resultado = await onGuardar(valores);
    if (resultado && !resultado.ok) setErrores(resultado.errores || {});
  }

  return (
    <form onSubmit={enviar} noValidate>
      <div className="grid gap-4 md:grid-cols-3">
        <CampoFormulario className="md:col-span-2" etiqueta="Nombre" nombre="nombre" valor={valores.nombre} onChange={cambiar} error={errores.nombre} requerido />
        <CampoFormulario etiqueta="Límite de unidades por producto" nombre="limitePorProducto" tipo="number" min="1" valor={valores.limitePorProducto} onChange={cambiar} error={errores.limitePorProducto} requerido />
        <CampoFormulario className="md:col-span-3" como="textarea" rows={2} etiqueta="Descripción" nombre="descripcion" valor={valores.descripcion} onChange={cambiar} />
        <CampoFormulario className="md:col-span-3" etiqueta="URL de imagen" nombre="imagen" tipo="url" valor={valores.imagen} onChange={cambiar} />
      </div>
      <div className="mt-6 flex gap-2">
        <button type="submit" className="btn btn-amarillo">
          {textoBoton}
        </button>
        {onCancelar && (
          <button type="button" className="btn btn-borde text-gray-300" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
