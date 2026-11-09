import { useNavigate, useParams } from 'react-router-dom';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import EstadoVacio from '../../components/EstadoVacio';
import FormularioCategoria from '../../components/FormularioCategoria';
import categoriasService from '../../services/categoriasService';

/** Vista "Nueva categoría" y "Editar categoría". */
export default function CategoriaFormulario({ categorias, onCambio }) {
  const { id } = useParams();
  const navegar = useNavigate();
  const categoria = id ? categorias.find((c) => c.id === Number(id)) : null;

  if (id && !categoria) return <EstadoVacio titulo="Categoría no encontrada" />;

  async function guardar(valores) {
    const resultado = id ? await categoriasService.actualizar(id, valores) : await categoriasService.crear(valores);
    if (resultado.ok) {
      await onCambio();
      navegar('/admin/categorias');
    }
    return resultado;
  }

  return (
    <>
      <EncabezadoPagina titulo={id ? 'Editar categoría' : 'Nueva categoría'} subtitulo={categoria?.nombre} />
      <div className="panel p-4 md:p-6">
        <FormularioCategoria inicial={categoria} onGuardar={guardar} onCancelar={() => navegar('/admin/categorias')} textoBoton={id ? 'Guardar cambios' : 'Crear categoría'} />
      </div>
    </>
  );
}
