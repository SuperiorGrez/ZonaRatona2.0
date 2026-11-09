import { api } from './api';
import productosService from './productosService';

export const COSTO_ENVIO = 3990;
export const SUFIJO_TARJETA_RECHAZADA = '0002';

const ordenesService = {
  listar: () => api('/ordenes'),

  obtener: (id) => api(`/ordenes/${id}`),

  delUsuario: (usuarioId) => api(`/ordenes?usuarioId=${usuarioId}`),

  actualizarEstado: (id, estado) => api(`/ordenes/${id}`, 'PATCH', { estado }),

  async procesarPago({ detalle, cliente, direccion, entrega, numeroTarjeta, usuarioId = null }) {
    const tarjeta = String(numeroTarjeta || '').replace(/\s/g, '');
    let motivo = '';

    for (const item of detalle) {
      const actual = await productosService.obtener(item.productoId);
      if (!actual || !actual.activo || actual.stock < item.cantidad) {
        motivo = `Stock insuficiente para "${item.producto.nombre}".`;
        break;
      }
    }
    if (!motivo && tarjeta.endsWith(SUFIJO_TARJETA_RECHAZADA)) {
      motivo = 'Tarjeta rechazada por el banco emisor.';
    }

    const costoEnvio = entrega === 'domicilio' ? COSTO_ENVIO : 0;
    const items = detalle.map((i) => ({
      productoId: i.productoId,
      nombre: i.producto.nombre,
      imagen: i.producto.imagen,
      precio: i.precio,
      cantidad: i.cantidad,
    }));
    const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const ahora = new Date();

    const orden = await api('/ordenes', 'POST', {
      fecha: ahora.toISOString(),
      usuarioId,
      estado: motivo ? 'rechazada' : 'pagada',
      motivo,
      cliente,
      direccion,
      entrega,
      costoEnvio,
      metodoPago: `Tarjeta terminada en ${tarjeta.slice(-4)}`,
      items,
      total: subtotal + costoEnvio,
    });
    const completa = await api(`/ordenes/${orden.id}`, 'PATCH', {
      numero: ahora.toISOString().slice(0, 10).replace(/-/g, '') + String(orden.id).padStart(3, '0'),
      codigo: 'ORDER' + String(orden.id).padStart(5, '0'),
    });

    if (!motivo) await productosService.descontarStock(items);
    return completa;
  },

  resumen(ordenes) {
    const pagadas = ordenes.filter((o) => o.estado !== 'rechazada');
    return {
      total: ordenes.length,
      pagadas: pagadas.length,
      ventas: pagadas.reduce((s, o) => s + o.total, 0),
    };
  },
};

export default ordenesService;
