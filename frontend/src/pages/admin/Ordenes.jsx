import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import ordenesService from '../../services/ordenesService';
import { formatearFecha, formatearPrecio } from '../../utils/formato';

export const ESTADOS = {
  pagada: { texto: 'Pagada', color: 'bg-green-600' },
  rechazada: { texto: 'Rechazada', color: 'bg-red-600' },
  enviada: { texto: 'Enviada', color: 'bg-sky-600' },
  entregada: { texto: 'Entregada', color: 'bg-blue-700' },
};

export function BadgeEstado({ estado }) {
  const e = ESTADOS[estado] || { texto: estado, color: 'bg-gray-500' };
  return <span className={`badge text-white ${e.color}`}>{e.texto}</span>;
}

/** Listado de órdenes / boletas con filtro por estado y búsqueda. */
export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [estado, setEstado] = useState('');
  const [texto, setTexto] = useState('');

  useEffect(() => {
    ordenesService.listar().then(setOrdenes);
  }, []);

  const buscado = texto.trim().toLowerCase();
  const filtradas = [...ordenes]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .filter((o) => !estado || o.estado === estado)
    .filter((o) => !buscado || `${o.numero} ${o.cliente.nombre} ${o.cliente.apellidos} ${o.cliente.email}`.toLowerCase().includes(buscado));

  return (
    <>
      <EncabezadoPagina titulo="Órdenes / Boletas" subtitulo={`${ordenes.length} órdenes registradas`} />
      <div className="mb-4 grid gap-2 md:grid-cols-3">
        <input type="search" className="campo md:col-span-2" placeholder="Buscar por número, cliente o correo" aria-label="Buscar órdenes" value={texto} onChange={(e) => setTexto(e.target.value)} />
        <select className="campo" aria-label="Filtrar por estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {Object.entries(ESTADOS).map(([clave, e]) => (
            <option key={clave} value={clave}>
              {e.texto}
            </option>
          ))}
        </select>
      </div>
      <div className="panel overflow-x-auto p-2">
        <table className="tabla">
          <thead>
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th className="text-right">Total</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((o) => (
              <tr key={o.id}>
                <td className="font-bold">#{o.numero}</td>
                <td>{formatearFecha(o.fecha)}</td>
                <td>
                  {o.cliente.nombre} {o.cliente.apellidos}
                  <div className="text-xs text-gray-400">{o.cliente.email}</div>
                </td>
                <td className="text-right">{formatearPrecio(o.total)}</td>
                <td><BadgeEstado estado={o.estado} /></td>
                <td className="text-right">
                  <Link to={`/admin/ordenes/${o.id}`} className="btn btn-sm btn-borde text-amarillo">Ver boleta</Link>
                </td>
              </tr>
            ))}
            {filtradas.length === 0 && (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-400">No hay órdenes que coincidan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
