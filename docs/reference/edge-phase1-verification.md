# Edge phase 1: preset and verification contract

> Historical first-checkpoint evidence. The remaining implementation inventory is now handled in [Edge completion](edge-completion.md); use that document and the primary dated report §18 for the current integration result, not the incomplete list below.

## Integrated checkpoint (after the preset-only run below)

The branch now also contains shared selection-action/SettingsRow/dialog/tab accessibility repairs, Edge Settings draft workflows, capture keyboard locking, mock dialog closure, log labels/scroll focus, readable dataset class/task text, and the Images visible Select all label. The original phase-1 evidence below is chronological, not the final accessibility result.

- Edge 0.0.5 Login/DatasetSelect/Workspace now explicitly use `a11y.test: 'error'` without disabling rules.
- Final official MCP run: **all 30 Edge stories pass**, with no accessibility violations reported in that run (19 original + 11 workflows).
- Shared/consumer workflow run: **19 interaction stories passed**; its earlier OD contrast finding was subsequently fixed with the existing accent-soft token.
- Integrated unit suite: **78 files / 372 tests passed**; 12 probe regressions passed; TypeScript, lint (six existing warnings), and all three package builds passed. The final Images label/Story assertion was additionally checked by the 30-story MCP run.
- Primary report evidence: `docs/reports/assets/2026-09-20-edge-phase1/blocking-edge-final.json`, `workflows-browser-final.json`, `final-consumer-mcp.json`. The dated report §17 contains before/after review links and remaining work. These primary-checkout assets are not copied into the worktree.
- Full default-axe audit, every hidden branch, Linux visual baseline, packed Workspace consumer and real hardware are not implied by the Storybook gate. No commit or baseline update was made.
- Still pending: menu appearance consolidation, broader state/data wiring, context-menu focus ownership, Dataset card keyboard selection, log keyboard details, viewport policy, raw-literal checker repair and unreachable branches. Do not describe this checkpoint as completion of the entire audit plan.

## Scope and ownership

This slice changes only Storybook preset resolution, comfortable density reset, regression tests, and read-only route verification. It creates no Edge 0.0.5 design preset and does not change page/shared control implementations, fixture callbacks, global a11y policy, dependencies, or visual baselines.

Other agents concurrently edited shared accessibility and Edge runtime/story files in this worktree. Consequently the final captures and aggregate test run describe the **combined worktree**, not an isolated preset-only before/after. In particular, the Capture placeholder and Settings focus outline visible in the captures must not be attributed to this resolver slice. No concurrent edits were reverted.

## Resolution and density policy

1. `handoff.preset`, when supplied, must exactly identify a registered preset. Unknown/empty IDs throw; no fallback hides a typo.
2. An explicit preset must belong to `handoff.service` when service is supplied. Cross-service declarations throw.
3. Explicit preset without service is valid and supplies the service identity.
4. Without an explicit preset, match service and version. A missing version retains the existing `0.0.1` sandbox default. Unknown service/version and absent handoff remain no-preset.
5. Edge story composition `0.0.5` explicitly declares design preset `edge-0.0.1`; root `data-ig-version` therefore correctly remains `0.0.1`.
6. No-preset + inherit retains default dark mode/default token sizes and no preset/density metadata. Explicit density toolbar choices now intentionally work without manufacturing a preset.
7. Comfortable explicitly restores the existing canonical control sizes; an empty override previously left compact preset sizes in effect.

| Density | sm / md / lg |
|---|---|
| Inherited Edge / compact | 28 / 32 / 40px |
| Comfortable / inherited Medical / default no-preset | 32 / 36 / 44px |
| Ultra-dense | 24 / 28 / 32px |

The existing single-document provider is reused. Multiple simultaneously mounted providers, Docs compositions, mode metadata synchronization, and nested portal stacks remain separate scope.

## Frozen population and executable commands

`tests/probes/edge-routes.mjs` freezes the original 19 canonical IDs: Login 4, DatasetSelect 6, Workspace 9. Missing/renamed routes fail. Later workflow stories are disclosed as `additionalRoutesNotAudited`, never silently included in these 19. At the final run there were 30 published Edge 0.0.5 stories; 11 concurrently added workflow stories were outside this probe population.

The probe navigates isolated browser pages, checks actual render identity/readiness, visible fixture content, preset attributes, root/body/canvas/control tokens, and Settings body-portal/control agreement. It does not invoke product callbacks, mutate controller state, call devices/APIs, or update snapshots. The frozen route contract is **initial render**, not authentication, persistence, capture success, or callback completion. Runtime workflows require their own interaction tests.

```sh
# Start only after checking that 6016 is free; primary 6015 is read-only.
npm run storybook -- --port 6016 --ci --no-open

npm run test:unit -- .storybook/resolve-preset.test.ts src/tokens/presets/PresetProvider.test.tsx
node --test tests/probes/edge-contract.test.mjs

# Contract gate plus current accessibility AUDIT; violations remain in the JSON.
STORYBOOK_URL=http://localhost:6016 node tests/probes/edge.mjs

# Optional strict a11y gate; currently ungreen, not wired into existing CI.
STORYBOOK_URL=http://localhost:6016 node tests/probes/edge.mjs --a11y-gate

# Optional evidence directory: JSON + 1440x1000 captures, not baseline snapshots.
OUTPUT_DIR=/absolute/evidence/directory node tests/probes/edge.mjs
```

