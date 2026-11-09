import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import TarjetaEstadistica from '../../components/TarjetaEstadistica';
import { SECCIONES_ADMIN } from '../../components/AdminSidebar';
import ordenesService from '../../services/ordenesService';
import productosService from '../../services/productosService';
import usuariosService from '../../services/usuariosService';
import { formatearPrecio } from '../../utils/formato';

/** Dashboard: métricas principales y accesos a cada módulo. */
export default function Dashboard({ productos }) {
  const [ordenes, setOrdenes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    ordenesService.listar().then(setOrdenes);
    usuariosService.listar().then(setUsuarios);
  }, []);

  const resumen = ordenesService.resumen(ordenes);
  const inventario = productos.reduce((s, p) => s + p.stock, 0);
  const criticos = productosService.criticos(productos).length;

  return (
    <>
      <EncabezadoPagina titulo="Dashboard" subtitulo="Resumen de las actividades diarias" />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaEstadistica titulo="Compras" valor={resumen.pagadas} color="bg-blue-600 text-white" detalle={`Ventas: ${formatearPrecio(resumen.ventas)}`} />
        <TarjetaEstadistica titulo="Productos" valor={productos.length} color="bg-green-600 text-white" detalle={`Inventario actual: ${inventario} unidades`} />
        <TarjetaEstadistica titulo="Usuarios" valor={usuarios.length} color="bg-amarillo text-negro" detalle={`Nuevos este mes: ${usuariosService.nuevosDelMes(usuarios)}`} />
        <Link to="/admin/productos/criticos">
          <TarjetaEstadistica titulo="Stock crítico" valor={criticos} color="bg-red-600 text-white" detalle="Ver productos críticos" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECCIONES_ADMIN.filter((s) => s.ruta !== '/admin').map((s) => (
          <Link key={s.ruta} to={s.ruta} className="panel block p-5 text-center transition hover:-translate-y-1 hover:ring-1 hover:ring-amarillo">
            <div className="text-lg font-bold text-amarillo">{s.etiqueta}</div>
            <div className="text-sm text-gray-400">{s.descripcion}</div>
          </Link>
        ))}
        <Link to="/" className="panel block p-5 text-center transition hover:-translate-y-1 hover:ring-1 hover:ring-amarillo">
          <div className="text-lg font-bold text-amarillo">Tienda</div>
          <div className="text-sm text-gray-400">Visualiza tu tienda.</div>
        </Link>
      </div>
    </>
  );
}
