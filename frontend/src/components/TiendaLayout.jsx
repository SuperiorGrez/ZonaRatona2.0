import Navbar from './Navbar';
import Footer from './Footer';
import AvisoFlotante from './AvisoFlotante';

/** Estructura común de las vistas públicas: navbar + contenido (children) + footer. */
export default function TiendaLayout({ children, usuario, categorias, carrito, aviso, onCerrarSesion }) {
  return (
    <div className="fondo-gamer flex min-h-screen flex-col">
      <Navbar usuario={usuario} categorias={categorias} total={carrito.total} unidades={carrito.unidades} onCerrarSesion={onCerrarSesion} />
      <main className="contenedor flex-1 py-6">{children}</main>
      <Footer />
      <AvisoFlotante aviso={aviso} />
    </div>
  );
}
