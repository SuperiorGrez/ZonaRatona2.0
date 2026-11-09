import ImagenProducto from './ImagenProducto';
import { formatearPrecio } from '../utils/formato';

export default function TablaItems({ items }) {
  return (
    <div className="overflow-x-auto">
      <table className="tabla">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th className="text-right">Precio</th>
            <th className="text-center">Cantidad</th>
            <th className="text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.productoId}>
              <td>
                <ImagenProducto src={item.imagen} alt={item.nombre} className="miniatura" />
              </td>
              <td className="font-semibold">{item.nombre}</td>
              <td className="text-right">{formatearPrecio(item.precio)}</td>
              <td className="text-center">{item.cantidad}</td>
              <td className="text-right font-bold">{formatearPrecio(item.precio * item.cantidad)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
