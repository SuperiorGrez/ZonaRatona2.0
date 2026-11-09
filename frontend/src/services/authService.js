import usuariosService, { sinClave } from './usuariosService';

const KEY_SESION = 'zr_sesion';
const KEY_INTENTOS = 'zr_intentos';
const MAX_INTENTOS = 5;
const BLOQUEO_MS = 60000;
const DURACION_SESION_MS = 30 * 60 * 1000;

function leerIntentos() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY_INTENTOS)) || { n: 0, hasta: 0 };
  } catch (e) {
    return { n: 0, hasta: 0 };
  }
}

function bloqueoRestante() {
  const { hasta } = leerIntentos();
  return hasta > Date.now() ? Math.ceil((hasta - Date.now()) / 1000) : 0;
}

function registrarFallo() {
  const d = leerIntentos();
  d.n += 1;
  const restantes = Math.max(MAX_INTENTOS - d.n, 0);
  let bloqueado = false;
  if (d.n >= MAX_INTENTOS) {
    d.hasta = Date.now() + BLOQUEO_MS;
    d.n = 0;
    bloqueado = true;
  }
  sessionStorage.setItem(KEY_INTENTOS, JSON.stringify(d));
  return { bloqueado, restantes };
}

const authService = {
  async login(identificador, clave) {
    const espera = bloqueoRestante();
    if (espera > 0) return { ok: false, error: `Demasiados intentos fallidos. Espera ${espera} segundos.` };

    const usuario = await usuariosService.buscarPorIdentificador(identificador);
    if (!usuario || usuario.clave !== clave) {
      const { bloqueado, restantes } = registrarFallo();
      if (bloqueado) return { ok: false, error: `Demasiados intentos fallidos. Espera ${BLOQUEO_MS / 1000} segundos.` };
      if (restantes <= 2) return { ok: false, error: `Usuario o contraseña incorrectos. Te quedan ${restantes} intento(s).` };
      return { ok: false, error: 'Usuario o contraseña incorrectos.' };
    }
    if (!usuario.activo) return { ok: false, error: 'Tu cuenta está desactivada.' };

    sessionStorage.removeItem(KEY_INTENTOS);
    const sesion = { ...sinClave(usuario), expire: Date.now() + DURACION_SESION_MS };
    sessionStorage.setItem(KEY_SESION, JSON.stringify(sesion));
    return { ok: true, sesion };
  },

  logout() {
    sessionStorage.removeItem(KEY_SESION);
  },

  sesionActual() {
    try {
      const sesion = JSON.parse(sessionStorage.getItem(KEY_SESION));
      if (!sesion || !sesion.usuario) return null;
      if (sesion.expire && Date.now() > sesion.expire) {
        sessionStorage.removeItem(KEY_SESION);
        return null;
      }
      return sesion;
    } catch (e) {
      return null;
    }
  },

  refrescarSesion(usuario) {
    const sesion = { ...this.sesionActual(), ...sinClave(usuario) };
    sessionStorage.setItem(KEY_SESION, JSON.stringify(sesion));
    return sesion;
  },

  registrar: (datos) => usuariosService.crear({ ...datos, rol: 'user', activo: true }),
};

export default authService;
