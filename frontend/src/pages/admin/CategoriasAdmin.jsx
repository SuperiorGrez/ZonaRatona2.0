import { useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import ImagenProducto from '../../components/ImagenProducto';
import BotonConfirmar from '../../components/BotonConfirmar';
import Alerta from '../../components/Alerta';
import categoriasService from '../../services/categoriasService';

export default function CategoriasAdmin({ productos, categorias, onCambio }) {
  const [aviso, setAviso] = useState({ mensaje: '', tipo: 'exito' });

  async function eliminar(categoria) {
    const resultado = await categoriasService.eliminar(categoria.id);
    if (resultado.ok) {
      await onCambio();
      setAviso({ mensaje: `Categoría "${categoria.nombre}" eliminada.`, tipo: 'exito' });
    } else {
      setAviso({ mensaje: resultado.error, tipo: 'error' });
    }
  }

  return (
    <>
      <EncabezadoPagina titulo="Categorías" subtitulo={`${categorias.length} categorías`}>
        <Link to="/admin/categorias/nueva" className="btn btn-amarillo">+ Nueva categoría</Link>
      </EncabezadoPagina>
      <Alerta tipo={aviso.tipo} mensaje={aviso.mensaje} onCerrar={() => setAviso({ mensaje: '', tipo: 'exito' })} />
      <div className="panel overflow-x-auto p-2">
        <table className="tabla">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th className="text-center">Productos</th>
              <th className="text-center">Límite/compra</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id}>
                <td><ImagenProducto src={c.imagen} alt={c.nombre} className="miniatura" /></td>
                <td className="font-semibold">{c.nombre}</td>
                <td className="text-gray-400">{c.descripcion}</td>
                <td className="text-center">{productos.filter((p) => p.categoriaId === c.id).length}</td>
                <td className="text-center">{c.limitePorProducto}</td>
                <td className="text-right whitespace-nowrap">
                  <Link to={`/admin/categorias/${c.id}/editar`} className="btn btn-sm btn-borde mr-1 text-amarillo">Editar</Link>
                  <BotonConfirmar etiqueta="Eliminar" pregunta="¿Eliminar?" onConfirmar={() => eliminar(c)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
