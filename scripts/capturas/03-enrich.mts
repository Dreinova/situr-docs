// Actividad de demostración: equipo, revisión, seguimiento, tareas, reportes y una encuesta.
// Todo como lo haría la app (cliente con sesión, RLS y triggers), salvo crear usuarios.
import { admin, env, createClient } from './lib.mjs'

const ORG = '1dddbe22-1eab-4816-a12f-b2c556a420f1'
const ADMIN = '8f85e636-a94a-4773-a1f1-0a4d15a4cc46'
const PASSWORD = 'Demo-Tenjo-2026'
const must = <T,>(r: { data: T; error: any }, what: string): T => { if (r.error) throw new Error(`${what}: ${r.error.message}`); return r.data }

// 1. Equipo: invitación + usuario confirmado (el trigger crea el perfil en la cuenta).
const team = [
  { email: 'gestor@demo-tenjo.test', first_name: 'Óscar', last_name: 'Beltrán', role: 'manager', job_title: 'Gestor de turismo' },
  { email: 'consulta@demo-tenjo.test', first_name: 'Natalia', last_name: 'Ruiz', role: 'sales', job_title: 'Apoyo SITUR' },
]
const ids: Record<string, string> = { admin: ADMIN }
for (const m of team) {
  const existing = must(await admin.from('profiles').select('id, first_name').eq('organization_id', ORG).eq('first_name', m.first_name), 'perfil')
  if (existing.length) { ids[m.role] = existing[0].id; continue }
  must(await admin.from('member_invitations').insert({ organization_id: ORG, email: m.email, role: m.role, first_name: m.first_name, last_name: m.last_name, invited_by: ADMIN }), 'invitación')
  const user = must(await admin.auth.admin.createUser({ email: m.email, password: PASSWORD, email_confirm: true }), 'usuario')
  must(await admin.from('profiles').update({ is_pending: false, job_title: m.job_title }).eq('id', user.user.id), 'perfil')
  ids[m.role] = user.user.id
}

// 2. Sesión del administrador demo.
const db = createClient(env.API_URL, env.PUBLISHABLE_KEY, { auth: { persistSession: false } })
must(await db.auth.signInWithPassword({ email: 'admin@demo-tenjo.test', password: PASSWORD }), 'login')

const est = must(await db.from('establishments').select('id,name').eq('organization_id', ORG).is('deleted_at', null), 'establecimientos') as { id: string; name: string }[]
const E = (name: string) => est.find((e) => e.name === name)!.id
const contactOf = async (estId: string) => (must(await db.from('establishment_contacts').select('contact_id').eq('establishment_id', estId), 'contacto') as any[])[0]?.contact_id

// 3. Revisión y responsables.
const approve = ['Glamping Mirador del Juaica', 'Café La Chucua', 'Heladería El Parque', 'Artesanías Hilos de Tenjo', 'Parque Agroecológico Las Juntas']
for (const n of approve) must(await db.from('establishments').update({ status: 'approved', status_reason: null }).eq('id', E(n)), 'aprobar')
must(await db.from('establishments').update({ status: 'rejected', status_reason: 'Falta el certificado de RNT vigente y las fotos no muestran el establecimiento. Adjunta el certificado y al menos tres fotos del lugar.' }).eq('id', E('Restaurante El Fogón Sabanero')), 'rechazar')
const owners: Record<string, string> = { 'Finca Los Arrayanes': ids.manager, 'Senderos de la Sabana': ids.manager, 'Hostal Camino Real': ids.manager, 'Café La Chucua': ids.manager }
for (const [n, owner] of Object.entries(owners)) must(await db.from('establishments').update({ owner_id: owner }).eq('id', E(n)), 'responsable')

// 4. Seguimiento en la cronología.
const day = (d: number, h = 10) => new Date(Date.UTC(2026, 10, d, h + 5)).toISOString()
const glamping = E('Glamping Mirador del Juaica')
const camila = await contactOf(glamping)
must(await db.from('activities').insert({ organization_id: ORG, created_by: ADMIN, activity_type: 'meeting', establishment_id: glamping, title: 'Visita de verificación',
  occurred_at: day(4), participant_contact_ids: [camila], body_html: '<p>Recorrimos las 6 unidades de glamping. Cuentan con RNT vigente y señalización. Quedó pendiente actualizar las fotos de la zona de fogata.</p>' }), 'reunión')
must(await db.from('activities').insert({ organization_id: ORG, created_by: ADMIN, activity_type: 'call', establishment_id: glamping, call_direction: 'outbound',
  occurred_at: day(6, 15), participant_contact_ids: [camila], body_html: '<p>Confirmó que envía el reporte de octubre esta semana.</p>' }), 'llamada')
must(await db.from('activities').insert({ organization_id: ORG, created_by: ADMIN, activity_type: 'note', establishment_id: glamping,
  body_html: `<p>Buen candidato para la feria de turismo de diciembre. <span data-mention="${ids.manager}">@Óscar Beltrán</span> ¿lo incluimos en la lista de invitados?</p>` }), 'nota')
