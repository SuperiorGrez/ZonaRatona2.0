import { useState } from 'react';

/**
 * Botón que pide confirmación en línea antes de ejecutar una acción
 * (reemplaza a window.confirm).
 */
export default function BotonConfirmar({ etiqueta = 'Eliminar', pregunta = '¿Seguro?', onConfirmar, clase = 'btn btn-sm btn-borde text-red-500' }) {
  const [preguntando, setPreguntando] = useState(false);

  if (!preguntando) {
    return (
      <button type="button" className={clase} onClick={() => setPreguntando(true)}>
        {etiqueta}
      </button>
    );
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <span className="text-sm font-semibold">{pregunta}</span>
      <button
        type="button"
        className="btn btn-sm btn-rojo"
        onClick={() => {
          setPreguntando(false);
          onConfirmar();
        }}
      >
        Sí
      </button>
      <button type="button" className="btn btn-sm btn-gris" onClick={() => setPreguntando(false)}>
        No
      </button>
    </span>
  );
}
