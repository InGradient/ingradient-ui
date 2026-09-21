const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]'

/** Tab exits a menu from its trigger's position, not from the popup's DOM position.
 * Keep an enclosing modal's focus boundary; non-modal boundaries retain the trigger.
 */
export function focusAfterMenuTab(anchor: HTMLElement | null, backwards: boolean) {
  if (!anchor?.isConnected) return
  const dialog = anchor.closest<HTMLElement>('[role="dialog"], [role="alertdialog"]')
  const scope = dialog ?? anchor.ownerDocument.body
  const candidates = Array.from(scope.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((element) => {
    if (element.tabIndex < 0 || element.matches(':disabled') || element.closest('[hidden], [inert], [role="menu"]')) return false
    for (let parent: HTMLElement | null = element; parent; parent = parent.parentElement) {
      const style = getComputedStyle(parent)
      if (style.display === 'none' || style.visibility === 'hidden') return false
    }
    return true
  }).sort((a, b) => (a.tabIndex || Infinity) - (b.tabIndex || Infinity))
  const index = candidates.indexOf(anchor)
  if (index < 0) return
  const next = index + (backwards ? -1 : 1)
  const target = candidates[next] ?? (dialog ? candidates[(next + candidates.length) % candidates.length] : anchor)
  target?.focus()
}
