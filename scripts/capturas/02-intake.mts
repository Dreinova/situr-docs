// Inscripciones ficticias para la cuenta de demostración, por la misma ruta del formulario.
import { admin } from './lib.mjs'
import { readFileSync, writeFileSync } from 'node:fs'
import {
  blankRegistration, blankEstablishment, companySections, establishmentSections, indicatorSections,
  validateRegistration, toIntakeDoc, fieldVisible,
} from 'file:///B:/repos/imctt-crm/supabase/functions/_shared/publicForm.ts'

const FORM = '06180ed5-9f81-45f5-9651-10732f14d473'
const schema = JSON.parse(readFileSync(new URL('./schema.json', import.meta.url), 'utf8'))
const cat = (key: string) => schema.categories.find((c: any) => c.key === key)
const sub = (c: string, s: string) => cat(c).subcategories.find((x: any) => x.key === s)?.id ?? ''

let seed = 7
const rnd = (min: number, max: number) => { seed = (seed * 9301 + 49297) % 233280; return Math.round(min + (seed / 233280) * (max - min)) }

function guess(field: any, overrides: Record<string, string>): string | undefined {
  if (field.key in overrides) return overrides[field.key]
  if (field.type === 'file') return undefined
  const label = field.label.toLowerCase()
  if (field.type === 'select') {
    if (field.options.includes('Sí')) return /mascotas|bodas/.test(label) ? 'No' : 'Sí'
    return field.options[0]
  }
  if (field.type === 'multiselect') return field.options.slice(0, 2).join('\n')
  if (field.type === 'checkbox') return 'true'
  if (field.type === 'number' || field.type === 'digits') {
    if (/año/.test(label)) return '2025'
    if (/rnt/.test(label)) return String(rnd(100000, 199999))
    if (/tarifa|precio|pesos|ingresos|activos|utilidad/.test(label)) return String(rnd(8, 60) * 10000)
    if (/%|porcentaje|ocupaci/.test(label)) return String(rnd(35, 85))
    return String(rnd(2, 40))
  }
  if (/hora.*check-in/.test(label)) return '3:00 p. m.'
  if (/hora.*check-out/.test(label)) return '12:00 m.'
  if (/horario/.test(label)) return 'Viernes a domingo, 9:00 a. m. – 6:00 p. m.'
  if (field.required) return 'Información de demostración'
  return undefined
}

function fill(target: Record<string, string>, fields: any[], overrides: Record<string, string>, ctx: () => [Record<string, string>, Record<string, string>]) {
  for (const f of fields) {
    const [values, company] = ctx()
    if (!fieldVisible(schema, f.key, values, company)) continue
    const v = guess(f, overrides)
    if (v !== undefined) target[f.key] = v
  }
}

type Demo = {
  company: string; person: 'natural' | 'juridica'; doc: string
  contact: [string, string, string, string]
  est: { name: string; cat: string; sub?: string; address: string; lat: string; lng: string; phone: string; web?: string; values?: Record<string, string> }[]
}

const demos: Demo[] = [
  { company: 'Glamping Mirador del Juaica S.A.S.', person: 'juridica', doc: '901234567', contact: ['Camila', 'Torres', 'camila.torres@DOMAIN', '3105550101'],
    est: [{ name: 'Glamping Mirador del Juaica', cat: 'alojamiento', sub: 'glamping', address: 'Vereda Juaica, km 3', lat: '4.8891', lng: '-74.1620', phone: '3105550101', web: 'https://glamping-mirador.example' }] },
  { company: 'Andrés Felipe Gómez', person: 'natural', doc: '80123456', contact: ['Andrés Felipe', 'Gómez', 'andres.gomez@DOMAIN', '3115550202'],
    est: [{ name: 'Café La Chucua', cat: 'restaurantes', sub: 'cafe', address: 'Calle 3 # 4-12, Centro', lat: '4.8716', lng: '-74.1452', phone: '3115550202' },
          { name: 'Heladería El Parque', cat: 'restaurantes', sub: 'heladeria', address: 'Carrera 3 # 2-40, Centro', lat: '4.8712', lng: '-74.1448', phone: '3115550203' }] },
  { company: 'Finca Los Arrayanes', person: 'natural', doc: '52987654', contact: ['Marta Lucía', 'Pardo', 'marta.pardo@DOMAIN', '3125550303'],
    est: [{ name: 'Finca Los Arrayanes', cat: 'viviendas', sub: 'finca_turistica', address: 'Vereda Chacal, finca Los Arrayanes', lat: '4.8603', lng: '-74.1711', phone: '3125550303' }] },
  { company: 'Senderos de la Sabana Guías', person: 'natural', doc: '1018456789', contact: ['Julián', 'Cárdenas', 'julian.cardenas@DOMAIN', '3135550404'],
    est: [{ name: 'Senderos de la Sabana', cat: 'guias', sub: 'guia_profesional', address: 'Parque principal de Tenjo', lat: '4.8720', lng: '-74.1446', phone: '3135550404' }] },
  { company: 'El Fogón Sabanero S.A.S.', person: 'juridica', doc: '901765432', contact: ['Diana', 'Moreno', 'diana.moreno@DOMAIN', '3145550505'],
    est: [{ name: 'Restaurante El Fogón Sabanero', cat: 'restaurantes', sub: 'restaurante', address: 'Vía Tenjo – Chía, km 1', lat: '4.8755', lng: '-74.1390', phone: '3145550505' }] },
  { company: 'Hilos de Tenjo', person: 'natural', doc: '39654321', contact: ['Rosa Elena', 'Quintero', 'rosa.quintero@DOMAIN', '3155550606'],
    est: [{ name: 'Artesanías Hilos de Tenjo', cat: 'artesanias', address: 'Plaza de mercado, local 8', lat: '4.8709', lng: '-74.1457', phone: '3155550606' }] },
  { company: 'Parque Agroecológico Las Juntas S.A.S.', person: 'juridica', doc: '900876543', contact: ['Sergio', 'Velandia', 'sergio.velandia@DOMAIN', '3165550707'],
    est: [{ name: 'Parque Agroecológico Las Juntas', cat: 'parques', sub: 'parque_agroturismo', address: 'Vereda Guangatá', lat: '4.8820', lng: '-74.1530', phone: '3165550707' }] },
  { company: 'Hostal Camino Real', person: 'natural', doc: '79345678', contact: ['Patricia', 'Sandoval', 'patricia.sandoval@DOMAIN', '3175550808'],
    est: [{ name: 'Hostal Camino Real', cat: 'alojamiento', sub: 'hostal', address: 'Carrera 4 # 5-21', lat: '4.8724', lng: '-74.1461', phone: '3175550808' }] },
]

