export default function AvisoFlotante({ aviso }) {
  if (!aviso) return null;
  const color = aviso.tipo === 'alerta' ? 'bg-amber-500 text-negro' : 'bg-green-600 text-white';
  return (
    <div role="status" aria-live="polite" className={`fixed right-4 bottom-4 z-50 rounded-md px-4 py-3 font-bold shadow-lg ${color}`}>
      {aviso.mensaje}
    </div>
  );
}
