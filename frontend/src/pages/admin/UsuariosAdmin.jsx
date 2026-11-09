import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import usuariosService from '../../services/usuariosService';
import { formatearFecha } from '../../utils/formato';

/**
 * Listado de usuarios. El administrador solo puede verlos y
 * activarlos/desactivarlos; no edita sus datos personales.
 * @param usuario el administrador con sesión (no puede desactivarse a sí mismo)
 */
export default function UsuariosAdmin({ usuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [rol, setRol] = useState('');
  const [texto, setTexto] = useState('');

  useEffect(() => {
    usuariosService.listar().then(setUsuarios);
  }, []);

  const buscado = texto.trim().toLowerCase();
  const lista = usuarios
    .filter((u) => !rol || u.rol === rol)
    .filter((u) => !buscado || `${u.nombre} ${u.apellidos} ${u.usuario} ${u.email}`.toLowerCase().includes(buscado));

  async function cambiarEstado(u) {
    const actualizado = await usuariosService.cambiarEstado(u.id, !u.activo);
    setUsuarios((lista) => lista.map((x) => (x.id === u.id ? actualizado : x)));
  }

  return (
    <>
      <EncabezadoPagina titulo="Usuarios" subtitulo={`${usuarios.length} usuarios registrados`} />
      <div className="mb-4 grid gap-2 md:grid-cols-3">
        <input type="search" className="campo md:col-span-2" placeholder="Buscar por nombre, usuario o correo" aria-label="Buscar usuarios" value={texto} onChange={(e) => setTexto(e.target.value)} />
        <select className="campo" aria-label="Filtrar por rol" value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="">Todos los roles</option>
          <option value="admin">Administradores</option>
          <option value="user">Clientes</option>
        </select>
      </div>
      <div className="panel overflow-x-auto p-2">
        <table className="tabla">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Registro</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((u) => (
              <tr key={u.id}>
                <td className="font-semibold">{u.usuario}</td>
                <td>{u.nombre} {u.apellidos}</td>
                <td>{u.email}</td>
                <td><span className={`badge text-white ${u.rol === 'admin' ? 'bg-red-600' : 'bg-gray-500'}`}>{u.rol === 'admin' ? 'Admin' : 'Cliente'}</span></td>
                <td>{u.activo ? <span className="badge bg-green-600 text-white">Activo</span> : <span className="badge bg-neutral-600 text-white">Inactivo</span>}</td>
                <td>{formatearFecha(u.fechaRegistro)}</td>
                <td className="text-right whitespace-nowrap">
                  <Link to={`/admin/usuarios/${u.id}`} className="btn btn-sm btn-borde mr-1 text-sky-400">Ver</Link>
                  {u.id !== usuario.id && (
                    <button type="button" className={`btn btn-sm ${u.activo ? 'btn-rojo' : 'btn-verde'}`} onClick={() => cambiarEstado(u)}>
                      {u.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-400">No hay usuarios que coincidan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
