import { api } from './api';
import { validarProducto, hayErrores } from '../utils/validaciones';
import { precioFinal } from '../utils/carrito';

function normalizar(datos) {
  return {
    codigo: String(datos.codigo).trim().toUpperCase(),
    nombre: String(datos.nombre).trim(),
    descripcion: String(datos.descripcion || '').trim(),
    categoriaId: Number(datos.categoriaId),
    precio: Number(datos.precio),
    precioOferta: datos.precioOferta === '' || datos.precioOferta == null ? null : Number(datos.precioOferta),
    stock: Number(datos.stock),
    stockCritico: Number(datos.stockCritico),
    activo: Boolean(datos.activo),
    imagen: String(datos.imagen || '').trim(),
  };
}

async function codigoRepetido(codigo, idExcluido) {
  const iguales = await api(`/productos?codigo=${encodeURIComponent(codigo)}`);
  return iguales.some((p) => p.id !== Number(idExcluido));
}

/** Servicio de productos: CRUD contra json-server + funciones de consulta. */
const productosService = {
  listar: () => api('/productos'),

  obtener: (id) => api(`/productos/${id}`),

  async crear(datos) {
    const errores = validarProducto(datos);
    const codigo = String(datos.codigo || '').trim().toUpperCase();
    if (!errores.codigo && (await codigoRepetido(codigo))) errores.codigo = 'Ya existe un producto con ese código.';
    if (hayErrores(errores)) return { ok: false, errores };
    return { ok: true, producto: await api('/productos', 'POST', normalizar(datos)) };
  },

  async actualizar(id, datos) {
    const errores = validarProducto(datos);
    const codigo = String(datos.codigo || '').trim().toUpperCase();
    if (!errores.codigo && (await codigoRepetido(codigo, id))) errores.codigo = 'Ya existe un producto con ese código.';
    if (hayErrores(errores)) return { ok: false, errores };
    return { ok: true, producto: await api(`/productos/${id}`, 'PATCH', normalizar(datos)) };
  },

  eliminar: (id) => api(`/productos/${id}`, 'DELETE'),

  /** Descuenta stock luego de una compra exitosa. */
  async descontarStock(items) {
    for (const { productoId, cantidad } of items) {
      const producto = await api(`/productos/${productoId}`);
      if (producto) await api(`/productos/${productoId}`, 'PATCH', { stock: Math.max(producto.stock - cantidad, 0) });
    }
  },

  // ---- Consultas sobre una lista ya cargada (no llaman al servidor) ----

  disponibles: (productos) => productos.filter((p) => p.activo),

  enOferta: (productos) => productos.filter((p) => p.activo && p.precioOferta && p.precioOferta < p.precio),

  criticos: (productos) => productos.filter((p) => p.stock <= p.stockCritico),

  porCategoria: (categoriaId, productos) => productos.filter((p) => p.activo && p.categoriaId === Number(categoriaId)),

  relacionados: (producto, productos, cantidad = 5) =>
    productos.filter((p) => p.activo && p.categoriaId === producto.categoriaId && p.id !== producto.id).slice(0, cantidad),

  /** Filtra y ordena productos: { texto, categoriaId, precioMax, soloStock, orden }. */
  filtrar(productos, { texto = '', categoriaId = '', precioMax = '', soloStock = false, orden = 'relevancia' } = {}) {
    const buscado = texto.trim().toLowerCase();
    const resultado = productos.filter((p) => {
      const coincideTexto = !buscado || `${p.codigo} ${p.nombre}`.toLowerCase().includes(buscado);
      const coincideCategoria = !categoriaId || p.categoriaId === Number(categoriaId);
      const coincidePrecio = !precioMax || precioFinal(p) <= Number(precioMax);
      const coincideStock = !soloStock || p.stock > 0;
      return coincideTexto && coincideCategoria && coincidePrecio && coincideStock;
    });
    const ordenadores = {
      'precio-asc': (a, b) => precioFinal(a) - precioFinal(b),
      'precio-desc': (a, b) => precioFinal(b) - precioFinal(a),
      nombre: (a, b) => a.nombre.localeCompare(b.nombre),
    };
    return ordenadores[orden] ? [...resultado].sort(ordenadores[orden]) : resultado;
  },
};

export default productosService;
