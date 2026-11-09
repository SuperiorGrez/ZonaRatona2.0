import { useEffect, useState } from 'react';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import EstadoVacio from '../../components/EstadoVacio';
import Alerta from '../../components/Alerta';
import FormularioPerfil from '../../components/FormularioPerfil';
import usuariosService from '../../services/usuariosService';

/**
 * Perfil del administrador: editar sus propios datos.
 * onActualizado: avisa a App para refrescar los datos de la sesión.
 */
export default function Perfil({ usuario, onActualizado }) {
  const [datos, setDatos] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    usuariosService.obtener(usuario.id).then(setDatos);
  }, [usuario.id]);

  if (!datos) return <EstadoVacio titulo="Cargando..." />;

  async function guardar(valores) {
    // El administrador no puede quitarse su propio rol ni desactivarse.
    const resultado = await usuariosService.actualizar(usuario.id, { ...valores, rol: datos.rol, activo: true });
    if (resultado.ok) {
      onActualizado(resultado.usuario);
      setMensaje('Perfil actualizado correctamente.');
    }
    return resultado;
  }

  return (
    <>
      <EncabezadoPagina titulo="Mi perfil" subtitulo="Administra tu información personal." />
      <Alerta tipo="exito" mensaje={mensaje} onCerrar={() => setMensaje('')} />
      <div className="panel p-4 md:p-6">
        <FormularioPerfil inicial={datos} onGuardar={guardar} />
      </div>
    </>
  );
}
