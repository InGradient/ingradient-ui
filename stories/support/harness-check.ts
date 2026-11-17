/**
 * Story harness check: page stories must not draw test-only harness text.
 *
 * Mock-action results and values that play functions read belong in `StoryStatus` / `StoryProbe`
 * (stories/support/story-probe.tsx), which keep them in the DOM for tests and screen readers but never
 * draw them. This fails a checked page story (Platform 0.0.1, Edge 0.0.6) when a raw, unstyled
 * `role="status"` element or `<output>` is visible. Product components always carry a styled-components
 * class, so an element without a class is story code.
 */

const CHECKED_TITLES = ['Pages/Platform/0.0.1/', 'Pages/Edge/0.0.6/']

export function findVisibleHarness(root: Element): string[] {
  const out: string[] = []
  for (const el of root.querySelectorAll<HTMLElement>('output, [role="status"]')) {
    if (el.closest('[data-story-harness]')) continue
    if (el.getAttribute('class')) continue
    // A product wrapper (role only) whose visible content is a styled child is fine.
    if (el.children.length > 0 && [...el.children].every((c) => c.getAttribute('class'))) continue
    const text = (el.textContent || '').trim()
    if (!text) continue
    const r = el.getBoundingClientRect()
    if (r.width <= 1 || r.height <= 1) continue
    out.push(`<${el.tagName.toLowerCase()}${el.getAttribute('aria-label') ? ` aria-label="${el.getAttribute('aria-label')}"` : ''}> "${text.slice(0, 60)}"`)
  }
  return out
}

/** Preview `afterEach` for automated runs. Opt out with `parameters.storyHarness = 'off'` and a reason. */
export async function harnessCheckAfterEach({ title, parameters, canvasElement }: { title: string; parameters: Record<string, unknown>; canvasElement: HTMLElement }) {
  if (typeof window === 'undefined' || !window.navigator.webdriver) return
  if (parameters.storyHarness === 'off') return
  if (!CHECKED_TITLES.some((prefix) => title.startsWith(prefix))) return
  const found = findVisibleHarness(canvasElement.ownerDocument.body)
  if (found.length === 0) return
  throw new Error(`${found.length} story harness element(s) drawn on the page; use StoryStatus / StoryProbe (stories/support/story-probe.tsx):\n  ${found.join('\n  ')}`)
}
