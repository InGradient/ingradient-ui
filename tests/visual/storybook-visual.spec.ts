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
  { name: 'pages-platform-auth-login', id: 'pages-platform-auth-login--default', readyText: 'Sign in', fullPage: true },
  { name: 'pages-platform-auth-signup', id: 'pages-platform-auth-signup--default', readyText: 'Sign up', fullPage: true },
  { name: 'pages-platform-catalog', id: 'pages-platform-catalog--default', readyText: 'Catalog', fullPage: true },
  { name: 'pages-platform-classmanage', id: 'pages-platform-classmanage--default', readyText: 'Classes', fullPage: true },
  { name: 'pages-platform-createproject', id: 'pages-platform-createproject--default', readyText: 'Add Project', fullPage: true },

  // Edge pages (Phase 6)
  { name: 'pages-edge-login', id: 'pages-edge-login--online', readyText: 'Edge Sign in', fullPage: true },
  { name: 'pages-edge-license', id: 'pages-edge-license--valid', readyText: 'License', fullPage: true },
  { name: 'pages-edge-datasetselect', id: 'pages-edge-datasetselect--with-datasets', readyText: 'Edge Workstation', fullPage: true },

  // Medical pages (Phase 6)
  { name: 'pages-medical-auth', id: 'pages-medical-auth--login', readyText: 'medilabel', fullPage: true },
  { name: 'pages-medical-projectpicker', id: 'pages-medical-projectpicker--default', readyText: 'Cases', fullPage: true },
  { name: 'pages-medical-classworkspace', id: 'pages-medical-classworkspace--default', readyText: 'Label classes', fullPage: true },

  // Sandboxes (Phase 12)
  { name: 'sandboxes-platform-densecatalog', id: 'sandboxes-platform-densecatalog--default', readyText: 'ultra-dense experiment', fullPage: true },
  { name: 'sandboxes-edge-mobilecaptureui', id: 'sandboxes-edge-mobilecaptureui--default', readyText: 'Swipe to select device', fullPage: true },
  { name: 'sandboxes-medical-viewerlightmode', id: 'sandboxes-medical-viewerlightmode--default', readyText: 'DICOM viewer', fullPage: true },
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
