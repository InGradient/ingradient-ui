#!/usr/bin/env node
// Probe: Pages/Platform/0.0.1/Auth — 10 grouped stories + 2 responsive checks.

import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = process.env.PORT ?? '6212'
const BASE = process.env.BASE_URL ?? `http://localhost:${PORT}`
const STORY_IDS = {
  loginOverview: 'pages-platform-0-0-1-auth-login-workspace--overview',
  loginSubmitting: 'pages-platform-0-0-1-auth-login-system-states--submitting',
  loginServerError: 'pages-platform-0-0-1-auth-login-system-states--server-error',
  loginPermissionDenied: 'pages-platform-0-0-1-auth-login-system-states--permission-denied',
  loginLongCredentials: 'pages-platform-0-0-1-auth-login-system-states--long-credentials',
  loginWorkflow: 'pages-platform-0-0-1-auth-login-workflows--sign-in',
  signupOverview: 'pages-platform-0-0-1-auth-signup-workspace--overview',
  signupPasswordRequirements: 'pages-platform-0-0-1-auth-signup-system-states--password-requirements',
  signupSubmitting: 'pages-platform-0-0-1-auth-signup-system-states--submitting',
  signupWorkflow: 'pages-platform-0-0-1-auth-signup-workflows--account-creation',
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function assertNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  assert(overflow === 0, `${label}: expected 0px horizontal overflow, got ${overflow}px`)
}

const cases = [
  {
    story: 'login-overview',
    id: STORY_IDS.loginOverview,
    check: async (page) => {
      await page.getByRole('heading', { name: 'Sign in' }).waitFor({ state: 'visible' })
      assert(await page.getByLabel('Email').inputValue() === '', 'login overview: email must be empty')
      const decoration = await page.getByRole('link', { name: 'Sign up' }).evaluate(
        (element) => getComputedStyle(element).textDecorationLine,
      )
      assert(decoration.includes('underline'), `login overview: link decoration is ${decoration}`)
    },
  },
  {
    story: 'login-mobile-responsive',
    id: STORY_IDS.loginOverview,
    viewport: { width: 375, height: 812 },
    check: async (page) => {
      await page.locator('[data-ig-page="platform-auth-login"]').waitFor({ state: 'visible' })
      await assertNoHorizontalOverflow(page, 'login mobile')
    },
  },
  {
    story: 'login-submitting',
    id: STORY_IDS.loginSubmitting,
    check: async (page) => {
      await page.getByRole('button', { name: 'Signing in…' }).waitFor({ state: 'visible' })
      assert(await page.getByLabel('Email').isDisabled(), 'login submitting: email must be disabled')
      assert(
        await page.locator('input[aria-label="Password"]').isDisabled(),
        'login submitting: password must be disabled',
      )
      assert(
        await page.getByRole('checkbox', { name: 'Keep me signed in' }).isDisabled(),
        'login submitting: preference must be disabled',
      )
    },
  },
  {
    story: 'login-server-error',
    id: STORY_IDS.loginServerError,
    check: async (page) => {
      await page.getByText('Server error — try again later.').waitFor({ state: 'visible' })
    },
  },
  {
    story: 'login-permission-denied',
    id: STORY_IDS.loginPermissionDenied,
    check: async (page) => {
      await page.getByText('Account suspended. Contact administrator.').waitFor({ state: 'visible' })
    },
  },
  {
    story: 'login-long-credentials',
    id: STORY_IDS.loginLongCredentials,
    check: async (page) => {
      const value = await page.getByLabel('Email').inputValue()
      assert(value.includes('incredibly-long-domain'), `login long credentials: got ${value}`)
      await assertNoHorizontalOverflow(page, 'login long credentials')
    },
  },
  {
    story: 'login-workflow',
    id: STORY_IDS.loginWorkflow,
    check: async (page) => {
      // Storybook's play runs after scenario-reset effects; wait for its final state, not just its first typed field.
      await page.waitForFunction(() => {
        const email = document.querySelector('input[aria-label="Email"]')
        const password = document.querySelector('input[aria-label="Password"]')
        const checkboxWithLabel = (label) =>
          [...document.querySelectorAll('input[type="checkbox"]')].find(
            (input) => input.closest('label')?.textContent?.includes(label),
          )
        const keepSignedIn = checkboxWithLabel('Keep me signed in')
        const rememberPassword = checkboxWithLabel('Remember password')
        return email instanceof HTMLInputElement
          && email.value === 'operator@ingradient.ai'
          && password instanceof HTMLInputElement
          && password.value === 'secure-passphrase'
          && keepSignedIn instanceof HTMLInputElement
          && keepSignedIn.checked
          && rememberPassword instanceof HTMLInputElement
          && rememberPassword.checked
      })
      assert(
        await page.getByRole('checkbox', { name: 'Keep me signed in' }).isChecked(),
        'login workflow: keep-signed-in must be checked',
      )
      assert(
        await page.getByRole('checkbox', { name: 'Remember password' }).isChecked(),
        'login workflow: remember-password must be checked',
      )
    },
  },
  {
    story: 'signup-overview',
    id: STORY_IDS.signupOverview,
    check: async (page) => {
      await page.getByRole('heading', { name: 'Sign up' }).waitFor({ state: 'visible' })
      assert(await page.getByLabel('Email').inputValue() === '', 'signup overview: email must be empty')
      const decoration = await page.getByRole('link', { name: 'Sign in' }).evaluate(
        (element) => getComputedStyle(element).textDecorationLine,
      )
      assert(decoration.includes('underline'), `signup overview: link decoration is ${decoration}`)
    },
  },
  {
    story: 'signup-mobile-responsive',
    id: STORY_IDS.signupOverview,
    viewport: { width: 375, height: 812 },
    check: async (page) => {
      await page.locator('[data-ig-page="platform-auth-signup"]').waitFor({ state: 'visible' })
      await assertNoHorizontalOverflow(page, 'signup mobile')
    },
  },
  {
    story: 'signup-password-requirements',
    id: STORY_IDS.signupPasswordRequirements,
    check: async (page) => {
      await page.getByText('Password does not meet requirements (min 8 chars).').waitFor({ state: 'visible' })
      assert(
        await page.getByLabel('Password').getAttribute('aria-invalid') === 'true',
        'signup password requirements: password must be invalid',
      )
    },
  },
  {
    story: 'signup-submitting',
    id: STORY_IDS.signupSubmitting,
    check: async (page) => {
      await page.getByRole('button', { name: 'Signing up…' }).waitFor({ state: 'visible' })
      for (const label of ['Email', 'Name', 'Organization', 'Password']) {
        assert(await page.getByLabel(label).isDisabled(), `signup submitting: ${label} must be disabled`)
      }
    },
  },
  {
    story: 'signup-workflow',
    id: STORY_IDS.signupWorkflow,
    check: async (page) => {
      await page.waitForFunction(() => {
        const email = document.querySelector('input[aria-label="Email"]')
        const name = document.querySelector('input[aria-label="Name"]')
        const organization = document.querySelector('input[aria-label="Organization"]')
        const password = document.querySelector('input[aria-label="Password"]')
        return email instanceof HTMLInputElement
          && email.value === 'new.operator@ingradient.ai'
          && name instanceof HTMLInputElement
          && name.value === 'New Operator'
          && organization instanceof HTMLInputElement
          && organization.value === 'Ingradient'
          && password instanceof HTMLInputElement
          && password.value === 'secure-passphrase'
      })
      assert(
        await page.getByLabel('Organization').inputValue() === 'Ingradient',
        'signup workflow: organization must be filled',
      )
    },
  },
]