const fold = (t: string) => t.normalize("NFD").replace(/[0300-036f]/g, "").toLowerCase()
const domainOf = (d: Demo) => fold(d.est[0].name).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".example"
for (const d of demos) { d.contact[2] = d.contact[2].replace("DOMAIN", domainOf(d)) }
const results: any[] = []
for (const d of demos) {
  const reg = blankRegistration(schema)
  reg.companyName = d.company
  const legal = d.person === 'juridica'
  const companyOverrides: Record<string, string> = {
    tipo_persona: legal ? 'Persona jurídica' : 'Persona natural',
    field_1765917764273: 'Opero internamente en Tenjo', nombre_comercial: d.est[0].name,
    ...(legal ? { nit: d.doc, dv: '7', tipo_sociedad: 'S.A.S.', numero_act_econo: '5511', actividad_economica: 'Alojamiento y servicios turísticos',
      representante_legal: `${d.contact[0]} ${d.contact[1]}`, tipo_doc_rep_legal: 'Cédula de ciudadanía', numero_doc_rep_legal: '1020304050' } : { cedula_ciudadania: d.doc }),
    direccion: d.est[0].address, pais: 'Colombia', departamento: 'Cundinamarca', municipio: 'Tenjo',
  }
  reg.company = { ...reg.company, tipo_persona: companyOverrides.tipo_persona }
  const companyFields = () => { const s = companySections(schema, reg); return [...s.main, ...s.extra].flatMap((x: any) => x.fields) }
  fill(reg.company, companyFields(), companyOverrides, () => [reg.company, reg.company])
  fill(reg.company, companyFields(), companyOverrides, () => [reg.company, reg.company])
  reg.contact = { firstName: d.contact[0], lastName: d.contact[1], email: d.contact[2], phone: d.contact[3] }
  reg.establishments = d.est.map((e, i) => {
    const draft = blankEstablishment(schema, `demo-${i}`)
    Object.assign(draft, { name: e.name, categoryId: cat(e.cat).id, subcategoryId: e.sub ? sub(e.cat, e.sub) : '', address: e.address,
      latitude: e.lat, longitude: e.lng, phone: e.phone, email: d.contact[2], website: e.web ?? '' })
    const overrides = { tiene_rnt: 'Sí', zona_establecimiento: 'Urbana', field_1766259212093: e.phone, ...(e.values ?? {}) }
    fill(draft.values, establishmentSections(schema, draft, reg.company).flatMap((s: any) => s.fields), overrides, () => [draft.values, reg.company])
    fill(draft.values, establishmentSections(schema, draft, reg.company).flatMap((s: any) => s.fields), overrides, () => [draft.values, reg.company])
    for (const f of indicatorSections(schema, draft).flatMap((s: any) => s.fields)) draft.indicators[f.key] = guess({ ...f, required: false }, {}) ?? ''
    return draft
  })
  const errors = validateRegistration(schema, reg)
  if (Object.keys(errors).length) { console.log(d.company, errors); continue }
  const doc = toIntakeDoc(schema, reg, null)
  const { data, error } = await admin.rpc('public_form_intake', { p_form: FORM, p_doc: doc })
  console.log(d.company, error ? 'ERROR ' + error.message : JSON.stringify(data).slice(0, 200))
  results.push(data)
}
writeFileSync(new URL('./intake-results.json', import.meta.url), JSON.stringify(results, null, 1))
