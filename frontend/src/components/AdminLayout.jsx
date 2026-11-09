import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

/** Estructura del panel administrativo: barra superior + menú lateral + contenido. */
export default function AdminLayout({ children, usuario, onCerrarSesion }) {
  const navegar = useNavigate();
  const [menuMovil, setMenuMovil] = useState(false);

  function cerrarSesion() {
    onCerrarSesion();
    navegar('/login');
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-900">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b-[3px] border-amarillo bg-negro px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="cursor-pointer rounded border border-amarillo px-2 text-amarillo lg:hidden"
            aria-label="Abrir menú administrador"
            onClick={() => setMenuMovil(!menuMovil)}
          >
            ☰
          </button>
          <Link to="/admin" className="text-xl font-bold text-amarillo">
            🎮 ZonaRatona <span className="badge ml-1 bg-red-600 text-sm text-white">Admin</span>
          </Link>
        </div>
        <span className="hidden text-sm font-semibold sm:inline">
          {usuario?.nombre} {usuario?.apellidos}
        </span>
      </header>

      <div className="flex flex-1">
        <aside
          className={`${menuMovil ? 'translate-x-0' : '-translate-x-full'} fixed top-14 bottom-0 left-0 z-30 w-60 border-r border-neutral-700 bg-negro p-4 transition-transform lg:static lg:translate-x-0`}
        >
          <AdminSidebar onNavegar={() => setMenuMovil(false)} onCerrarSesion={cerrarSesion} />
        </aside>
        <main className="min-w-0 flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
