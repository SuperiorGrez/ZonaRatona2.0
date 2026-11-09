import { useState } from 'react';
import CampoFormulario from './CampoFormulario';
import SelectorRegionComuna from './SelectorRegionComuna';
import { validarCheckout, hayErrores } from '../utils/validaciones';
import { manejarCambio } from '../utils/formularios';
import { formatearPrecio } from '../utils/formato';
import { COSTO_ENVIO } from '../services/ordenesService';

const CHECKOUT_VACIO = {
  nombre: '',
  apellidos: '',
  email: '',
  entrega: 'domicilio',
  calle: '',
  departamento: '',
  region: '',
  comuna: '',
  indicaciones: '',
  numeroTarjeta: '',
  vencimiento: '',
  cvv: '',
};

function formatearTarjeta(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

export default function FormularioCheckout({ inicial, subtotal, onPagar }) {
  const [valores, setValores] = useState({ ...CHECKOUT_VACIO, ...inicial });
  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);
  const cambiar = (e) => manejarCambio(e, setValores, setErrores);
  const envio = valores.entrega === 'domicilio' ? COSTO_ENVIO : 0;
  const total = subtotal + envio;

  async function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarCheckout(valores);
    if (hayErrores(encontrados)) {
      setErrores(encontrados);
      return;
    }
    setProcesando(true);
    await onPagar({ ...valores, total });
    setProcesando(false);
  }

  return (
    <form onSubmit={enviar} noValidate>
      <h2 className="text-xl font-bold">Información del cliente</h2>
      <p className="mb-3 text-sm text-gray-500">Completa la siguiente información</p>
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <CampoFormulario etiqueta="Nombre" nombre="nombre" valor={valores.nombre} onChange={cambiar} error={errores.nombre} requerido />
        <CampoFormulario etiqueta="Apellidos" nombre="apellidos" valor={valores.apellidos} onChange={cambiar} error={errores.apellidos} requerido />
        <CampoFormulario etiqueta="Correo" nombre="email" tipo="email" valor={valores.email} onChange={cambiar} error={errores.email} requerido />
      </div>

      <h2 className="mb-2 text-xl font-bold">Opción de entrega</h2>
      <div className="mb-4 flex flex-wrap gap-6 font-semibold">
        <label className="flex items-center gap-2">
          <input type="radio" name="entrega" value="domicilio" className="accent-amarillo" checked={valores.entrega === 'domicilio'} onChange={cambiar} />
          Despacho a domicilio ({formatearPrecio(COSTO_ENVIO)})
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="entrega" value="retiro" className="accent-amarillo" checked={valores.entrega === 'retiro'} onChange={cambiar} />
          Retiro en tienda (gratis)
        </label>
      </div>

      {valores.entrega === 'domicilio' && (
        <div className="mb-6">
          <h2 className="text-xl font-bold">Dirección de entrega de los productos</h2>
          <p className="mb-3 text-sm text-gray-500">Ingrese dirección de forma detallada</p>
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <CampoFormulario className="md:col-span-2" etiqueta="Calle" nombre="calle" valor={valores.calle} onChange={cambiar} error={errores.calle} requerido />
            <CampoFormulario etiqueta="Departamento (opcional)" nombre="departamento" valor={valores.departamento} onChange={cambiar} placeholder="Ej: 603" />
          </div>
          <SelectorRegionComuna region={valores.region} comuna={valores.comuna} onChange={cambiar} errores={errores} />
          <CampoFormulario
            className="mt-4"
            como="textarea"
            rows={2}
            etiqueta="Indicaciones para la entrega (opcional)"
            nombre="indicaciones"
            valor={valores.indicaciones}
            onChange={cambiar}
            placeholder="Ej.: Entre calles, color del edificio, no tiene timbre."
          />
        </div>
      )}

      <h2 className="mb-2 text-xl font-bold">Pago con tarjeta</h2>
      <div className="grid gap-4 md:grid-cols-4">
        <CampoFormulario
          className="md:col-span-2"
          etiqueta="Número de tarjeta"
          nombre="numeroTarjeta"
          valor={valores.numeroTarjeta}
          onChange={(e) => setValores((v) => ({ ...v, numeroTarjeta: formatearTarjeta(e.target.value) }))}
          error={errores.numeroTarjeta}
          requerido
          inputMode="numeric"
          placeholder="4242 4242 4242 4242"
          ayuda="Prueba: una tarjeta terminada en 0002 simula un pago rechazado."
        />
        <CampoFormulario etiqueta="Vencimiento" nombre="vencimiento" valor={valores.vencimiento} onChange={cambiar} error={errores.vencimiento} requerido placeholder="MM/AA" maxLength={5} />
        <CampoFormulario etiqueta="CVV" nombre="cvv" tipo="password" valor={valores.cvv} onChange={cambiar} error={errores.cvv} requerido maxLength={4} inputMode="numeric" />
      </div>

      <div className="mt-6 flex justify-end">
        <button type="submit" className="btn btn-verde px-6 py-3 text-lg" disabled={procesando}>
          {procesando ? 'Procesando pago...' : `Pagar ahora ${formatearPrecio(total)}`}
        </button>
      </div>
    </form>
  );
}
