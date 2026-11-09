const ESTILOS = {
  error: 'border-red-300 bg-red-100 text-red-800',
  exito: 'border-green-300 bg-green-100 text-green-800',
  info: 'border-sky-300 bg-sky-100 text-sky-800',
};

export default function Alerta({ mensaje, tipo = 'error', onCerrar }) {
  if (!mensaje) return null;
  return (
    <div role="alert" className={`mb-4 flex items-start justify-between gap-3 rounded-md border px-4 py-3 font-semibold ${ESTILOS[tipo]}`}>
      <span>{mensaje}</span>
      {onCerrar && (
        <button type="button" aria-label="Cerrar" className="cursor-pointer text-lg leading-none opacity-60 hover:opacity-100" onClick={onCerrar}>
          ×
        </button>
      )}
    </div>
  );
}
