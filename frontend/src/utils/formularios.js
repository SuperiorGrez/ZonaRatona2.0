/**
 * Actualiza el valor de un campo de formulario controlado y borra su error.
 * Uso: onChange={(e) => manejarCambio(e, setValores, setErrores)}
 */
export function manejarCambio(evento, setValores, setErrores) {
  const { name, value, type, checked } = evento.target;
  setValores((previos) => ({ ...previos, [name]: type === 'checkbox' ? checked : value }));
  if (setErrores) {
    setErrores((previos) => {
      if (!previos[name]) return previos;
      const copia = { ...previos };
      delete copia[name];
      return copia;
    });
  }
}
