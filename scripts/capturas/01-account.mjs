import { admin } from './lib.mjs'
const users = [
  { email: 'admin@demo-tenjo.test', first_name: 'Laura', last_name: 'Rincón', job_title: 'Coordinadora de turismo', organization_name: 'IMCTT (demostración)', organization_nit: '900111222-3' },
]
for (const u of users) {
  const { email, ...meta } = u
  const { data, error } = await admin.auth.admin.createUser({ email, password: 'Demo-Tenjo-2026', email_confirm: true, user_metadata: meta })
  console.log(email, error ? 'ERROR ' + error.message : data.user.id)
}
