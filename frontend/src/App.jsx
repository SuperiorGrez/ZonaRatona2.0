import { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import ScrollArriba from './components/ScrollArriba';
import RutaProtegida from './components/RutaProtegida';
import TiendaLayout from './components/TiendaLayout';
import AdminLayout from './components/AdminLayout';
import EstadoVacio from './components/EstadoVacio';

import productosService from './services/productosService';
import categoriasService from './services/categoriasService';
import carritosService from './services/carritosService';
import authService from './services/authService';
import {
  agregarItem,
  cambiarCantidad,
  quitarItem,
  detalleCarrito,
  totalCarrito,
  totalUnidades,
  maximoPermitido,
  puedeAgregar,
  unirCarritos,
} from './utils/carrito';

import Home from './pages/tienda/Home';
import Productos from './pages/tienda/Productos';
import DetalleProducto from './pages/tienda/DetalleProducto';
import Categorias from './pages/tienda/Categorias';
import Ofertas from './pages/tienda/Ofertas';
import Nosotros from './pages/tienda/Nosotros';
import Contacto from './pages/tienda/Contacto';
import Login from './pages/tienda/Login';
import Registro from './pages/tienda/Registro';
import Carrito from './pages/tienda/Carrito';
import Checkout from './pages/tienda/Checkout';
import CompraExitosa from './pages/tienda/CompraExitosa';
import CompraFallida from './pages/tienda/CompraFallida';
import NoEncontrado from './pages/tienda/NoEncontrado';

import Dashboard from './pages/admin/Dashboard';
import Ordenes from './pages/admin/Ordenes';
import Boleta from './pages/admin/Boleta';
import ProductosAdmin from './pages/admin/ProductosAdmin';
import ProductoFormulario from './pages/admin/ProductoFormulario';
import ProductoDetalle from './pages/admin/ProductoDetalle';
import CategoriasAdmin from './pages/admin/CategoriasAdmin';
import CategoriaFormulario from './pages/admin/CategoriaFormulario';
import UsuariosAdmin from './pages/admin/UsuariosAdmin';
import UsuarioDetalle from './pages/admin/UsuarioDetalle';
import Perfil from './pages/admin/Perfil';

export default function App() {
  const [usuario, setUsuario] = useState(() => authService.sesionActual());

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');

  const [items, setItems] = useState([]);
  const [aviso, setAviso] = useState(null);
  const carritoCargado = useRef(false);
  const ultimoGuardado = useRef('');
  const temporizadorAviso = useRef(null);

  async function recargarCatalogo() {
    try {
      const [listaProductos, listaCategorias] = await Promise.all([productosService.listar(), categoriasService.listar()]);
      setProductos(listaProductos);
      setCategorias(listaCategorias);
      setErrorCarga('');
    } catch (error) {
      setErrorCarga(error.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    recargarCatalogo();
  }, []);

  useEffect(() => {
    carritoCargado.current = false;
    if (!usuario) return;
    carritosService
      .obtener(usuario.id)
      .then((guardado) => {
        ultimoGuardado.current = JSON.stringify(guardado);
        setItems((actual) => unirCarritos(guardado, actual));
        carritoCargado.current = true;
      })
      .catch(() => {});
  }, [usuario?.id]);

  useEffect(() => {
    if (!usuario || !carritoCargado.current) return;
    const json = JSON.stringify(items);
    if (json === ultimoGuardado.current) return;
    ultimoGuardado.current = json;
    carritosService.guardar(usuario.id, items).catch(() => {});
  }, [items]);

  function mostrarAviso(mensaje, tipo = 'exito') {
    clearTimeout(temporizadorAviso.current);
    setAviso({ mensaje, tipo });
    temporizadorAviso.current = setTimeout(() => setAviso(null), 2500);
  }

  const categoriaDe = (producto) => categorias.find((c) => c.id === producto.categoriaId);
  const detalle = detalleCarrito(items, productos);

  const carrito = {
    items,
    detalle,
    total: totalCarrito(detalle),
    unidades: totalUnidades(items),
    maximoDe: (producto) => maximoPermitido(producto, categoriaDe(producto)),
    puedeAgregar: (producto, cantidad = 1) => puedeAgregar(items, producto, categoriaDe(producto), cantidad),
    agregar(producto, cantidad = 1) {
      if (!puedeAgregar(items, producto, categoriaDe(producto), cantidad)) {
        mostrarAviso(`Alcanzaste el máximo permitido de "${producto.nombre}"`, 'alerta');
        return;
      }
      setItems((actual) => agregarItem(actual, producto, categoriaDe(producto), cantidad));
      mostrarAviso(`"${producto.nombre}" agregado al carrito`);
    },
    cambiarCantidad: (productoId, cantidad) => setItems((actual) => cambiarCantidad(actual, productoId, cantidad)),
    quitar: (productoId) => setItems((actual) => quitarItem(actual, productoId)),
    vaciar: () => setItems([]),
  };

  async function iniciarSesion(identificador, clave) {
    const resultado = await authService.login(identificador, clave);
    if (resultado.ok) setUsuario(resultado.sesion);
    return resultado;
  }

  function cerrarSesion() {
    authService.logout();
    setUsuario(null);
    setItems([]);
  }

  function actualizarUsuario(datos) {
    setUsuario(authService.refrescarSesion(datos));
  }

  async function compraRealizada() {
    setItems([]);
    await recargarCatalogo();
  }

  function contenido(pagina) {
    if (cargando) return <EstadoVacio titulo="Cargando..." />;
    if (errorCarga) return <EstadoVacio titulo="Sin conexión" mensaje={errorCarga} />;
    return pagina;
  }

  const tienda = (pagina) => (
    <TiendaLayout usuario={usuario} categorias={categorias} carrito={carrito} aviso={aviso} onCerrarSesion={cerrarSesion}>
      {contenido(pagina)}
    </TiendaLayout>
  );

  const admin = (pagina) => (
    <RutaProtegida usuario={usuario} soloAdmin>
      <AdminLayout usuario={usuario} onCerrarSesion={cerrarSesion}>
        {contenido(pagina)}
      </AdminLayout>
    </RutaProtegida>
  );

  const catalogo = { productos, categorias };

  return (
    <>
      <ScrollArriba />
      <Routes>
        <Route path="/" element={tienda(<Home {...catalogo} carrito={carrito} />)} />
        <Route path="/productos" element={tienda(<Productos {...catalogo} carrito={carrito} />)} />
        <Route path="/productos/:id" element={tienda(<DetalleProducto {...catalogo} carrito={carrito} />)} />
        <Route path="/categorias" element={tienda(<Categorias {...catalogo} carrito={carrito} />)} />
        <Route path="/categorias/:id" element={tienda(<Categorias {...catalogo} carrito={carrito} />)} />
        <Route path="/ofertas" element={tienda(<Ofertas {...catalogo} carrito={carrito} />)} />
        <Route path="/nosotros" element={tienda(<Nosotros />)} />
        <Route path="/contacto" element={tienda(<Contacto usuario={usuario} />)} />
        <Route path="/login" element={tienda(<Login usuario={usuario} onIniciarSesion={iniciarSesion} />)} />
        <Route path="/registro" element={tienda(<Registro />)} />
        <Route path="/carrito" element={tienda(<Carrito {...catalogo} carrito={carrito} />)} />
        <Route path="/checkout" element={tienda(<Checkout usuario={usuario} carrito={carrito} onCompraRealizada={compraRealizada} />)} />
        <Route path="/compra/exitosa/:id" element={tienda(<CompraExitosa />)} />
        <Route path="/compra/error/:id" element={tienda(<CompraFallida />)} />

        <Route path="/admin" element={admin(<Dashboard productos={productos} />)} />
        <Route path="/admin/ordenes" element={admin(<Ordenes />)} />
        <Route path="/admin/ordenes/:id" element={admin(<Boleta />)} />
        <Route path="/admin/productos" element={admin(<ProductosAdmin key="todos" {...catalogo} onCambio={recargarCatalogo} />)} />
        <Route path="/admin/productos/criticos" element={admin(<ProductosAdmin key="criticos" soloCriticos {...catalogo} onCambio={recargarCatalogo} />)} />
        <Route path="/admin/productos/nuevo" element={admin(<ProductoFormulario key="nuevo" {...catalogo} onCambio={recargarCatalogo} />)} />
        <Route path="/admin/productos/:id" element={admin(<ProductoDetalle {...catalogo} onCambio={recargarCatalogo} />)} />
        <Route path="/admin/productos/:id/editar" element={admin(<ProductoFormulario key="editar" {...catalogo} onCambio={recargarCatalogo} />)} />
        <Route path="/admin/categorias" element={admin(<CategoriasAdmin {...catalogo} onCambio={recargarCatalogo} />)} />
        <Route path="/admin/categorias/nueva" element={admin(<CategoriaFormulario key="nueva" categorias={categorias} onCambio={recargarCatalogo} />)} />
        <Route path="/admin/categorias/:id/editar" element={admin(<CategoriaFormulario key="editar" categorias={categorias} onCambio={recargarCatalogo} />)} />
        <Route path="/admin/usuarios" element={admin(<UsuariosAdmin usuario={usuario} />)} />
        <Route path="/admin/usuarios/:id" element={admin(<UsuarioDetalle usuario={usuario} />)} />
        <Route path="/admin/perfil" element={admin(<Perfil usuario={usuario} onActualizado={actualizarUsuario} />)} />

        <Route path="*" element={tienda(<NoEncontrado />)} />
      </Routes>
    </>
  );
}
