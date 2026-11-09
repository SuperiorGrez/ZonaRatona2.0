import { api } from './api';

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
