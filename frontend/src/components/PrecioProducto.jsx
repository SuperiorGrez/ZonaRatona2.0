import { formatearPrecio, porcentajeDescuento } from '../utils/formato';

/** Muestra el precio; si hay oferta, tacha el precio normal y muestra el descuento. */
export default function PrecioProducto({ precio, precioOferta, grande = false }) {
  const descuento = porcentajeDescuento(precio, precioOferta);
  const tamano = grande ? 'text-3xl' : 'text-xl';

  if (!descuento) {
    return <div className={`font-bold ${tamano}`}>{formatearPrecio(precio)}</div>;
  }
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={`font-bold text-red-600 ${tamano}`}>{formatearPrecio(precioOferta)}</span>
      <del className="text-sm text-gray-500">{formatearPrecio(precio)}</del>
      <span className="badge bg-red-600 text-white">-{descuento}%</span>
    </div>
  );
}
