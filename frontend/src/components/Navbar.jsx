import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { formatearPrecio } from '../utils/formato';

const claseEnlace = ({ isActive }) =>
  `block py-1 font-semibold hover:text-amarillo ${isActive ? 'text-amarillo' : 'text-white'}`;

const ENLACES = [
  { ruta: '/', texto: 'Home' },
  { ruta: '/productos', texto: 'Productos' },
  { ruta: '/ofertas', texto: 'Ofertas' },
  { ruta: '/nosotros', texto: 'Nosotros' },
  { ruta: '/contacto', texto: 'Contacto' },
];

/** Barra de navegación principal de la tienda. */
export default function Navbar({ usuario, categorias, total, unidades, onCerrarSesion }) {
  const esAdmin = usuario?.rol === 'admin';
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [categoriasAbiertas, setCategoriasAbiertas] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Cierra los menús al cambiar de página.
  useEffect(() => {
    setMenuAbierto(false);
    setCategoriasAbiertas(false);
  }, [ubicacion.pathname, ubicacion.search]);

  function buscar(evento) {
    evento.preventDefault();
    const texto = busqueda.trim();
    navegar(texto ? `/productos?buscar=${encodeURIComponent(texto)}` : '/productos');
    setBusqueda('');
  }

  function cerrarSesion() {
    onCerrarSesion();
    navegar('/');
  }

  return (
    <nav className="sticky top-0 z-40 border-b-[3px] border-amarillo bg-negro" aria-label="Navegación principal">
      <div className="contenedor flex flex-wrap items-center justify-between gap-x-6 py-2">
        <Link to="/" className="text-2xl font-bold tracking-wide text-amarillo">
          🎮 ZonaRatona
        </Link>

        <button
          type="button"
          className="cursor-pointer rounded border border-amarillo px-3 py-1 text-2xl text-amarillo lg:hidden"
          aria-expanded={menuAbierto}
          aria-label="Abrir menú"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          ☰
        </button>

        <div className={`${menuAbierto ? 'flex' : 'hidden'} w-full flex-col gap-3 py-3 lg:flex lg:w-auto lg:flex-1 lg:py-0`}>
          {/* Fila 1: buscador + sesión */}
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <form className="flex flex-1 gap-2 lg:mx-auto lg:max-w-md" role="search" onSubmit={buscar}>
              <input
                type="search"
                className="w-full rounded-md border border-neutral-600 bg-neutral-800 px-3 py-1 text-sm text-white placeholder:text-gray-400 focus:border-amarillo focus:outline-none"
                placeholder="Buscar juegos..."
                aria-label="Buscar"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button type="submit" className="btn btn-sm btn-borde text-amarillo">
                Buscar
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              {usuario ? (
                <>
                  <span className="text-sm font-semibold">
                    Hola, <b className="text-amarillo">{usuario.nombre}</b>
                  </span>
                  {esAdmin && (
                    <Link to="/admin" className="btn btn-sm btn-borde text-amarillo">
                      Panel
                    </Link>
                  )}
                  <button type="button" className="btn btn-sm btn-rojo" onClick={cerrarSesion}>
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-sm btn-borde text-white">
                    Iniciar sesión
                  </Link>
                  <Link to="/registro" className="btn btn-sm btn-amarillo">
                    Crear cuenta
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Fila 2: enlaces + carrito */}
          <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-center lg:gap-6">
            {ENLACES.slice(0, 2).map((e) => (
              <li key={e.ruta}>
                <NavLink to={e.ruta} end className={claseEnlace}>
                  {e.texto}
                </NavLink>
              </li>
            ))}
            <li className="relative">
              <button
                type="button"
                className="cursor-pointer py-1 font-semibold text-white hover:text-amarillo"
                aria-expanded={categoriasAbiertas}
                onClick={() => setCategoriasAbiertas(!categoriasAbiertas)}
              >
                Categorías ▾
              </button>
              {categoriasAbiertas && (
                <ul className="z-50 mt-1 min-w-52 rounded-md bg-white py-1 text-gray-900 shadow-lg lg:absolute">
                  <li>
                    <Link to="/categorias" className="block px-4 py-1 font-semibold hover:bg-gray-100">
                      Todas las categorías
                    </Link>
                  </li>
                  {categorias.map((c) => (
                    <li key={c.id}>
                      <Link to={`/categorias/${c.id}`} className="block px-4 py-1 hover:bg-gray-100">
                        {c.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            {ENLACES.slice(2).map((e) => (
              <li key={e.ruta}>
                <NavLink to={e.ruta} className={claseEnlace}>
                  {e.texto}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to="/carrito" className="btn btn-sm btn-verde relative" aria-label="Ver carrito">
                🛒 Carrito {formatearPrecio(total)}
                {unidades > 0 && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-red-600 px-1.5 text-xs text-white">{unidades}</span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
