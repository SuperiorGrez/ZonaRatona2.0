/** Tarjeta de métrica para el dashboard. */
export default function TarjetaEstadistica({ titulo, valor, color = 'bg-blue-600 text-white', detalle }) {
  return (
    <div className={`h-full rounded-lg p-5 shadow ${color}`}>
      <div className="text-sm font-semibold uppercase opacity-80">{titulo}</div>
      <div className="text-4xl leading-tight font-bold">{valor}</div>
      {detalle && <div className="mt-1 text-sm">{detalle}</div>}
    </div>
  );
}
