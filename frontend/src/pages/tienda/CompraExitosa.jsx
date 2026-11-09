import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DetalleOrden from '../../components/DetalleOrden';
import EstadoVacio from '../../components/EstadoVacio';
import Alerta from '../../components/Alerta';
import ordenesService from '../../services/ordenesService';

export default function CompraExitosa() {
  const { id } = useParams();
  const [mensaje, setMensaje] = useState('');
  const [orden, setOrden] = useState(undefined);

  useEffect(() => {
    ordenesService.obtener(id).then(setOrden).catch(() => setOrden(null));
  }, [id]);

  if (orden === undefined) return <EstadoVacio titulo="Cargando..." />;
  if (!orden || orden.estado !== 'pagada') {
    return <EstadoVacio titulo="Orden no encontrada" />;
  }

  return (
    <div className="tarjeta mx-auto max-w-4xl p-4 md:p-6">
      <h1 className="text-2xl font-bold text-green-600 md:text-3xl">✔ Se ha realizado la compra. nro #{orden.numero}</h1>
      <p className="mb-4 text-gray-500">¡Gracias por tu compra! Te enviamos el detalle a {orden.cliente.email}.</p>
      <Alerta tipo="exito" mensaje={mensaje} onCerrar={() => setMensaje('')} />
      <DetalleOrden orden={orden} />
      <div className="no-imprimir mt-6 flex flex-wrap justify-center gap-2">
        <button type="button" className="btn btn-rojo" onClick={() => window.print()}>
          Imprimir boleta en PDF
        </button>
        <button type="button" className="btn btn-verde" onClick={() => setMensaje(`Boleta enviada a ${orden.cliente.email}`)}>
          Enviar boleta por email
        </button>
        <Link to="/productos" className="btn btn-borde text-gray-700">Seguir comprando</Link>
      </div>
    </div>
  );
}
