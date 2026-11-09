import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import FiltrosProductos, { FILTROS_INICIALES } from '../../components/FiltrosProductos';
import ListaProductos from '../../components/ListaProductos';
import productosService from '../../services/productosService';

export default function Productos({ productos, categorias, carrito }) {
  const [parametros] = useSearchParams();
  const [filtros, setFiltros] = useState({ ...FILTROS_INICIALES, texto: parametros.get('buscar') || '' });

  useEffect(() => {
    setFiltros((f) => ({ ...f, texto: parametros.get('buscar') || '' }));
  }, [parametros]);

  const resultado = productosService.filtrar(productosService.disponibles(productos), filtros);

  return (
    <>
      <EncabezadoPagina titulo="Catálogo de productos" subtitulo="Explora nuestro inventario y añade lo que necesites a tu carrito." />
      <FiltrosProductos filtros={filtros} categorias={categorias} onCambiar={setFiltros} totalResultados={resultado.length} />
      <ListaProductos productos={resultado} categorias={categorias} onAgregar={carrito.agregar} puedeAgregar={carrito.puedeAgregar} />
    </>
  );
}
