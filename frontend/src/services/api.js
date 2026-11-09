/**
 * Cliente HTTP para json-server.
 * json-server expone db.json como una API REST en http://localhost:3001:
 *   GET    /productos        → lista
 *   GET    /productos/5      → uno
 *   POST   /productos        → crear
 *   PATCH  /productos/5      → actualizar campos
 *   DELETE /productos/5      → eliminar
 */
export const API_URL = 'http://localhost:3001';

export async function api(ruta, metodo = 'GET', datos) {
  let respuesta;
  try {
    respuesta = await fetch(API_URL + ruta, {
      method: metodo,
      headers: datos ? { 'Content-Type': 'application/json' } : undefined,
      body: datos ? JSON.stringify(datos) : undefined,
    });
  } catch (e) {
    throw new Error('No se pudo conectar con el servidor. ¿Ejecutaste "npm run server"?');
  }
  if (respuesta.status === 404) return null;
  if (!respuesta.ok) throw new Error(`Error ${respuesta.status} al consultar ${ruta}`);
  return respuesta.json();
}
