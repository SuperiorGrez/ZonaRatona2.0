import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import EstadoVacio from '../../components/EstadoVacio';
import ordenesService from '../../services/ordenesService';
import usuariosService from '../../services/usuariosService';
import { formatearFecha, formatearPrecio } from '../../utils/formato';
import { BadgeEstado } from './Ordenes';

/** Vista "Mostrar usuario": datos (solo lectura), estado e historial de compras. */
export default function UsuarioDetalle({ usuario: admin }) {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(undefined);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    usuariosService.obtener(id).then(setUsuario);
    ordenesService.delUsuario(id).then((ordenes) => setHistorial(ordenes.sort((a, b) => b.fecha.localeCompare(a.fecha))));
  }, [id]);

  if (usuario === undefined) return <EstadoVacio titulo="Cargando..." />;
  if (!usuario) return <EstadoVacio titulo="Usuario no encontrado" />;

  const totalGastado = historial.filter((o) => o.estado !== 'rechazada').reduce((s, o) => s + o.total, 0);
  const d = usuario.direccion || {};

  async function cambiarEstado() {
    setUsuario(await usuariosService.cambiarEstado(usuario.id, !usuario.activo));
  }

  return (
    <>
      <EncabezadoPagina titulo={`${usuario.nombre} ${usuario.apellidos}`} subtitulo={`@${usuario.usuario}`}>
        <Link to="/admin/usuarios" className="btn btn-borde text-gray-300">Volver</Link>
        {usuario.id !== admin.id && (
          <button type="button" className={`btn ${usuario.activo ? 'btn-rojo' : 'btn-verde'}`} onClick={cambiarEstado}>
            {usuario.activo ? 'Desactivar cuenta' : 'Activar cuenta'}
          </button>
        )}
      </EncabezadoPagina>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel p-5">
          <h2 className="mb-2 text-xl font-bold">Datos</h2>
          <ul className="space-y-1 text-sm">
            <li><b>Correo:</b> {usuario.email}</li>
            <li><b>Teléfono:</b> {usuario.telefono || '—'}</li>
            <li><b>Rol:</b> {usuario.rol === 'admin' ? 'Administrador' : 'Cliente'}</li>
            <li><b>Estado:</b> {usuario.activo ? 'Activo' : 'Inactivo'}</li>
            <li><b>Registro:</b> {formatearFecha(usuario.fechaRegistro)}</li>
            <li><b>Dirección:</b> {d.calle ? `${d.calle} ${d.departamento}, ${d.comuna}, ${d.region}` : '—'}</li>
          </ul>
        </div>
        <div className="panel p-5 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold">Historial de compras</h2>
            <span className="badge bg-green-600 text-white">Total: {formatearPrecio(totalGastado)}</span>
          </div>
          {historial.length === 0 ? (
            <p className="text-gray-400">Este usuario aún no realiza compras.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="tabla">
                <thead>
                  <tr>
                    <th>N°</th>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th className="text-right">Total</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((o) => (
                    <tr key={o.id}>
                      <td className="font-semibold">#{o.numero}</td>
                      <td>{formatearFecha(o.fecha)}</td>
                      <td>{o.items.map((i) => `${i.nombre} x${i.cantidad}`).join(', ')}</td>
                      <td className="text-right">{formatearPrecio(o.total)}</td>
                      <td><BadgeEstado estado={o.estado} /></td>
                      <td><Link to={`/admin/ordenes/${o.id}`} className="btn btn-sm btn-borde text-amarillo">Boleta</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
