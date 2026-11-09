export default function SelectorCantidad({ cantidad, minimo = 1, maximo, onCambiar }) {
  const boton = 'cursor-pointer px-3 py-1 font-bold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40';
  return (
    <div className="inline-flex items-center overflow-hidden rounded-md border border-gray-300 bg-white text-gray-900" role="group" aria-label="Cantidad">
      <button type="button" className={boton} onClick={() => onCambiar(cantidad - 1)} disabled={cantidad <= minimo} aria-label="Disminuir">
        −
      </button>
      <span className="min-w-10 border-x border-gray-300 px-2 py-1 text-center font-bold">{cantidad}</span>
      <button type="button" className={boton} onClick={() => onCambiar(cantidad + 1)} disabled={maximo !== undefined && cantidad >= maximo} aria-label="Aumentar">
        +
      </button>
    </div>
  );
}
