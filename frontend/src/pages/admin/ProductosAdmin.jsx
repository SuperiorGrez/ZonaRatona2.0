import { useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import ImagenProducto from '../../components/ImagenProducto';
import BotonConfirmar from '../../components/BotonConfirmar';
import Alerta from '../../components/Alerta';
import productosService from '../../services/productosService';
import categoriasService from '../../services/categoriasService';
import { formatearPrecio } from '../../utils/formato';

function colorStock(p) {
  if (p.stock === 0) return 'bg-red-600';
  if (p.stock <= p.stockCritico) return 'bg-amber-500';
  return 'bg-green-600';
}

/**
 * Tabla de productos (mostrar productos) con acciones de ver, editar y eliminar.
 * onCambio: recarga el catálogo en App después de modificar algo.
 */
export default function ProductosAdmin({ productos, categorias, soloCriticos = false, onCambio }) {
  const [texto, setTexto] = useState('');
  const [mensaje, setMensaje] = useState('');

  const base = soloCriticos ? productosService.criticos(productos) : productos;
  const lista = productosService.filtrar(base, { texto });

  async function eliminar(producto) {
    await productosService.eliminar(producto.id);
    await onCambio();
    setMensaje(`Producto "${producto.nombre}" eliminado.`);
  }

  return (
    <>
      <EncabezadoPagina
        titulo={soloCriticos ? 'Productos críticos' : 'Productos'}
        subtitulo={soloCriticos ? 'Productos con stock igual o menor a su stock crítico.' : `${productos.length} productos registrados`}
      >
        <Link to="/admin/productos/nuevo" className="btn btn-amarillo">+ Nuevo producto</Link>
        {soloCriticos ? (
          <Link to="/admin/productos" className="btn btn-borde text-gray-300">Ver todos</Link>
        ) : (
          <Link to="/admin/productos/criticos" className="btn btn-borde text-red-400">Críticos</Link>
        )}
      </EncabezadoPagina>

      <Alerta tipo="exito" mensaje={mensaje} onCerrar={() => setMensaje('')} />
      <input type="search" className="campo mb-4" placeholder="Buscar por nombre o código" aria-label="Buscar productos" value={texto} onChange={(e) => setTexto(e.target.value)} />

      <div className="panel overflow-x-auto p-2">
        <table className="tabla">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th className="text-right">Precio</th>
              <th className="text-center">Stock</th>
              <th>Estado</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((p) => (
              <tr key={p.id}>
                <td><ImagenProducto src={p.imagen} alt={p.nombre} className="miniatura" /></td>
                <td className="font-semibold">{p.codigo}</td>
                <td className="font-semibold">{p.nombre}</td>
                <td>{categoriasService.nombreDe(p.categoriaId, categorias)}</td>
                <td className="text-right">{formatearPrecio(p.precioOferta || p.precio)}</td>
                <td className="text-center"><span className={`badge text-white ${colorStock(p)}`}>{p.stock}</span></td>
                <td>{p.activo ? <span className="badge bg-green-600 text-white">Activo</span> : <span className="badge bg-gray-500 text-white">Inactivo</span>}</td>
                <td className="text-right whitespace-nowrap">
                  <Link to={`/admin/productos/${p.id}`} className="btn btn-sm btn-borde mr-1 text-sky-400">Ver</Link>
                  <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-borde mr-1 text-amarillo">Editar</Link>
                  <BotonConfirmar etiqueta="Eliminar" pregunta="¿Eliminar?" onConfirmar={() => eliminar(p)} />
                </td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-400">No hay productos para mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
