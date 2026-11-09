import CampoFormulario from './CampoFormulario';
import { REGIONES, comunasDeRegion } from '../data/regiones';

export default function SelectorRegionComuna({ region, comuna, onChange, errores = {}, requerido = true }) {
  const comunas = comunasDeRegion(region);

  function cambiarRegion(evento) {
    onChange({ target: { name: 'region', value: evento.target.value } });
    onChange({ target: { name: 'comuna', value: '' } });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CampoFormulario como="select" etiqueta="Región" nombre="region" valor={region} onChange={cambiarRegion} error={errores.region} requerido={requerido}>
        <option value="">Selecciona una región</option>
        {REGIONES.map((r) => (
          <option key={r.nombre} value={r.nombre}>
            {r.nombre}
          </option>
        ))}
      </CampoFormulario>
      <CampoFormulario como="select" etiqueta="Comuna" nombre="comuna" valor={comuna} onChange={onChange} error={errores.comuna} requerido={requerido} disabled={!region}>
        <option value="">Selecciona una comuna</option>
        {comunas.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </CampoFormulario>
    </div>
  );
}
