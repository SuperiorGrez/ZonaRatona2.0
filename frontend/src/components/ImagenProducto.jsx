import { IMAGEN_RESPALDO, usarImagenRespaldo } from '../utils/formato';

export default function ImagenProducto({ src, alt, className = 'max-h-full max-w-full object-contain' }) {
  return (
    <img
      src={src && src.trim() ? src : IMAGEN_RESPALDO}
      alt={alt}
      className={className}
      loading="lazy"
      onError={usarImagenRespaldo}
    />
  );
}
