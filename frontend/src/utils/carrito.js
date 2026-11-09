export const LIMITE_POR_DEFECTO = 3;

export function precioFinal(producto) {
  if (!producto) return 0;
  return producto.precioOferta && producto.precioOferta < producto.precio ? producto.precioOferta : producto.precio;
}

export function cantidadEnCarrito(carrito, productoId) {
  const item = carrito.find((i) => i.productoId === productoId);
  return item ? item.cantidad : 0;
}

export function maximoPermitido(producto, categoria) {
  if (!producto || !producto.activo || producto.stock <= 0) return 0;
  const limite = categoria && categoria.limitePorProducto ? categoria.limitePorProducto : LIMITE_POR_DEFECTO;
  return Math.min(producto.stock, limite);
}

export function puedeAgregar(carrito, producto, categoria, cantidad = 1) {
  if (!producto) return false;
  return cantidadEnCarrito(carrito, producto.id) + cantidad <= maximoPermitido(producto, categoria);
}

export function agregarItem(carrito, producto, categoria, cantidad = 1) {
  if (!puedeAgregar(carrito, producto, categoria, cantidad)) return carrito;
  const existe = carrito.some((i) => i.productoId === producto.id);
  if (existe) {
    return carrito.map((i) => (i.productoId === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i));
  }
  return [...carrito, { productoId: producto.id, cantidad }];
}

export function cambiarCantidad(carrito, productoId, cantidad) {
  if (cantidad <= 0) return quitarItem(carrito, productoId);
  return carrito.map((i) => (i.productoId === productoId ? { ...i, cantidad } : i));
}

export function quitarItem(carrito, productoId) {
  return carrito.filter((i) => i.productoId !== productoId);
}

export function detalleCarrito(carrito, productos) {
  return carrito
    .map((item) => {
      const producto = productos.find((p) => p.id === item.productoId);
      if (!producto) return null;
      const precio = precioFinal(producto);
      return { ...item, producto, precio, subtotal: precio * item.cantidad };
    })
    .filter(Boolean);
}

export function totalCarrito(detalle) {
  return detalle.reduce((suma, i) => suma + i.subtotal, 0);
}

export function totalUnidades(carrito) {
  return carrito.reduce((suma, i) => suma + i.cantidad, 0);
}

export function unirCarritos(guardado, visitante) {
  const resultado = guardado.map((i) => ({ ...i }));
  visitante.forEach((item) => {
    const existente = resultado.find((i) => i.productoId === item.productoId);
    if (existente) existente.cantidad = Math.max(existente.cantidad, item.cantidad);
    else resultado.push({ ...item });
  });
  return resultado;
}
