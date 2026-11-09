import { api } from './api';
import { validarCategoria, hayErrores } from '../utils/validaciones';

function normalizar(datos) {
  return {
    nombre: String(datos.nombre).trim(),
    descripcion: String(datos.descripcion || '').trim(),
    limitePorProducto: Number(datos.limitePorProducto),
    imagen: String(datos.imagen || '').trim(),
  };
}

async function nombreRepetido(nombre, idExcluido) {
  const buscado = String(nombre || '').trim().toLowerCase();
  const categorias = await api('/categorias');
  return categorias.some((c) => c.nombre.toLowerCase() === buscado && c.id !== Number(idExcluido));
}

const categoriasService = {
  listar: () => api('/categorias'),

  obtener: (id) => api(`/categorias/${id}`),

  async crear(datos) {
    const errores = validarCategoria(datos);
    if (!errores.nombre && (await nombreRepetido(datos.nombre))) errores.nombre = 'Ya existe una categoría con ese nombre.';
    if (hayErrores(errores)) return { ok: false, errores };
    return { ok: true, categoria: await api('/categorias', 'POST', normalizar(datos)) };
  },

  async actualizar(id, datos) {
    const errores = validarCategoria(datos);
    if (!errores.nombre && (await nombreRepetido(datos.nombre, id))) errores.nombre = 'Ya existe una categoría con ese nombre.';
    if (hayErrores(errores)) return { ok: false, errores };
    return { ok: true, categoria: await api(`/categorias/${id}`, 'PATCH', normalizar(datos)) };
  },

  /** No se permite eliminar una categoría que todavía tiene productos. */
  async eliminar(id) {
    const enUso = await api(`/productos?categoriaId=${id}`);
    if (enUso.length > 0) return { ok: false, error: `La categoría tiene ${enUso.length} producto(s) asociados.` };
    await api(`/categorias/${id}`, 'DELETE');
    return { ok: true };
  },

  nombreDe(categoriaId, categorias) {
    const categoria = categorias.find((c) => c.id === Number(categoriaId));
    return categoria ? categoria.nombre : 'Sin categoría';
  },
};

export default categoriasService;
