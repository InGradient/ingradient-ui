import { expect, test } from '@playwright/test'

type StoryTarget = {
  name: string
  id: string
  readyText: string
  readyRole?: 'dialog'
  fullPage?: boolean
}

const stories: StoryTarget[] = [
  // Foundation and sandbox review surfaces
  {
    name: 'foundations-token-overview',
    id: 'foundations-token-overview--overview',
    readyText: 'Token system',
    fullPage: true,
  },
  {
    name: 'sandboxes-theme-lab',
    id: 'sandboxes-theme-lab--overview',
    readyText: 'Theme Lab',
    fullPage: true,
  },

  // Platform pages (Phase 9)
  { name: 'pages-platform-0-0-1-auth-login', id: 'pages-platform-0-0-1-auth-login-workspace--overview', readyText: 'Sign in', fullPage: true },
  { name: 'pages-platform-0-0-1-auth-signup', id: 'pages-platform-0-0-1-auth-signup-workspace--overview', readyText: 'Sign up', fullPage: true },
  { name: 'pages-platform-0-0-1-dataset-catalog', id: 'pages-platform-0-0-1-dataset-catalog-workspace--overview', readyText: 'Catalog', fullPage: true },
  { name: 'pages-platform-0-0-1-class-management', id: 'pages-platform-0-0-1-class-management-workspace--overview', readyText: 'Classes', fullPage: true },
  { name: 'pages-platform-0-0-1-settings-modal', id: 'pages-platform-0-0-1-settings-modal-general--preferences', readyText: 'Settings', readyRole: 'dialog', fullPage: true },
  { name: 'pages-platform-0-0-1-create-project', id: 'pages-platform-0-0-1-create-project-workspace--overview', readyText: 'Create Project', fullPage: true },
  { name: 'pages-platform-0-0-1-dashboard', id: 'pages-platform-0-0-1-dashboard-workspace--overview', readyText: 'Dashboard', fullPage: true },

  // Edge pages (Phase 6)
  { name: 'pages-edge-0-0-1-login', id: 'pages-edge-0-0-1-login--online', readyText: 'INGRADIENT Edge', fullPage: true },
  { name: 'pages-edge-0-0-1-license', id: 'pages-edge-0-0-1-license--valid', readyText: 'License', fullPage: true },
  { name: 'pages-edge-0-0-1-datasetselect', id: 'pages-edge-0-0-1-datasetselect--with-groups', readyText: 'Datasets', fullPage: true },

  // Medical pages (Phase 6)
  { name: 'pages-medical-0-0-1-auth', id: 'pages-medical-0-0-1-auth--login', readyText: 'medilabel', fullPage: true },
  { name: 'pages-medical-0-0-1-projectpicker', id: 'pages-medical-0-0-1-projectpicker--default', readyText: 'Cases', fullPage: true },
  { name: 'pages-medical-0-0-1-classworkspace', id: 'pages-medical-0-0-1-classworkspace--default', readyText: 'Label classes', fullPage: true },

]

async function openStory(page: import('@playwright/test').Page, story: StoryTarget) {
  await page.goto(`/iframe.html?id=${story.id}&viewMode=story`)
  const ready = story.readyRole
    ? page.getByRole(story.readyRole, { name: story.readyText })
    : page.getByText(story.readyText, { exact: false }).first()
  await ready.waitFor({ state: 'visible' })
  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        transition: none !important;
        animation: none !important;
        caret-color: transparent !important;
      }
    `,
  })
}

for (const story of stories) {
  test(`visual snapshot: ${story.name}`, async ({ page }) => {
    await openStory(page, story)
    await expect(page).toHaveScreenshot(`${story.name}.png`, {
      animations: 'disabled',
      caret: 'hide',
      fullPage: story.fullPage ?? false,
    })
  })
}
