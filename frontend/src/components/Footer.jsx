import { Link } from 'react-router-dom';

export default function Footer() {
  const enlace = 'text-gray-400 underline hover:text-amarillo';
  return (
    <footer className="mt-auto border-t border-amarillo bg-neutral-900 py-6">
      <div className="contenedor">
        <div className="grid gap-4 text-sm font-semibold md:grid-cols-3">
          <div>
            <div className="mb-1 text-lg font-bold text-amarillo">🎮 ZonaRatona</div>
            <p className="text-gray-400">Venta de videojuegos y consolas al mejor precio.</p>
          </div>
          <div>
            <div className="mb-1 font-bold">Tienda</div>
            <ul className="space-y-1">
              <li><Link className={enlace} to="/productos">Productos</Link></li>
              <li><Link className={enlace} to="/ofertas">Ofertas</Link></li>
              <li><Link className={enlace} to="/categorias">Categorías</Link></li>
            </ul>
          </div>
          <div>
            <div className="mb-1 font-bold">Empresa</div>
            <ul className="space-y-1">
              <li><Link className={enlace} to="/nosotros">Nosotros</Link></li>
              <li><Link className={enlace} to="/contacto">Contacto</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-6 border-t border-neutral-700 pt-4 text-center text-sm text-gray-400">
          © 2026 ZonaRatona SpA — Proyecto formativo de desarrollo Fullstack II.
        </p>
      </div>
    </footer>
  );
}
