/** Título de página con subtítulo opcional y espacio para acciones. */
export default function EncabezadoPagina({ titulo, subtitulo, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="titulo-pagina">{titulo}</h1>
        {subtitulo && <p className="sombra-texto font-semibold text-gray-100">{subtitulo}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
