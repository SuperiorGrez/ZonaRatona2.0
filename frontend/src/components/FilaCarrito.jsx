import { Link } from 'react-router-dom';
import ImagenProducto from './ImagenProducto';
import SelectorCantidad from './SelectorCantidad';
import { formatearPrecio } from '../utils/formato';

export default function FilaCarrito({ item, maximo, onCambiarCantidad, onQuitar }) {
  const { producto } = item;
  return (
    <tr>
      <td>
        <ImagenProducto src={producto.imagen} alt={producto.nombre} className="miniatura" />
      </td>
      <td className="font-semibold">
        <Link to={`/productos/${producto.id}`} className="underline">
          {producto.nombre}
        </Link>
        <div className="text-xs text-gray-500">Máx. {maximo} por compra</div>
      </td>
      <td className="text-right">{formatearPrecio(item.precio)}</td>
      <td>
        <SelectorCantidad cantidad={item.cantidad} minimo={1} maximo={maximo} onCambiar={(cantidad) => onCambiarCantidad(producto.id, cantidad)} />
      </td>
      <td className="text-right font-bold">{formatearPrecio(item.subtotal)}</td>
      <td className="text-right">
        <button type="button" className="btn btn-sm btn-rojo" onClick={() => onQuitar(producto.id)} aria-label={`Eliminar ${producto.nombre}`}>
          Quitar
        </button>
      </td>
    </tr>
  );
}
