import { Link, useLocation, useNavigate } from 'react-router-dom';
import EstadoVacio from '../../components/EstadoVacio';
import TablaItems from '../../components/TablaItems';
import FormularioCheckout from '../../components/FormularioCheckout';
import ordenesService from '../../services/ordenesService';
import { formatearPrecio } from '../../utils/formato';

function datosIniciales(usuario, ordenAnterior) {
  if (ordenAnterior) {
    return { ...ordenAnterior.cliente, ...ordenAnterior.direccion, entrega: ordenAnterior.entrega };
  }
  if (usuario) {
    return { nombre: usuario.nombre, apellidos: usuario.apellidos, email: usuario.email, ...(usuario.direccion || {}) };
  }
  return {};
}

export default function Checkout({ usuario, carrito, onCompraRealizada }) {
  const { detalle, total } = carrito;
  const navegar = useNavigate();
  const ubicacion = useLocation();

  if (detalle.length === 0) {
    return (
      <EstadoVacio titulo="No hay productos para pagar" mensaje="Tu carrito está vacío.">
        <Link to="/productos" className="btn btn-amarillo">Ir al catálogo</Link>
      </EstadoVacio>
    );
  }

  async function pagar(datos) {
    const orden = await ordenesService.procesarPago({
      detalle,
      usuarioId: usuario ? usuario.id : null,
      entrega: datos.entrega,
      numeroTarjeta: datos.numeroTarjeta,
      cliente: { nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim(), email: datos.email.trim() },
      direccion: {
        calle: datos.calle,
        departamento: datos.departamento,
        region: datos.region,
        comuna: datos.comuna,
        indicaciones: datos.indicaciones,
      },
    });
    if (orden.estado === 'pagada') {
      await onCompraRealizada();
      navegar(`/compra/exitosa/${orden.id}`);
    } else {
      navegar(`/compra/error/${orden.id}`);
    }
  }

  const items = detalle.map((i) => ({ productoId: i.productoId, nombre: i.producto.nombre, imagen: i.producto.imagen, precio: i.precio, cantidad: i.cantidad }));

  return (
    <div className="tarjeta mx-auto max-w-4xl p-4 md:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold">Carrito de compra</h1>
          <p className="text-sm text-gray-500">Completa la siguiente información</p>
        </div>
        <span className="rounded-md bg-blue-600 px-3 py-2 font-bold text-white">Subtotal: {formatearPrecio(total)}</span>
      </div>
      <TablaItems items={items} />
      {!usuario && (
        <div className="mt-4 rounded-md bg-sky-100 px-4 py-3 text-sm font-semibold text-sky-800">
          ¿Tienes cuenta?{' '}
          <Link to="/login" state={{ desde: '/checkout' }} className="underline">
            Inicia sesión
          </Link>{' '}
          y completaremos tus datos automáticamente.
        </div>
      )}
      <hr className="my-6" />
      <FormularioCheckout inicial={datosIniciales(usuario, ubicacion.state?.reintento)} subtotal={total} onPagar={pagar} />
    </div>
  );
}
