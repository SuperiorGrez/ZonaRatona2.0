import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DetalleOrden from '../../components/DetalleOrden';
import EstadoVacio from '../../components/EstadoVacio';
import ordenesService from '../../services/ordenesService';

/** Pago rechazado: muestra el motivo y permite reintentar con los mismos datos. */
export default function CompraFallida() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [orden, setOrden] = useState(undefined);

  useEffect(() => {
    ordenesService.obtener(id).then(setOrden).catch(() => setOrden(null));
  }, [id]);

  if (orden === undefined) return <EstadoVacio titulo="Cargando..." />;
  if (!orden || orden.estado !== 'rechazada') {
    return <EstadoVacio titulo="Orden no encontrada" />;
  }

  return (
    <div className="tarjeta mx-auto max-w-4xl p-4 md:p-6">
      <h1 className="text-2xl font-bold text-red-600 md:text-3xl">✖ No se pudo realizar el pago. nro #{orden.numero}</h1>
      <p className="mt-1 font-semibold" role="alert">Motivo: {orden.motivo}</p>
      <p className="text-sm text-gray-500">Tus productos siguen en el carrito. Revisa tus datos e inténtalo nuevamente.</p>
      <div className="my-6 text-center">
        <button type="button" className="btn btn-verde px-6 py-3 text-lg" onClick={() => navegar('/checkout', { state: { reintento: orden } })}>
          VOLVER A REALIZAR EL PAGO
        </button>
      </div>
      <DetalleOrden orden={orden} />
    </div>
  );
}
