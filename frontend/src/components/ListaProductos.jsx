import TarjetaProducto from './TarjetaProducto';
import EstadoVacio from './EstadoVacio';

export default function ListaProductos({
  productos,
  categorias = [],
  onAgregar,
  puedeAgregar = () => true,
  mensajeVacio = 'No hay productos que coincidan con la búsqueda.',
}) {
  if (productos.length === 0) {
    return <EstadoVacio titulo="Sin resultados" mensaje={mensajeVacio} />;
  }

  const nombreCategoria = (id) => categorias.find((c) => c.id === id)?.nombre || '';

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {productos.map((producto) => (
        <TarjetaProducto
          key={producto.id}
          producto={producto}
          nombreCategoria={nombreCategoria(producto.categoriaId)}
          onAgregar={onAgregar}
          puedeAgregar={puedeAgregar(producto)}
        />
      ))}
    </div>
  );
}
