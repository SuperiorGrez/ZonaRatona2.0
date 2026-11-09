import { Link, useNavigate, useParams } from 'react-router-dom';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import EstadoVacio from '../../components/EstadoVacio';
import ImagenProducto from '../../components/ImagenProducto';
import PrecioProducto from '../../components/PrecioProducto';
import BotonConfirmar from '../../components/BotonConfirmar';
import productosService from '../../services/productosService';
import categoriasService from '../../services/categoriasService';

export default function ProductoDetalle({ productos, categorias, onCambio }) {
  const { id } = useParams();
  const navegar = useNavigate();
  const producto = productos.find((p) => p.id === Number(id));

  if (!producto) return <EstadoVacio titulo="Producto no encontrado" />;

  async function eliminar() {
    await productosService.eliminar(producto.id);
    await onCambio();
    navegar('/admin/productos');
  }

  const filas = [
    ['Código', producto.codigo],
    ['Categoría', categoriasService.nombreDe(producto.categoriaId, categorias)],
    ['Stock', `${producto.stock} unidades`],
    ['Stock crítico', producto.stockCritico],
    ['Estado', producto.activo ? 'Activo' : 'Inactivo'],
  ];

  return (
    <>
      <EncabezadoPagina titulo={producto.nombre} subtitulo="Detalle del producto">
        <Link to="/admin/productos" className="btn btn-borde text-gray-300">Volver</Link>
        <Link to={`/admin/productos/${producto.id}/editar`} className="btn btn-amarillo">Editar producto</Link>
        <BotonConfirmar etiqueta="Eliminar" pregunta="¿Eliminar este producto?" onConfirmar={eliminar} clase="btn btn-rojo" />
      </EncabezadoPagina>
      <div className="tarjeta grid overflow-hidden md:grid-cols-3">
        <div className="flex h-72 items-center justify-center bg-white p-4">
          <ImagenProducto src={producto.imagen} alt={producto.nombre} />
        </div>
        <div className="p-6 md:col-span-2">
          <PrecioProducto precio={producto.precio} precioOferta={producto.precioOferta} grande />
          <p className="mt-2">{producto.descripcion}</p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {filas.map(([etiqueta, valor]) => (
              <div key={etiqueta}>
                <dt className="text-sm text-gray-500">{etiqueta}</dt>
                <dd className="font-semibold">{valor}</dd>
              </div>
            ))}
          </dl>
          {producto.stock <= producto.stockCritico && (
            <div className="mt-4 rounded-md bg-amber-100 px-4 py-3 font-semibold text-amber-800">⚠ Stock crítico: considera reponer este producto.</div>
          )}
        </div>
      </div>
    </>
  );
}
