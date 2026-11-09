import EncabezadoPagina from '../../components/EncabezadoPagina';

const VALORES = [
  { titulo: 'Productos originales', texto: 'Todo nuestro catálogo es 100% original, sellado y con garantía.' },
  { titulo: 'Despacho a todo Chile', texto: 'Enviamos a las 16 regiones del país o retira gratis en tienda.' },
  { titulo: 'Atención gamer', texto: 'Un equipo de jugadores listo para asesorarte en tu compra.' },
];

const EQUIPO = [
  { nombre: 'Fabian Grez', cargo: 'Desarrollador Fullstack' },
  { nombre: 'Lucas Gajardo', cargo: 'Desarrollador Fullstack' },
  { nombre: 'Manuel Vargas', cargo: 'Desarrollador Fullstack' },
];

export default function Nosotros() {
  return (
    <>
      <EncabezadoPagina titulo="Nosotros" subtitulo="Conoce la historia detrás de ZonaRatona." />
      <div className="tarjeta mb-6 p-6">
        <h2 className="mb-2 text-2xl font-bold">¿Quiénes somos?</h2>
        <p className="mb-4">
          ZonaRatona nació en 2026 como un proyecto de jugadores para jugadores. Queremos que conseguir tu próxima consola o ese
          juego que tanto esperas sea fácil, seguro y al mejor precio.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold text-amber-600">Misión</h3>
            <p>Acercar los videojuegos a todo Chile con un catálogo actualizado, precios justos y un servicio cercano.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-600">Visión</h3>
            <p>Ser la tienda gamer online de referencia en el país, reconocida por su comunidad y confianza.</p>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {VALORES.map((v) => (
          <div key={v.titulo} className="tarjeta p-5 text-center">
            <h3 className="mb-1 text-xl font-bold">{v.titulo}</h3>
            <p>{v.texto}</p>
          </div>
        ))}
      </div>

      <h2 className="sombra-texto mb-3 text-2xl font-bold">Nuestro equipo</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {EQUIPO.map((m) => (
          <div key={m.nombre} className="tarjeta p-5 text-center">
            <div className="font-bold">{m.nombre}</div>
            <div className="text-sm text-gray-500">{m.cargo}</div>
          </div>
        ))}
      </div>
    </>
  );
}
