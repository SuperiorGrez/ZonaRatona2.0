import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Carrusel de banners hecho con estado de React.
 * Avanza solo cada `intervalo` ms y permite navegar con flechas e indicadores.
 */
export default function CarruselBanner({ diapositivas, intervalo = 5000 }) {
  const [actual, setActual] = useState(0);
  const total = diapositivas.length;

  useEffect(() => {
    if (total < 2 || !intervalo) return undefined;
    const id = setInterval(() => setActual((i) => (i + 1) % total), intervalo);
    return () => clearInterval(id);
  }, [total, intervalo]);

  if (total === 0) return null;

  const ir = (indice) => setActual((indice + total) % total);
  const d = diapositivas[actual];
  const flecha = 'absolute top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 px-3 py-1 text-3xl text-white hover:bg-black/80';

  return (
    <div className="relative mb-10 h-60 overflow-hidden rounded-lg bg-cover bg-center shadow-lg sm:h-72" style={{ backgroundImage: `url(${d.imagen})` }}>
      <div className="flex h-full flex-col items-center justify-center bg-black/60 p-6 text-center">
        <h2 className="text-3xl font-bold text-amarillo sm:text-4xl">{d.titulo}</h2>
        <p className="mb-4 text-lg font-semibold">{d.texto}</p>
        {d.enlace && (
          <Link to={d.enlace} className="btn btn-amarillo px-6">
            {d.boton || 'Ver más'}
          </Link>
        )}
      </div>
      <button type="button" className={`${flecha} left-3`} onClick={() => ir(actual - 1)} aria-label="Anterior">
        ‹
      </button>
      <button type="button" className={`${flecha} right-3`} onClick={() => ir(actual + 1)} aria-label="Siguiente">
        ›
      </button>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {diapositivas.map((item, i) => (
          <button
            key={item.titulo}
            type="button"
            className={`h-1.5 w-8 cursor-pointer rounded ${i === actual ? 'bg-white' : 'bg-white/40'}`}
            aria-label={`Ir a la diapositiva ${i + 1}`}
            onClick={() => ir(i)}
          ></button>
        ))}
      </div>
    </div>
  );
}
