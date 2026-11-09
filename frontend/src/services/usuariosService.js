import { api } from './api';
import { validarUsuario, hayErrores } from '../utils/validaciones';

function normalizar(datos) {
  const usuario = {
    usuario: String(datos.usuario).trim(),
    nombre: String(datos.nombre).trim(),
    apellidos: String(datos.apellidos).trim(),
    email: String(datos.email).trim().toLowerCase(),
    telefono: String(datos.telefono || '').trim(),
    rol: datos.rol || 'user',
    activo: datos.activo !== undefined ? Boolean(datos.activo) : true,
    direccion: {
      calle: datos.calle || '',
      departamento: datos.departamento || '',
      region: datos.region || '',
      comuna: datos.comuna || '',
      indicaciones: datos.indicaciones || '',
    },
  };
  if (datos.clave) usuario.clave = datos.clave;
  return usuario;
}

async function verificarUnicos(datos, idExcluido, errores) {
  const usuario = String(datos.usuario || '').trim().toLowerCase();
  const email = String(datos.email || '').trim().toLowerCase();
  const otros = (await api('/usuarios')).filter((u) => u.id !== Number(idExcluido));
  if (!errores.usuario && otros.some((u) => u.usuario.toLowerCase() === usuario)) errores.usuario = 'El usuario ya existe.';
  if (!errores.email && otros.some((u) => u.email.toLowerCase() === email)) errores.email = 'El correo ya está registrado.';
}

export function sinClave(usuario) {
  if (!usuario) return null;
  const { clave, ...resto } = usuario;
  return resto;
}

const usuariosService = {
  listar: async () => (await api('/usuarios')).map(sinClave),

  obtener: async (id) => sinClave(await api(`/usuarios/${id}`)),

  async buscarPorIdentificador(identificador) {
    const buscado = String(identificador || '').trim().toLowerCase();
    const usuarios = await api('/usuarios');
    return usuarios.find((u) => u.usuario.toLowerCase() === buscado || u.email.toLowerCase() === buscado) || null;
  },

  async crear(datos) {
    const errores = validarUsuario(datos, { claveObligatoria: true });
    await verificarUnicos(datos, null, errores);
    if (hayErrores(errores)) return { ok: false, errores };
    const nuevo = await api('/usuarios', 'POST', { ...normalizar(datos), fechaRegistro: new Date().toISOString().slice(0, 10) });
    return { ok: true, usuario: sinClave(nuevo) };
  },

  async actualizar(id, datos) {
    const errores = validarUsuario(datos, { claveObligatoria: false });
    await verificarUnicos(datos, id, errores);
    if (hayErrores(errores)) return { ok: false, errores };
    return { ok: true, usuario: sinClave(await api(`/usuarios/${id}`, 'PATCH', normalizar(datos))) };
  },

  cambiarEstado: async (id, activo) => sinClave(await api(`/usuarios/${id}`, 'PATCH', { activo })),

  nuevosDelMes(usuarios, hoy = new Date()) {
    const prefijo = hoy.toISOString().slice(0, 7);
    return usuarios.filter((u) => (u.fechaRegistro || '').startsWith(prefijo)).length;
  },
};

export default usuariosService;
