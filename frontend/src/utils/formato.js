export function formatearPrecio(valor) {
  const numero = Number(valor) || 0;
  return '$' + numero.toLocaleString('es-CL');
}

export function formatearFecha(iso) {
  if (!iso) return '';
  const fecha = new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(fecha.getTime())) return '';
  return fecha.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function porcentajeDescuento(precio, precioOferta) {
  if (!precioOferta || precioOferta >= precio) return 0;
  return Math.round((1 - precioOferta / precio) * 100);
}

export const IMAGEN_RESPALDO = 'https://placehold.co/400x300/ffffff/111111?text=ZonaRatona';

export function usarImagenRespaldo(evento) {
  if (evento.currentTarget.src !== IMAGEN_RESPALDO) {
    evento.currentTarget.src = IMAGEN_RESPALDO;
  }
}
