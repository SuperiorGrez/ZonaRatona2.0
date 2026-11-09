import { Link } from 'react-router-dom';
import ImagenProducto from './ImagenProducto';
import PrecioProducto from './PrecioProducto';

export default function TarjetaProducto({ producto, nombreCategoria, onAgregar, puedeAgregar = true }) {
  const sinStock = !producto.activo || producto.stock <= 0;
  const enOferta = producto.precioOferta && producto.precioOferta < producto.precio;

  let textoBoton = 'Agregar al carrito';
  if (sinStock) textoBoton = 'Sin stock';
  else if (!puedeAgregar) textoBoton = 'Límite alcanzado';

  return (
    <article className="tarjeta flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/productos/${producto.id}`} className="relative flex h-44 items-center justify-center bg-white p-3">
        {enOferta && <span className="badge absolute top-2 left-2 bg-red-600 text-white">Oferta</span>}
        <ImagenProducto src={producto.imagen} alt={producto.nombre} />
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <div className="text-sm font-semibold text-gray-500">{producto.codigo}</div>
        <h3 className="truncate font-bold" title={producto.nombre}>
          <Link to={`/productos/${producto.id}`}>{producto.nombre}</Link>
        </h3>
        {nombreCategoria && <span className="badge mb-2 self-start border border-gray-400">{nombreCategoria}</span>}
        <PrecioProducto precio={producto.precio} precioOferta={producto.precioOferta} />
        <div className={`mb-3 text-sm font-semibold ${sinStock ? 'text-red-600' : 'text-gray-500'}`}>
          {sinStock ? 'No disponible' : `Stock: ${producto.stock} · Disponible`}
        </div>
        <button
          type="button"
          className={`btn mt-auto w-full ${sinStock || !puedeAgregar ? 'btn-gris' : 'btn-amarillo'}`}
          disabled={sinStock || !puedeAgregar}
          onClick={() => onAgregar(producto)}
        >
          {textoBoton}
        </button>
      </div>
    </article>
  );
}
