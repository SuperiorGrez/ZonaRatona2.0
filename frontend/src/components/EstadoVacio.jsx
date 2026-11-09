export default function EstadoVacio({ titulo, mensaje, children }) {
  return (
    <div className="tarjeta-oscura px-4 py-12 text-center">
      <h2 className="text-2xl font-bold text-amarillo">{titulo}</h2>
      {mensaje && <p className="mt-2 mb-4 text-gray-400">{mensaje}</p>}
      {children}
    </div>
  );
}
