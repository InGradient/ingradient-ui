import { expect, test } from '@playwright/test'

type StoryTarget = {
  name: string
  id: string
  readyText: string
  fullPage?: boolean
}

const stories: StoryTarget[] = [
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
