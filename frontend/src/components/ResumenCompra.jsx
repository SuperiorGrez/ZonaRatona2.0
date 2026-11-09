import { formatearPrecio } from '../utils/formato';

/** Resumen de montos de una compra: subtotal, envío y total. */
export default function ResumenCompra({ subtotal, envio = 0, children }) {
  return (
    <div className="tarjeta p-5">
      <h2 className="mb-3 text-xl font-bold">Resumen</h2>
      <div className="mb-1 flex justify-between">
        <span>Subtotal</span>
        <span>{formatearPrecio(subtotal)}</span>
      </div>
      <div className="mb-3 flex justify-between">
        <span>Envío</span>
        <span>{envio > 0 ? formatearPrecio(envio) : 'Gratis'}</span>
      </div>
      <div className="flex justify-between border-t pt-3 text-xl font-bold">
        <span>Total</span>
        <span>{formatearPrecio(subtotal + envio)}</span>
      </div>
      {children && <div className="mt-4 grid gap-2">{children}</div>}
    </div>
  );
}
