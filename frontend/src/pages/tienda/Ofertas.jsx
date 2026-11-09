import EncabezadoPagina from '../../components/EncabezadoPagina';
import ListaProductos from '../../components/ListaProductos';
import productosService from '../../services/productosService';
import { formatearPrecio } from '../../utils/formato';

/** Todos los productos que tienen precio de oferta, ordenados por mayor descuento. */
export default function Ofertas({ productos, categorias, carrito }) {
  const descuento = (p) => (p.precio - p.precioOferta) / p.precio;
  const ofertas = productosService.enOferta(productos).sort((a, b) => descuento(b) - descuento(a));
  const ahorroMaximo = ofertas.reduce((max, p) => Math.max(max, p.precio - p.precioOferta), 0);

  return (
    <>
      <EncabezadoPagina titulo="Ofertas" subtitulo={`${ofertas.length} productos con descuento · ahorra hasta ${formatearPrecio(ahorroMaximo)}`} />
      <ListaProductos
        productos={ofertas}
        categorias={categorias}
        onAgregar={carrito.agregar}
        puedeAgregar={carrito.puedeAgregar}
        mensajeVacio="Por ahora no hay ofertas disponibles."
      />
    </>
  );
}
