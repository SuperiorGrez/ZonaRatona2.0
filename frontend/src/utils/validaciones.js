/**
 * Validaciones de formularios. Son funciones puras: reciben los valores del
 * formulario y devuelven un objeto { campo: 'mensaje de error' }.
 * Si el objeto está vacío, el formulario es válido.
 */

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function esEmailValido(email) {
  return REGEX_EMAIL.test(String(email || '').trim());
}

export function esVacio(valor) {
  return valor === undefined || valor === null || String(valor).trim() === '';
}

/** Mínimo 6 caracteres, una mayúscula y un número. */
export function validarClave(clave) {
  if (esVacio(clave)) return 'La contraseña es obligatoria.';
  if (clave.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
  if (!/[A-Z]/.test(clave)) return 'La contraseña debe tener al menos una mayúscula.';
  if (!/[0-9]/.test(clave)) return 'La contraseña debe tener al menos un número.';
  return '';
}

export function hayErrores(errores) {
  return Object.keys(errores).length > 0;
}

export function validarLogin({ usuario, clave }) {
  const errores = {};
  if (esVacio(usuario)) errores.usuario = 'Ingresa tu usuario o correo.';
  if (esVacio(clave)) errores.clave = 'Ingresa tu contraseña.';
  return errores;
}

export function validarRegistro(datos) {
  const errores = {};
  if (esVacio(datos.nombre)) errores.nombre = 'El nombre es obligatorio.';
  if (esVacio(datos.apellidos)) errores.apellidos = 'Los apellidos son obligatorios.';
  if (esVacio(datos.usuario)) errores.usuario = 'El nombre de usuario es obligatorio.';
  else if (!/^[a-zA-Z0-9_]{4,20}$/.test(datos.usuario)) errores.usuario = 'Usa entre 4 y 20 letras, números o guion bajo.';
  if (!esEmailValido(datos.email)) errores.email = 'Ingresa un correo válido.';
  const errorClave = validarClave(datos.clave || '');
  if (errorClave) errores.clave = errorClave;
  if (datos.clave !== datos.confirmarClave) errores.confirmarClave = 'Las contraseñas no coinciden.';
  if (datos.telefono && !/^\+?[0-9]{8,12}$/.test(datos.telefono)) errores.telefono = 'Teléfono inválido (8 a 12 dígitos).';
  if (!datos.terminos) errores.terminos = 'Debes aceptar los términos y condiciones.';
  return errores;
}

export function validarContacto(datos) {
  const errores = {};
  if (esVacio(datos.nombre)) errores.nombre = 'El nombre es obligatorio.';
  if (!esEmailValido(datos.email)) errores.email = 'Ingresa un correo válido.';
  if (esVacio(datos.asunto)) errores.asunto = 'Selecciona un asunto.';
  if (esVacio(datos.mensaje)) errores.mensaje = 'Escribe tu mensaje.';
  else if (datos.mensaje.trim().length < 10) errores.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
  return errores;
}

export function validarProducto(datos) {
  const errores = {};
  if (esVacio(datos.codigo)) errores.codigo = 'El código es obligatorio.';
  if (esVacio(datos.nombre)) errores.nombre = 'El nombre es obligatorio.';
  if (esVacio(datos.categoriaId)) errores.categoriaId = 'Selecciona una categoría.';
  const precio = Number(datos.precio);
  if (esVacio(datos.precio) || Number.isNaN(precio)) errores.precio = 'El precio debe ser un número.';
  else if (precio < 0) errores.precio = 'El precio no puede ser negativo.';
  if (!esVacio(datos.precioOferta)) {
    const oferta = Number(datos.precioOferta);
    if (Number.isNaN(oferta) || oferta <= 0) errores.precioOferta = 'El precio oferta debe ser mayor a 0.';
    else if (!errores.precio && oferta >= precio) errores.precioOferta = 'El precio oferta debe ser menor al precio normal.';
  }
  const stock = Number(datos.stock);
  if (esVacio(datos.stock) || !Number.isInteger(stock)) errores.stock = 'El stock debe ser un número entero.';
  else if (stock < 0) errores.stock = 'El stock no puede ser negativo.';
  const critico = Number(datos.stockCritico);
  if (esVacio(datos.stockCritico) || !Number.isInteger(critico) || critico < 0) errores.stockCritico = 'Stock crítico inválido.';
  return errores;
}

export function validarCategoria(datos) {
  const errores = {};
  if (esVacio(datos.nombre)) errores.nombre = 'El nombre es obligatorio.';
  const limite = Number(datos.limitePorProducto);
  if (!Number.isInteger(limite) || limite < 1) errores.limitePorProducto = 'El límite debe ser un entero mayor a 0.';
  return errores;
}

export function validarUsuario(datos, { claveObligatoria = true } = {}) {
  const errores = {};
  if (esVacio(datos.nombre)) errores.nombre = 'El nombre es obligatorio.';
  if (esVacio(datos.apellidos)) errores.apellidos = 'Los apellidos son obligatorios.';
  if (esVacio(datos.usuario)) errores.usuario = 'El usuario es obligatorio.';
  if (!esEmailValido(datos.email)) errores.email = 'Ingresa un correo válido.';
  if (claveObligatoria || !esVacio(datos.clave)) {
    const errorClave = validarClave(datos.clave || '');
    if (errorClave) errores.clave = errorClave;
  }
  if (!['admin', 'user'].includes(datos.rol)) errores.rol = 'Selecciona un rol válido.';
  return errores;
}

export function validarCheckout(datos) {
  const errores = {};
  if (esVacio(datos.nombre)) errores.nombre = 'El nombre es obligatorio.';
  if (esVacio(datos.apellidos)) errores.apellidos = 'Los apellidos son obligatorios.';
  if (!esEmailValido(datos.email)) errores.email = 'Ingresa un correo válido.';
  if (datos.entrega === 'domicilio') {
    if (esVacio(datos.calle)) errores.calle = 'La calle es obligatoria.';
    if (esVacio(datos.region)) errores.region = 'Selecciona una región.';
    if (esVacio(datos.comuna)) errores.comuna = 'Selecciona una comuna.';
  }
  const tarjeta = String(datos.numeroTarjeta || '').replace(/\s/g, '');
  if (!/^[0-9]{16}$/.test(tarjeta)) errores.numeroTarjeta = 'La tarjeta debe tener 16 dígitos.';
  if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(datos.vencimiento || '')) errores.vencimiento = 'Formato MM/AA.';
  if (!/^[0-9]{3,4}$/.test(datos.cvv || '')) errores.cvv = 'CVV inválido.';
  return errores;
}
