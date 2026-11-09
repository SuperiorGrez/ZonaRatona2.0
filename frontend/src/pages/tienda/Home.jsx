import { Link } from 'react-router-dom';
import CarruselBanner from '../../components/CarruselBanner';
import TarjetaCategoria from '../../components/TarjetaCategoria';
import ListaProductos from '../../components/ListaProductos';
import productosService from '../../services/productosService';

const DIAPOSITIVAS = [
  {
    titulo: 'Nuevos lanzamientos',
    texto: 'Descubre los últimos juegos disponibles en nuestra tienda.',
    imagen: 'https://wallpapers.com/images/hd/video-games-zoom-background-ux0skf8nbnx9xzen.jpg',
    enlace: '/productos',
    boton: 'Ver catálogo',
  },
  {
    titulo: 'Ofertas imperdibles',
    texto: 'Hasta 50% de descuento en juegos seleccionados.',
    imagen: 'https://media.falabella.com/falabellaCL/16570989_2/w=1200,h=1400,fit=cover',
    enlace: '/ofertas',
    boton: 'Ver ofertas',
  },
  {
    titulo: 'Nintendo Switch 2',
    texto: 'Ya disponible la nueva consola de Nintendo.',
    imagen: 'https://www.weplay.cl/pub/media/catalog/product/cache/3f1b140c3c9f36fbf6b01dffb521c246/1/_/1_1745414561000.jpg',
    enlace: '/productos/6',
    boton: 'Comprar ahora',
  },
];

/** Página principal: banner, categorías, destacados y ofertas. */
export default function Home({ productos, categorias, carrito }) {

  const destacados = productos.filter((p) => p.activo && p.stock > 0 && p.categoriaId === 1).slice(0, 5);
  const ofertas = productosService.enOferta(productos).slice(0, 5);

  return (
    <>
      <header className="mb-6 text-center">
        <h1 className="sombra-texto text-4xl font-bold text-amarillo sm:text-5xl">¡Bienvenid@ a ZonaRatona!</h1>
        <p className="sombra-texto text-lg font-semibold">Adquiere tus consolas y juegos favoritos al mejor precio.</p>
      </header>

      <CarruselBanner diapositivas={DIAPOSITIVAS} />

      <section className="mb-10">
        <h2 className="sombra-texto mb-4 text-center text-2xl font-bold">Categorías</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-7">
          {categorias.map((c) => (
            <TarjetaCategoria key={c.id} categoria={c} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="sombra-texto text-2xl font-bold">Consolas destacadas</h2>
          <Link to="/categorias/1" className="btn btn-sm btn-borde text-amarillo">Ver todas</Link>
        </div>
        <ListaProductos productos={destacados} categorias={categorias} onAgregar={carrito.agregar} puedeAgregar={carrito.puedeAgregar} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="sombra-texto text-2xl font-bold">🔥 Ofertas</h2>
          <Link to="/ofertas" className="btn btn-sm btn-borde text-amarillo">Ver todas</Link>
        </div>
        <ListaProductos productos={ofertas} categorias={categorias} onAgregar={carrito.agregar} puedeAgregar={carrito.puedeAgregar} />
      </section>
    </>
  );
}
