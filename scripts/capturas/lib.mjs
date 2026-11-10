import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
const require = createRequire('B:/repos/imctt-crm/package.json')
export const { createClient } = require('@supabase/supabase-js')
export const env = Object.fromEntries(readFileSync(new URL('./local.env', import.meta.url), 'utf8').trim().split('\n').map((l) => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^"|"$/g, '')] }))
export const admin = createClient(env.API_URL, env.SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
