import TablaItems from './TablaItems';
import { formatearFecha, formatearPrecio } from '../utils/formato';

function Dato({ etiqueta, valor, ancho = '' }) {
  return (
    <div className={ancho}>
      <div className="text-sm font-semibold text-gray-500">{etiqueta}</div>
      <div className="rounded-md bg-gray-100 px-3 py-2 text-gray-900">{valor || '—'}</div>
    </div>
  );
}

export default function DetalleOrden({ orden }) {
  const { cliente, direccion } = orden;
  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-between text-sm font-semibold text-gray-500">
        <span>Fecha: {formatearFecha(orden.fecha)}</span>
        <span>Código orden: {orden.codigo}</span>
      </div>

      <h3 className="mb-2 font-bold">Información del cliente</h3>
      <div className="mb-4 grid gap-2 md:grid-cols-3">
        <Dato etiqueta="Nombre" valor={cliente.nombre} />
        <Dato etiqueta="Apellidos" valor={cliente.apellidos} />
        <Dato etiqueta="Correo" valor={cliente.email} />
      </div>

      <h3 className="mb-2 font-bold">{orden.entrega === 'retiro' ? 'Retiro en tienda' : 'Dirección de entrega'}</h3>
      {orden.entrega === 'retiro' ? (
        <p className="mb-4 text-sm">Retiro en tienda ZonaRatona — Av. Providencia 1234, Providencia.</p>
      ) : (
        <div className="mb-4 grid gap-2 md:grid-cols-2">
          <Dato etiqueta="Calle" valor={direccion.calle} />
          <Dato etiqueta="Departamento" valor={direccion.departamento} />
          <Dato etiqueta="Región" valor={direccion.region} />
          <Dato etiqueta="Comuna" valor={direccion.comuna} />
          <Dato etiqueta="Indicaciones" valor={direccion.indicaciones} ancho="md:col-span-2" />
        </div>
      )}

      <TablaItems items={orden.items} />

      <div className="mt-4 rounded-lg bg-gray-50 p-4 text-center shadow-inner">
        {orden.costoEnvio > 0 && <div className="text-sm text-gray-500">Incluye envío: {formatearPrecio(orden.costoEnvio)}</div>}
        <div className="text-2xl font-bold">
          Total {orden.estado === 'rechazada' ? 'a pagar' : 'pagado'}: {formatearPrecio(orden.total)}
        </div>
        <div className="text-sm text-gray-500">{orden.metodoPago}</div>
      </div>
    </div>
  );
}
