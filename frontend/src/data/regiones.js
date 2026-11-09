/** Regiones de Chile con una selección de comunas para el formulario de despacho. */
export const REGIONES = [
  { nombre: 'Región de Arica y Parinacota', comunas: ['Arica', 'Camarones', 'Putre', 'General Lagos'] },
  { nombre: 'Región de Tarapacá', comunas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica'] },
  { nombre: 'Región de Antofagasta', comunas: ['Antofagasta', 'Calama', 'Mejillones', 'Tocopilla', 'Taltal'] },
  { nombre: 'Región de Atacama', comunas: ['Copiapó', 'Caldera', 'Vallenar', 'Chañaral'] },
  { nombre: 'Región de Coquimbo', comunas: ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel', 'Vicuña'] },
  { nombre: 'Región de Valparaíso', comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'San Antonio', 'Quillota', 'Los Andes'] },
  {
    nombre: 'Región Metropolitana de Santiago',
    comunas: [
      'Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia',
      'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo',
      'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura',
      'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura', 'Puente Alto',
      'San Bernardo', 'Colina', 'Buin', 'Melipilla', 'Talagante',
    ],
  },
  { nombre: "Región del Libertador General Bernardo O'Higgins", comunas: ['Rancagua', 'San Fernando', 'Rengo', 'Machalí', 'Pichilemu'] },
  { nombre: 'Región del Maule', comunas: ['Talca', 'Curicó', 'Linares', 'Constitución', 'Cauquenes'] },
  { nombre: 'Región de Ñuble', comunas: ['Chillán', 'Chillán Viejo', 'San Carlos', 'Bulnes'] },
  { nombre: 'Región del Biobío', comunas: ['Concepción', 'Talcahuano', 'San Pedro de la Paz', 'Chiguayante', 'Los Ángeles', 'Coronel'] },
  { nombre: 'Región de La Araucanía', comunas: ['Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón', 'Angol'] },
  { nombre: 'Región de Los Ríos', comunas: ['Valdivia', 'La Unión', 'Panguipulli', 'Río Bueno'] },
  { nombre: 'Región de Los Lagos', comunas: ['Puerto Montt', 'Osorno', 'Puerto Varas', 'Castro', 'Ancud'] },
  { nombre: 'Región de Aysén del General Carlos Ibáñez del Campo', comunas: ['Coyhaique', 'Puerto Aysén', 'Chile Chico'] },
  { nombre: 'Región de Magallanes y de la Antártica Chilena', comunas: ['Punta Arenas', 'Puerto Natales', 'Porvenir'] },
];

export function comunasDeRegion(nombreRegion) {
  const region = REGIONES.find((r) => r.nombre === nombreRegion);
  return region ? region.comunas : [];
}
