export const FILTROS_INICIALES = { texto: '', categoriaId: '', precioMax: '', soloStock: false, orden: 'relevancia' };

/**
 * Barra de filtros del catálogo. Es "controlada": el estado vive en el padre,
 * que recibe cada cambio por onCambiar(nuevosFiltros).
 */
export default function FiltrosProductos({ filtros, categorias, onCambiar, totalResultados }) {
  function cambiar(evento) {
    const { name, value, type, checked } = evento.target;
    onCambiar({ ...filtros, [name]: type === 'checkbox' ? checked : value });
  }

  const etiqueta = 'mb-1 block text-sm font-bold text-negro';

  return (
    <section className="mb-6 rounded-lg bg-amarillo p-4 shadow" aria-label="Filtros de búsqueda">
      <div className="grid grid-cols-2 items-end gap-3 md:grid-cols-12">
        <div className="col-span-2 md:col-span-4">
          <label htmlFor="filtro-texto" className={etiqueta}>Buscar</label>
          <input id="filtro-texto" type="search" name="texto" className="campo" placeholder="Nombre o código" maxLength={60} value={filtros.texto} onChange={cambiar} />
        </div>
        <div className="md:col-span-3">
          <label htmlFor="filtro-categoria" className={etiqueta}>Categoría</label>
          <select id="filtro-categoria" name="categoriaId" className="campo" value={filtros.categoriaId} onChange={cambiar}>
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="filtro-precio" className={etiqueta}>Precio máx.</label>
          <select id="filtro-precio" name="precioMax" className="campo" value={filtros.precioMax} onChange={cambiar}>
            <option value="">Sin límite</option>
            <option value="30000">$30.000</option>
            <option value="60000">$60.000</option>
            <option value="100000">$100.000</option>
            <option value="400000">$400.000</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="filtro-orden" className={etiqueta}>Ordenar</label>
          <select id="filtro-orden" name="orden" className="campo" value={filtros.orden} onChange={cambiar}>
            <option value="relevancia">Relevancia</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
            <option value="nombre">Nombre A-Z</option>
          </select>
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm font-bold text-negro md:col-span-1">
          <input type="checkbox" name="soloStock" className="h-4 w-4 accent-negro" checked={filtros.soloStock} onChange={cambiar} />
          Con stock
        </label>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm font-bold text-negro">
        <span>{totalResultados} producto(s) encontrados</span>
        <button type="button" className="btn btn-sm bg-negro text-white hover:bg-neutral-700" onClick={() => onCambiar(FILTROS_INICIALES)}>
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