Exit codes: `0` means contract/runner checks passed (audit mode does NOT mean accessible); `1` means readiness/preset/token/runtime/axe-runner failure; `2` means the optional a11y gate found violations. Tests explicitly exercise bad readiness, wrong/absent presets, wrong scope tokens, wrong portal placement, and audit-vs-gate exit behavior.

The scanner uses axe's default full rule set and retains `violations`, `incomplete`, passes, and any collision retries. This is broader than phase-0's WCAG-tag-limited scans: landmark/region/title-only findings must not be described as newly introduced regressions solely because phase 0 did not report them.

## Results, 2026-09-20

- New focused Vitest tests: **28 passed** (20 resolver, 8 provider).
- New Node probe tests: **12 passed**. A read-only live negative check against unchanged primary Storybook 6015 also confirmed the same browser contract rejects its missing Edge preset.
- Combined worktree unit rerun: **76 files / 363 tests passed** with `--maxWorkers=2`.
- `npx tsc --noEmit`: **passed**.
- `npm run build:package`: **passed** for UI, Platform pages, Edge pages.
- Focused ESLint for resolver/tests/density: **passed**; final `git diff --check`: **passed**.
- Browser: **28/28 readiness/preset/token contracts passed**: 19 original routes, 3 extra Settings densities, Platform, Medical, and no-preset sandbox at inherit + 3 explicit densities. Settings root/body/canvas/dialog/control measurements matched the table above.
- Strict accessibility gate: **exit 2**, 27/28 scans with violations, zero axe runner errors. 14 scans have WCAG-tagged violations. For the original 19 alone, 18 scans have any-rule violations, 11 have WCAG-tagged violations. Capturing has zero violations in its current inert initial DOM; this is not full workflow approval.
- Remaining rules: `color-contrast`, `label`, `scrollable-region-focusable`; broader default rules also include `landmark-one-main`, `page-has-heading-one`, `region`, `label-title-only`.
- SequenceFailed logs an existing `<div>` inside `<p>` DOM nesting warning. Console errors are preserved in evidence, separate from uncaught runtime/readiness errors.
- MCP: official instructions and documentation read before edits via installed CommonJS SDK/direct HTTP; all 22 preview URLs returned. Final focused `run-story-tests(a11y:true)` reports **6 passing story executions**, with Dataset Offline `color-contrast` and Settings `scrollable-region-focusable` violations still reported. Story execution passing is NOT a11y passing under the unchanged global `test: 'todo'` policy.
- The first MCP attempt failed to boot the runner within 30 seconds and closed its server connection. Warm retry succeeded. Initial probe selector/portal assumptions and concurrent indexing errors were corrected, not counted as product defects. An initial unconstrained full unit run failed five tests; bounded-worker rerun passed. Initial TypeScript errors were in concurrently edited Settings props and disappeared when that work settled.

Evidence is in the **primary checkout's report assets only** at `docs/reports/assets/2026-09-20-edge-phase1/`: `verified/route-audit.json` and 28 PNGs are the final browser evidence; `mcp-verification.json` contains final previews/test output; `initial-validation-errors.json` distinguishes earlier failures. The root `route-audit.json` and `final/route-audit.json` are earlier failed diagnostic attempts, not final acceptance. No report markdown or primary UI was edited by this slice.

Next: review the combined-worktree scope with the coordinator, retain accessibility as visibly ungreen, verify the 11 additional workflows separately, and continue the approved shared-a11y/runtime sequence. Do not promote these captures to passing visual baselines. Full CI, Linux snapshots, all Settings tab states, narrow layouts, light/reduced-motion, and actual devices remain unverified by this slice.

## MCP preview URLs

- http://localhost:6016/?path=/story/pages-edge-0-0-5-login--offline
- http://localhost:6016/?path=/story/pages-edge-0-0-5-login--offline-no-package
- http://localhost:6016/?path=/story/pages-edge-0-0-5-login--online-form
- http://localhost:6016/?path=/story/pages-edge-0-0-5-login--error
- http://localhost:6016/?path=/story/pages-edge-0-0-5-datasetselect--offline
- http://localhost:6016/?path=/story/pages-edge-0-0-5-datasetselect--online
- http://localhost:6016/?path=/story/pages-edge-0-0-5-datasetselect--loading
- http://localhost:6016/?path=/story/pages-edge-0-0-5-datasetselect--empty
- http://localhost:6016/?path=/story/pages-edge-0-0-5-datasetselect--fetch-error
- http://localhost:6016/?path=/story/pages-edge-0-0-5-datasetselect--session-expired
- http://localhost:6016/?path=/story/pages-edge-0-0-5-workspace--capture
- http://localhost:6016/?path=/story/pages-edge-0-0-5-workspace--images
- http://localhost:6016/?path=/story/pages-edge-0-0-5-workspace--statics
- http://localhost:6016/?path=/story/pages-edge-0-0-5-workspace--setup
- http://localhost:6016/?path=/story/pages-edge-0-0-5-workspace--capturing
- http://localhost:6016/?path=/story/pages-edge-0-0-5-workspace--sequence-failed
- http://localhost:6016/?path=/story/pages-edge-0-0-5-workspace--log-filter-open
- http://localhost:6016/?path=/story/pages-edge-0-0-5-workspace--offline
- http://localhost:6016/?path=/story/pages-edge-0-0-5-workspace--settings
- http://localhost:6016/?path=/story/pages-platform-0-0-1-auth-login-workspace--overview
- http://localhost:6016/?path=/story/pages-medical-0-0-1-auth--login
- http://localhost:6016/?path=/story/sandboxes-theme-lab--overview
