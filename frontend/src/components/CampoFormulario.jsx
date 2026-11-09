/**
 * Campo de formulario controlado con etiqueta y mensaje de error.
 * Soporta input, textarea y select (las opciones se pasan como children).
 */
export default function CampoFormulario({
  etiqueta,
  nombre,
  valor,
  onChange,
  error,
  tipo = 'text',
  como = 'input',
  requerido = false,
  ayuda,
  className = '',
  children,
  ...resto
}) {
  const id = `campo-${nombre}`;
  const props = {
    id,
    name: nombre,
    value: valor ?? '',
    onChange,
    className: `campo ${error ? 'campo-error' : ''}`,
    'aria-invalid': Boolean(error),
    ...resto,
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="etiqueta">
        {etiqueta}
        {requerido && <span className="ml-1 text-red-500">*</span>}
      </label>
      {como === 'textarea' && <textarea {...props} />}
      {como === 'select' && <select {...props}>{children}</select>}
      {como === 'input' && <input type={tipo} {...props} />}
      {ayuda && !error && <p className="mt-1 text-xs opacity-70">{ayuda}</p>}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
