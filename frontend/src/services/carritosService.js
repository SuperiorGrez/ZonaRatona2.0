import { api } from './api';

/**
 * Carrito guardado en db.json para usuarios con sesión.
 * Cada carrito usa como id el id del usuario: { id: 2, items: [{ productoId, cantidad }] }
 */
const carritosService = {
  async obtener(usuarioId) {
    const carrito = await api(`/carritos/${usuarioId}`);
    return carrito ? carrito.items : [];
  },

  async guardar(usuarioId, items) {
    const actualizado = await api(`/carritos/${usuarioId}`, 'PUT', { id: usuarioId, items });
    if (!actualizado) await api('/carritos', 'POST', { id: usuarioId, items });
  },
};

export default carritosService;
