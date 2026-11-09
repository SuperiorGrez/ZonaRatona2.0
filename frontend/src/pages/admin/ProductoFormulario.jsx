import { useNavigate, useParams } from 'react-router-dom';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import EstadoVacio from '../../components/EstadoVacio';
import FormularioProducto from '../../components/FormularioProducto';
import productosService from '../../services/productosService';

export default function ProductoFormulario({ productos, categorias, onCambio }) {
  const { id } = useParams();
  const navegar = useNavigate();
  const producto = id ? productos.find((p) => p.id === Number(id)) : null;

  if (id && !producto) return <EstadoVacio titulo="Producto no encontrado" />;

  async function guardar(valores) {
    const resultado = id ? await productosService.actualizar(id, valores) : await productosService.crear(valores);
    if (resultado.ok) {
      await onCambio();
      navegar(`/admin/productos/${resultado.producto.id}`);
    }
    return resultado;
  }

  return (
    <>
      <EncabezadoPagina titulo={id ? 'Editar producto' : 'Nuevo producto'} subtitulo={producto ? producto.nombre : 'Completa los datos del nuevo producto.'} />
      <div className="panel p-4 md:p-6">
        <FormularioProducto
          inicial={producto}
          categorias={categorias}
          onGuardar={guardar}
          onCancelar={() => navegar(-1)}
          textoBoton={id ? 'Guardar cambios' : 'Crear producto'}
        />
      </div>
    </>
  );
}