const finca = E('Finca Los Arrayanes')
must(await db.from('activities').insert({ organization_id: ORG, created_by: ADMIN, activity_type: 'whatsapp', establishment_id: finca, call_direction: 'inbound',
  occurred_at: day(7, 11), participant_contact_ids: [await contactOf(finca)], body_html: '<p>Pregunta cuánto tarda la revisión. Le expliqué que esta semana la revisamos.</p>' }), 'whatsapp')

// 5. Tareas.
const types = Object.fromEntries((must(await db.from('task_types').select('id,name'), 'tipos') as any[]).map((t) => [t.name, t.id]))
const tasks = [
  { title: 'Revisar inscripción de Finca Los Arrayanes', type: 'Reunión', due: day(10, 9), who: [ids.admin], link: finca },
  { title: 'Llamar para completar el RNT de El Fogón Sabanero', type: 'Llamada', due: day(5, 10), who: [ids.manager], link: E('Restaurante El Fogón Sabanero') },
  { title: 'Agendar visita de campo a Senderos de la Sabana', type: 'Reunión', due: day(13, 14), who: [ids.manager, ids.admin], link: E('Senderos de la Sabana') },
  { title: 'Enviar material de la capacitación en servicio al cliente', type: 'Correo', due: day(14, 9), who: [ids.sales], link: E('Café La Chucua') },
  { title: 'Recordar el reporte de octubre a los alojamientos', type: 'Correo', due: day(11, 9), who: [ids.admin, ids.manager, ids.sales], link: glamping },
]
for (const t of tasks) {
  const task = must(await db.from('tasks').insert({ organization_id: ORG, created_by: ADMIN, title: t.title, task_type_id: types[t.type], due_at: t.due }).select('id').single(), 'tarea') as any
  must(await db.from('task_assignees').insert(t.who.map((u) => ({ organization_id: ORG, task_id: task.id, user_id: u, created_by: ADMIN }))), 'responsables')
  must(await db.from('task_establishments').insert({ organization_id: ORG, task_id: task.id, establishment_id: t.link, created_by: ADMIN }), 'asociación')
}

// 6. Encuesta publicada, con destinatarios y respuestas.
const survey = must(await db.from('surveys').insert({ organization_id: ORG, created_by: ADMIN, name: 'Ocupación en el puente festivo de noviembre',
  description: 'Ayúdanos a medir cómo les fue a los prestadores de Tenjo en el puente del 15 al 17 de noviembre.' }).select('id,public_slug').single(), 'encuesta') as any
const questions = must(await db.rpc('save_survey_questions', { p_survey: survey.id, p_questions: [
  { id: null, type: 'scale', label: '¿Cómo calificas el movimiento de visitantes en el puente?', help: '', required: true, options: [], settings: { min: 1, max: 5, min_label: 'Muy bajo', max_label: 'Muy alto' } },
  { id: null, type: 'number', label: '¿Cuántos visitantes atendiste?', help: 'Un número aproximado.', required: true, options: [], settings: { min: 0 } },
  { id: null, type: 'single_choice', label: '¿De dónde venía la mayoría?', help: '', required: true, options: ['Bogotá', 'Sabana de Bogotá', 'Otras regiones', 'Extranjeros'], settings: {} },
  { id: null, type: 'multiple_choice', label: '¿Qué te ayudaría a recibir más visitantes?', help: '', required: false, options: ['Señalización', 'Promoción en redes', 'Ferias y eventos', 'Capacitación'], settings: {} },
  { id: null, type: 'long_text', label: 'Comentarios para el Instituto', help: '', required: false, options: [], settings: {} },
] }), 'preguntas') as any[]
must(await db.from('surveys').update({ status: 'published', starts_at: day(1, 0), ends_at: day(30, 18), identity_mode: 'optional', thank_you_message: '¡Gracias! Tus respuestas nos ayudan a planear la temporada.' }).eq('id', survey.id), 'publicar')
const approved = approve.map(E)
const links = must(await db.from('survey_links').insert(approved.map((id) => ({ organization_id: ORG, survey_id: survey.id, created_by: ADMIN, establishment_id: id }))).select('token,establishment_id'), 'destinatarios') as any[]
const anon = createClient(env.API_URL, env.PUBLISHABLE_KEY, { auth: { persistSession: false } })
const answers = [
  ['5', '180', 'Bogotá', ['Promoción en redes', 'Ferias y eventos'], 'Llenamos todas las unidades el sábado.'],
  ['4', '95', 'Sabana de Bogotá', ['Señalización'], ''],
  ['3', '60', 'Bogotá', ['Promoción en redes'], 'Faltan avisos en la vía desde Chía.'],
  ['4', '40', 'Otras regiones', ['Capacitación', 'Ferias y eventos'], ''],
]
for (const [i, a] of answers.entries()) {
  const payload = Object.fromEntries(questions.map((q, j) => [q.id, a[j]]).filter(([, v]) => v !== '' && !(Array.isArray(v) && !v.length)))
  must(await anon.rpc('survey_submit', { p_slug: survey.public_slug, p_answers: payload, p_name: '', p_email: '', p_link: links[i].token }), 'respuesta')
}
console.log('listo', ids, survey.public_slug)
