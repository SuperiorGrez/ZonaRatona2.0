import { useParams } from 'react-router-dom';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import TarjetaCategoria from '../../components/TarjetaCategoria';
import ListaProductos from '../../components/ListaProductos';
import productosService from '../../services/productosService';

/**
 * Vista de categorías. Sin id muestra todas las categorías con sus productos;
 * con id (/categorias/:id) muestra solo los productos de esa categoría.
 */
export default function Categorias({ productos, categorias, carrito }) {
  const { id } = useParams();

  const seleccionada = id ? categorias.find((c) => c.id === Number(id)) : null;
  const aMostrar = seleccionada ? [seleccionada] : categorias;

  return (
    <>
      <EncabezadoPagina
        titulo={seleccionada ? seleccionada.nombre : 'Categorías'}
        subtitulo={seleccionada ? seleccionada.descripcion : 'Encuentra tus productos por categoría.'}
      />

      <div className="mb-8 grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-7">
        {categorias.map((c) => (
          <TarjetaCategoria key={c.id} categoria={c} cantidad={productosService.porCategoria(c.id, productos).length} activa={seleccionada?.id === c.id} />
        ))}
      </div>

      {id && !seleccionada && <p className="sombra-texto font-bold">La categoría solicitada no existe.</p>}

      {aMostrar.map((categoria) => (
        <section key={categoria.id} className="mb-10">
          <h2 className="sombra-texto mb-4 text-2xl font-bold">{categoria.nombre}</h2>
          <ListaProductos
            productos={productosService.porCategoria(categoria.id, productos)}
            categorias={categorias}
            onAgregar={carrito.agregar}
            puedeAgregar={carrito.puedeAgregar}
            mensajeVacio="Esta categoría aún no tiene productos."
          />
        </section>
      ))}
    </>
  );
}
