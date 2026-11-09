import { Link, useNavigate } from 'react-router-dom';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import EstadoVacio from '../../components/EstadoVacio';
import BotonConfirmar from '../../components/BotonConfirmar';
import FilaCarrito from '../../components/FilaCarrito';
import ResumenCompra from '../../components/ResumenCompra';
import ListaProductos from '../../components/ListaProductos';
import productosService from '../../services/productosService';

/** Carrito de compras: editar cantidades, quitar, vaciar e ir a pagar. */
export default function Carrito({ productos, categorias, carrito }) {
  const { detalle, total, cambiarCantidad, quitar, vaciar, maximoDe, agregar, puedeAgregar } = carrito;
  const navegar = useNavigate();

  const sugerencias = productosService
    .enOferta(productos)
    .filter((p) => p.stock > 0 && !carrito.items.some((i) => i.productoId === p.id))
    .slice(0, 5);

  return (
    <>
      <EncabezadoPagina titulo="Carrito de compras" subtitulo="Revisa tus productos antes de pagar." />

      {detalle.length === 0 ? (
        <EstadoVacio titulo="Tu carrito está vacío" mensaje="Agrega productos desde el catálogo para comenzar tu compra.">
          <Link to="/productos" className="btn btn-amarillo">Ir al catálogo</Link>
        </EstadoVacio>
      ) : (
        <div className="mb-10 grid gap-6 lg:grid-cols-3">
          <div className="tarjeta p-4 lg:col-span-2">
            <div className="overflow-x-auto">
              <table className="tabla">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th className="text-right">Precio</th>
                    <th>Cantidad</th>
                    <th className="text-right">Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {detalle.map((item) => (
                    <FilaCarrito key={item.productoId} item={item} maximo={maximoDe(item.producto)} onCambiarCantidad={cambiarCantidad} onQuitar={quitar} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <BotonConfirmar etiqueta="Limpiar carrito" pregunta="¿Vaciar todo el carrito?" onConfirmar={vaciar} />
            </div>
          </div>
          <div>
            <ResumenCompra subtotal={total}>
              <button type="button" className="btn btn-verde py-3 text-lg" onClick={() => navegar('/checkout')}>
                Comprar ahora
              </button>
              <Link to="/productos" className="btn btn-borde text-gray-700">Seguir comprando</Link>
            </ResumenCompra>
            <p className="sombra-texto mt-2 text-sm font-semibold">El costo de envío se calcula en el siguiente paso.</p>
          </div>
        </div>
      )}

      {sugerencias.length > 0 && (
        <section>
          <h2 className="sombra-texto mb-4 text-2xl font-bold">Te puede interesar</h2>
          <ListaProductos productos={sugerencias} categorias={categorias} onAgregar={agregar} puedeAgregar={puedeAgregar} />
        </section>
      )}
    </>
  );
}
