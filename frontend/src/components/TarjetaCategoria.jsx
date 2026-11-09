import { Link } from 'react-router-dom';
import ImagenProducto from './ImagenProducto';

/** Tarjeta de categoría con imagen, nombre y cantidad de productos. */
export default function TarjetaCategoria({ categoria, cantidad, activa = false }) {
  return (
    <Link
      to={`/categorias/${categoria.id}`}
      className={`tarjeta block overflow-hidden transition hover:-translate-y-1 ${activa ? 'ring-4 ring-amarillo' : ''}`}
      aria-current={activa ? 'page' : undefined}
    >
      <div className="flex h-24 items-center justify-center bg-white p-2">
        <ImagenProducto src={categoria.imagen} alt={categoria.nombre} />
      </div>
      <div className="p-2 text-center">
        <div className="font-bold">{categoria.nombre}</div>
        {cantidad !== undefined && <div className="text-sm text-gray-500">{cantidad} productos</div>}
      </div>
    </Link>
  );
}
