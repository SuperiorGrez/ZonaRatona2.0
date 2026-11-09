import { useState } from 'react';
import CampoFormulario from './CampoFormulario';
import ImagenProducto from './ImagenProducto';
import Alerta from './Alerta';
import { validarProducto, hayErrores } from '../utils/validaciones';
import { manejarCambio } from '../utils/formularios';

const PRODUCTO_VACIO = {
  codigo: '',
  nombre: '',
  descripcion: '',
  categoriaId: '',
  precio: '',
  precioOferta: '',
  stock: '',
  stockCritico: '3',
  imagen: '',
  activo: true,
};

/** Convierte un producto guardado a valores de formulario (todo string). */
function productoAFormulario(producto) {
  if (!producto) return PRODUCTO_VACIO;
  return {
    ...PRODUCTO_VACIO,
    ...producto,
    categoriaId: String(producto.categoriaId),
    precio: String(producto.precio),
    precioOferta: producto.precioOferta ? String(producto.precioOferta) : '',
    stock: String(producto.stock),
    stockCritico: String(producto.stockCritico),
  };
}

/** Formulario para crear o editar un producto (panel admin). */
export default function FormularioProducto({ inicial, categorias, onGuardar, onCancelar, textoBoton = 'Guardar producto' }) {
  const [valores, setValores] = useState(() => productoAFormulario(inicial));
  const [errores, setErrores] = useState({});
  const cambiar = (e) => manejarCambio(e, setValores, setErrores);

  async function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarProducto(valores);
    if (hayErrores(encontrados)) {
      setErrores(encontrados);
      return;
    }
    const resultado = await onGuardar(valores);
    if (resultado && !resultado.ok) setErrores(resultado.errores || {});
  }

  return (
    <form onSubmit={enviar} noValidate>
      <Alerta mensaje={errores.general} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-4 md:grid-cols-2 lg:col-span-2">
          <CampoFormulario etiqueta="Código" nombre="codigo" valor={valores.codigo} onChange={cambiar} error={errores.codigo} requerido placeholder="PS5-010" />
          <CampoFormulario etiqueta="Nombre" nombre="nombre" valor={valores.nombre} onChange={cambiar} error={errores.nombre} requerido />
          <CampoFormulario className="md:col-span-2" como="textarea" rows={3} etiqueta="Descripción" nombre="descripcion" valor={valores.descripcion} onChange={cambiar} />
          <CampoFormulario como="select" etiqueta="Categoría" nombre="categoriaId" valor={valores.categoriaId} onChange={cambiar} error={errores.categoriaId} requerido>
            <option value="">Selecciona</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </CampoFormulario>
          <CampoFormulario etiqueta="URL de la imagen" nombre="imagen" tipo="url" valor={valores.imagen} onChange={cambiar} />
          <CampoFormulario etiqueta="Precio" nombre="precio" tipo="number" min="0" valor={valores.precio} onChange={cambiar} error={errores.precio} requerido />
          <CampoFormulario etiqueta="Precio oferta (opcional)" nombre="precioOferta" tipo="number" min="0" valor={valores.precioOferta} onChange={cambiar} error={errores.precioOferta} />
          <CampoFormulario etiqueta="Stock" nombre="stock" tipo="number" min="0" valor={valores.stock} onChange={cambiar} error={errores.stock} requerido />
          <CampoFormulario etiqueta="Stock crítico" nombre="stockCritico" tipo="number" min="0" valor={valores.stockCritico} onChange={cambiar} error={errores.stockCritico} requerido ayuda="Bajo este número el producto aparece como crítico." />
          <label className="flex items-center gap-2 font-semibold md:col-span-2">
            <input type="checkbox" name="activo" className="h-4 w-4 accent-amarillo" checked={valores.activo} onChange={cambiar} />
            Producto activo (visible en la tienda)
          </label>
        </div>
        <div>
          <div className="etiqueta">Vista previa</div>
          <div className="flex h-56 items-center justify-center rounded-lg bg-white p-3">
            <ImagenProducto src={valores.imagen} alt="Vista previa" />
          </div>
        </div>
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
