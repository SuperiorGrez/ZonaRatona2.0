import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ImagenProducto from '../../components/ImagenProducto';
import PrecioProducto from '../../components/PrecioProducto';
import SelectorCantidad from '../../components/SelectorCantidad';
import ListaProductos from '../../components/ListaProductos';
import EstadoVacio from '../../components/EstadoVacio';
import productosService from '../../services/productosService';
import { cantidadEnCarrito } from '../../utils/carrito';

export default function DetalleProducto({ productos, categorias, carrito }) {
  const { id } = useParams();
  const { maximoDe, agregar, puedeAgregar } = carrito;
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => setCantidad(1), [id]);

  const producto = productos.find((p) => p.id === Number(id));
  if (!producto || !producto.activo) {
    return (
      <EstadoVacio titulo="Producto no encontrado" mensaje="El producto que buscas no existe o ya no está disponible.">
        <Link to="/productos" className="btn btn-amarillo">Volver al catálogo</Link>
      </EstadoVacio>
    );
  }

  const categoria = categorias.find((c) => c.id === producto.categoriaId);
  const enCarrito = cantidadEnCarrito(carrito.items, producto.id);
  const disponible = Math.max(maximoDe(producto) - enCarrito, 0);
  const relacionados = productosService.relacionados(producto, productos);

  function agregarSeleccion() {
    agregar(producto, cantidad);
    setCantidad(1);
  }

  return (
    <>
      <nav className="sombra-texto mb-4 text-sm font-semibold" aria-label="Ruta de navegación">
        <Link to="/" className="text-amarillo underline">Home</Link> /{' '}
        <Link to="/productos" className="text-amarillo underline">Productos</Link> /{' '}
        {categoria && (
          <>
            <Link to={`/categorias/${categoria.id}`} className="text-amarillo underline">{categoria.nombre}</Link> /{' '}
          </>
        )}
        <span>{producto.nombre}</span>
      </nav>

      <div className="tarjeta mb-10 grid overflow-hidden md:grid-cols-5">
        <div className="flex h-80 items-center justify-center bg-white p-4 md:col-span-2 md:h-96">
          <ImagenProducto src={producto.imagen} alt={producto.nombre} />
        </div>
        <div className="p-6 md:col-span-3">
          <div className="text-sm font-semibold text-gray-500">{producto.codigo}</div>
          <h1 className="mb-2 text-3xl font-bold">{producto.nombre}</h1>
          {categoria && <span className="badge mb-3 bg-amarillo text-negro">{categoria.nombre}</span>}
          <PrecioProducto precio={producto.precio} precioOferta={producto.precioOferta} grande />
          <p className="mt-3">{producto.descripcion}</p>
          <p className={`mt-3 font-semibold ${producto.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Producto sin stock'}
          </p>
          {producto.stock > 0 && (
            <>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <SelectorCantidad cantidad={cantidad} minimo={1} maximo={Math.max(disponible, 1)} onCambiar={setCantidad} />
                <button type="button" className="btn btn-amarillo px-6" disabled={!puedeAgregar(producto, cantidad)} onClick={agregarSeleccion}>
                  Añadir al carrito
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Máximo {maximoDe(producto)} unidades por compra{enCarrito > 0 && ` · Ya tienes ${enCarrito} en tu carrito`}
              </p>
            </>
          )}
        </div>
      </div>

      {relacionados.length > 0 && (
        <section>
          <h2 className="sombra-texto mb-4 text-2xl font-bold">Productos relacionados</h2>
          <ListaProductos productos={relacionados} categorias={categorias} onAgregar={(p) => agregar(p)} puedeAgregar={puedeAgregar} />
        </section>
      )}
    </>
  );
}
