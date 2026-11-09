import EncabezadoPagina from '../../components/EncabezadoPagina';
import FormularioContacto from '../../components/FormularioContacto';
import { api } from '../../services/api';

export default function Contacto({ usuario }) {
  async function guardarMensaje(datos) {
    await api('/mensajes', 'POST', { ...datos, fecha: new Date().toISOString(), leido: false });
  }

  return (
    <>
      <EncabezadoPagina titulo="Contacto" subtitulo="¿Tienes dudas? Escríbenos y te responderemos a la brevedad." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="tarjeta p-6 lg:col-span-2">
          <FormularioContacto onEnviar={guardarMensaje} inicial={usuario ? { nombre: `${usuario.nombre} ${usuario.apellidos}`, email: usuario.email } : {}} />
        </div>
        <div className="tarjeta space-y-2 p-6">
          <h2 className="text-xl font-bold">Nuestra tienda</h2>
          <p>📍 Av. Providencia 1234, Providencia</p>
          <p>📞 +56 2 2345 6789</p>
          <p>✉️ contacto@zonaratona.cl</p>
          <p>🕙 Lunes a sábado, 10:00 a 20:00</p>
        </div>
      </div>
    </>
  );
}
