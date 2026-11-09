import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import DetalleOrden from '../../components/DetalleOrden';
import EstadoVacio from '../../components/EstadoVacio';
import ordenesService from '../../services/ordenesService';
import { ESTADOS } from './Ordenes';

/** Muestra la boleta de una orden y permite cambiar su estado. */
export default function Boleta() {
  const { id } = useParams();
  const [orden, setOrden] = useState(undefined);

  useEffect(() => {
    ordenesService.obtener(id).then(setOrden);
  }, [id]);

  if (orden === undefined) return <EstadoVacio titulo="Cargando..." />;
  if (!orden) return <EstadoVacio titulo="Orden no encontrada" />;

  async function cambiarEstado(estado) {
    setOrden(await ordenesService.actualizarEstado(orden.id, estado));
  }

  return (
    <>
      <EncabezadoPagina titulo={`Boleta #${orden.numero}`} subtitulo={orden.motivo ? `Motivo de rechazo: ${orden.motivo}` : undefined}>
        <Link to="/admin/ordenes" className="btn btn-borde text-gray-300">Volver</Link>
        <button type="button" className="btn btn-rojo" onClick={() => window.print()}>Imprimir</button>
      </EncabezadoPagina>
      <div className="tarjeta p-4 md:p-6">
        <div className="no-imprimir mb-4 flex flex-wrap items-center gap-2">
          <label htmlFor="estado-orden" className="font-semibold">Estado:</label>
          <select
            id="estado-orden"
            className="campo w-auto"
            value={orden.estado}
            onChange={(e) => cambiarEstado(e.target.value)}
            disabled={orden.estado === 'rechazada'}
          >
            {Object.entries(ESTADOS).map(([clave, e]) => (
              <option key={clave} value={clave} disabled={clave === 'rechazada' && orden.estado !== 'rechazada'}>
                {e.texto}
              </option>
            ))}
          </select>
        </div>
        <DetalleOrden orden={orden} />
      </div>
    </>
  );
}