async function startServer() {
  if (process.env.BASE_URL) return null
  const processHandle = spawn('python3', ['-m', 'http.server', PORT], {
    cwd: 'storybook-static',
    stdio: 'ignore',
  })
  for (let index = 0; index < 50; index += 1) {
    try {
      const response = await fetch(BASE)
      if (response.ok) return processHandle
    } catch {
      /* keep waiting */
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  processHandle.kill()
  throw new Error('Server never started')
}

async function main() {
  const server = await startServer()
  const browser = await chromium.launch()
  const context = await browser.newContext()
  let failed = 0

  for (const { story, id, viewport, check } of cases) {
    const page = await context.newPage()
    const consoleErrors = []
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })
    try {
      if (viewport) await page.setViewportSize(viewport)
      await page.goto(`${BASE}/iframe.html?viewMode=story&id=${id}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      })
      await page.waitForTimeout(500)
      await check(page)
      const errors = consoleErrors.filter(
        (error) => !/Failed to load resource/i.test(error) && !/X-Frame-Options/i.test(error),
      )
      if (errors.length > 0) throw new Error(`console errors:\n${errors.join('\n')}`)
      console.log(`[OK]   ${story}`)
    } catch (error) {
      failed += 1
      console.error(`[FAIL] ${story} — ${error.message.split('\n')[0]}`)
    } finally {
      await page.close()
    }
  }

  await browser.close()
  server?.kill()
  if (failed > 0) {
    console.error(`\n${failed}/${cases.length} scenarios failed.`)
    process.exit(1)
  }
  console.log(`\n${cases.length}/${cases.length} scenarios passed.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
