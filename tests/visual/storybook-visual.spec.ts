import { expect, test } from '@playwright/test'

type StoryTarget = {
  name: string
  id: string
  readyText: string
  fullPage?: boolean
}

const stories: StoryTarget[] = [
  // Foundations / Patterns / 기존
  {
    name: 'foundations-token-overview',
    id: 'foundations-token-overview--overview',
    readyText: 'Foundation Tokens',
    fullPage: true,
  },
  {
    name: 'patterns-shell-and-layouts',
    id: 'patterns-shell-and-layouts--overview',
    readyText: 'Shell And Layout Patterns',
    fullPage: true,
  },
  {
    name: 'sandboxes-theme-lab',
    id: 'sandboxes-theme-lab--overview',
    readyText: 'Theme Lab',
    fullPage: true,
  },
  {
    name: 'pages-table-page',
    id: 'pages-table-page--default',
    readyText: 'Workspace Directory',
    fullPage: true,
  },

  // Platform pages (Phase 9)
  { name: 'pages-platform-0-0-1-auth-login', id: 'pages-platform-0-0-1-auth-login--default', readyText: 'Sign in', fullPage: true },
  { name: 'pages-platform-0-0-1-auth-signup', id: 'pages-platform-0-0-1-auth-signup--default', readyText: 'Sign up', fullPage: true },
  { name: 'pages-platform-0-0-1-catalog', id: 'pages-platform-0-0-1-catalog--default', readyText: 'Catalog', fullPage: true },
  { name: 'pages-platform-0-0-1-classmanage', id: 'pages-platform-0-0-1-classmanage--default', readyText: 'Classes', fullPage: true },
  { name: 'pages-platform-0-0-1-createproject', id: 'pages-platform-0-0-1-createproject--default', readyText: 'Create Project', fullPage: true },

  // Edge pages (Phase 6)
  { name: 'pages-edge-0-0-1-login', id: 'pages-edge-0-0-1-login--online', readyText: 'Edge Sign in', fullPage: true },
  { name: 'pages-edge-0-0-1-license', id: 'pages-edge-0-0-1-license--valid', readyText: 'License', fullPage: true },
  { name: 'pages-edge-0-0-1-datasetselect', id: 'pages-edge-0-0-1-datasetselect--with-datasets', readyText: 'Edge Workstation', fullPage: true },

  // Medical pages (Phase 6)
  { name: 'pages-medical-0-0-1-auth', id: 'pages-medical-0-0-1-auth--login', readyText: 'medilabel', fullPage: true },
  { name: 'pages-medical-0-0-1-projectpicker', id: 'pages-medical-0-0-1-projectpicker--default', readyText: 'Cases', fullPage: true },
  { name: 'pages-medical-0-0-1-classworkspace', id: 'pages-medical-0-0-1-classworkspace--default', readyText: 'Label classes', fullPage: true },

]

async function openStory(page: import('@playwright/test').Page, story: StoryTarget) {
  await page.goto(`/iframe.html?id=${story.id}&viewMode=story`)
  await page.getByText(story.readyText, { exact: false }).first().waitFor({ state: 'visible' })
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
