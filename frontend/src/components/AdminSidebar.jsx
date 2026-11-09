import { NavLink } from 'react-router-dom';

export const SECCIONES_ADMIN = [
  { ruta: '/admin', etiqueta: 'Dashboard', fin: true, descripcion: 'Visión general de las métricas clave.' },
  { ruta: '/admin/ordenes', etiqueta: 'Órdenes', descripcion: 'Gestión y seguimiento de las órdenes de compra.' },
  { ruta: '/admin/productos', etiqueta: 'Productos', descripcion: 'Administrar inventario y detalles de los productos.' },
  { ruta: '/admin/categorias', etiqueta: 'Categorías', descripcion: 'Organizar productos en categorías.' },
  { ruta: '/admin/usuarios', etiqueta: 'Usuarios', descripcion: 'Ver cuentas y activarlas o desactivarlas.' },
  { ruta: '/admin/perfil', etiqueta: 'Perfil', descripcion: 'Tu información personal.' },
];

export default function AdminSidebar({ onNavegar, onCerrarSesion }) {
  return (
    <nav className="flex h-full flex-col" aria-label="Menú administrador">
      <ul className="mb-auto space-y-1">
        {SECCIONES_ADMIN.map((s) => (
          <li key={s.ruta}>
            <NavLink
              to={s.ruta}
              end={s.fin}
              onClick={onNavegar}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 font-semibold ${isActive ? 'bg-amarillo text-negro' : 'text-gray-200 hover:text-amarillo'}`
              }
            >
              {s.etiqueta}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-6 grid gap-2 border-t border-neutral-700 pt-4">
        <NavLink to="/" className="btn btn-borde text-white">
          Ver tienda
        </NavLink>
        <button type="button" className="btn btn-rojo" onClick={onCerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
