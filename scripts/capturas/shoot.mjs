// Capturas de la documentación con la cuenta de demostración.
//   node shoot.mjs <salida> [nombre...]   (sin nombres: todas)
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const BASE = 'http://localhost:5179'
const OUT = process.argv[2]
const only = new Set(process.argv.slice(3))
mkdirSync(OUT, { recursive: true })
const exe = join(process.env.LOCALAPPDATA, 'ms-playwright/chromium-1194/chrome-win/chrome.exe')
const browser = await chromium.launch({ executablePath: exe })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'es-CO', timezoneId: 'America/Bogota', colorScheme: 'light' })
const page = await ctx.newPage()
page.on('pageerror', (e) => console.log('pageerror', e.message))

async function settle() {
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.waitForTimeout(900)
}
async function shot(name, { full = false, clip } = {}) {
  await settle()
  await page.mouse.move(1435, 895)
  // El enlace público se arma con el origen: se muestra con el dominio real.
  await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    for (let n = walker.nextNode(); n; n = walker.nextNode())
      if (n.nodeValue.includes('localhost:5179')) n.nodeValue = n.nodeValue.replaceAll('http://localhost:5179', 'https://crm.tenjoculturayturismo.gov.co')
  })
  await page.waitForTimeout(300)
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: full, clip })
  console.log('ok', name)
}
const want = (name) => !only.size || only.has(name)

// Sesión
await page.goto(`${BASE}/login`)
if (want('login')) await shot('login')
await page.fill('input[type=email]', 'admin@demo-tenjo.test')
await page.fill('input[type=password]', 'Demo-Tenjo-2026')
await page.keyboard.press('Enter')
await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 20000 })

const shots = JSON.parse(process.env.SHOTS ?? '[]')
for (const s of shots) {
  if (!want(s.name)) continue
  await page.goto(BASE + s.path)
  await settle()
  for (const step of s.steps ?? []) {
    if (step.click) await page.getByText(step.click, { exact: step.exact ?? true }).first().click()
    if (step.role) await page.getByRole(step.role[0], { name: step.role[1], exact: true }).first().click()
    if (step.select) await page.getByLabel(step.select[0], { exact: true }).first().selectOption({ label: step.select[1] }).catch(async () => {
      await page.getByLabel(step.select[0], { exact: true }).first().click(); await page.getByRole('option', { name: step.select[1] }).click()
    })
    if (step.inMain) await page.locator('main').getByRole(step.inMain[0], { name: step.inMain[1], exact: false }).first().click()
    if (step.fill) await page.getByLabel(step.fill[0], { exact: false }).first().fill(step.fill[1])
    if (step.next) await page.getByRole('button', { name: 'Continuar', exact: true }).click()
    if (step.scroll) await page.evaluate((y) => window.scrollTo(0, y), step.scroll)
    if (step.wait) await page.waitForTimeout(step.wait)
    await page.waitForTimeout(400)
  }
  await shot(s.name, { full: s.full })
}
await browser.close()
