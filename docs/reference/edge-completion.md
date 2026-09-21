# Edge 0.0.5 completion contract

This supersedes the unfinished inventory at the end of `edge-phase1-verification.md`. Work remains on `letta/edge-verification-contracts-d314f6bf`; no commit, push, dependency upgrade, real device call or snapshot approval is implied.

## Reachability and ownership

| Audit group | Executable surface | Contract |
|---|---|---|
| U1 account/language | `SettingsWorkflows/AccountLanguage`, normal topbar | Local account change, logout/restore and locale selection; not authentication or full translation |
| U2 dataset/project | DatasetSelect add/create/cancel workflows | Validated local forms, pending state, created fixture, focus restoration |
| U3 export | DatasetSelect export retry/cancel | Idle/running/error/retry/completion and cancellation; no file writes |
| U4 Force IP | `SettingsWorkflows/ForceIp` | IPv4/subnet validation, local camera update, cancel/Escape; no network configuration |
| U5 image filter | `ImagesWorkflows/FilterDateWorkflow` | Controlled presets/custom dates, dropdown ownership, Escape/outside close |
| U6 image operations | Images selection/group-delete/inspector workflows | Selection, request→confirm separation, synthetic deletion, keyboard navigation, shared dialog focus |
| U7 log image | `CaptureControls/LogFilterKeyboardImageWorkflow` | Actual fixture filtering, keyboard row/detail navigation, accessible enlargement |
| U8 system cleanup | `SettingsWorkflows/SystemCleanup` and footer | Confirmation, progress, cancellation/result with unmount-safe simulation timers |
| U9 capture branches | `CaptureBranches` workflows | Review, derived calculation/retry/unavailable, drawing/selection/class/zoom, save/cancel, collapsed panel, ROI toggle and local comments |
| U10 conditional settings | `SettingsWorkflows/LightingPs`, `AboutUpdate` | PS controls, update lifecycle, deactivation confirmation/code; no device or license operations |

Camera/Server edits, apply/save/reset, Settings Logs search/level/source/clear/export, cache cleanup and field-test workflows are also observable simulations. General/Lighting/Experiments/device drafts live at session scope. Images selection/filter/deletion state survives pane unmounts through `useImagesDraft`; Setup stays mounted while hidden and shares pattern selection with Capture/RightPanel. Changing the scene reset key resets the session.

## Shared contracts and deliberate non-unification

- `VerticalTabs appearance="settings"` owns the previously Platform-only item appearance; generic default variants are unchanged.
- Context menus hand focus back before invoking an action so an action-created modal can own final focus. Submenu keyboard traversal and dialog boundaries are tested.
- Dataset main selection is a native button; independent `MenuIconButton` matches Platform trigger semantics without nesting interactive controls.
- Below the normal desktop width, the workspace retains a token-based 640px center with horizontal panel scrolling and focus-driven reveal. This is constrained desktop behavior, not a new mobile shell.
- Statics section buttons expose disclosure state/control relationships. Average-size tooltips reuse `ChartTooltipContent`; trend composes `TooltipCard`, `KeyValueRow`, `ColorSwatch` because the generic tooltip currently ignores payload color.
- Compact metric cards retain shared `Card`: forcing dashboard `StatCard` would alter density/typography without a compatible contract. Pattern selectors already reuse shared `Button`; Setup's wrapping grid and RightPanel's two-column arrangement remain domain layout rather than a new generic framework.
- Images popover retains its actual 260px width but uses popup rather than chart geometry. Date-label widths follow content rather than control density. Capture rings use existing semantic colors; no new design tokens were created.

## Regression surfaces

- Edge story groups declare blocking `a11y.test: 'error'`; no failed rule is disabled.
- `scripts/style-literal-rules.test.mjs` guards mixed token/raw-color lines, entities, comments/CRLF and quoted URLs. It is a lexical color guard, not a full CSS semantic analyzer; documented domain-color exclusions remain.
- CI now runs package Stylelint and the probe's negative/positive tests. Documentation seeds include the seven Edge story files and route inventory.
- `tests/visual/edge-contract.spec.mjs` checks the 19 original routes against fresh production Storybook without creating visual baselines.
- The standalone `/edge-workspace` smoke route imports installed public Workspace/Settings exports. `tests/probes/packed-edge.mjs` verifies tab callbacks, settings slots, Escape and opener restoration against tarball-installed packages, not aliases.

## Review evidence and honest limits

Final integrated validation: 97 unit files/458 tests; 298 Storybook files/889 tests; official MCP 77 targets (all 57 Edge 0.0.5 stories + 20 shared/consumer regressions); 19 fresh-static route contracts; 12 probe regressions; six scanner regressions. No tests/rules were disabled. Full browser execution used the unchanged Vitest projects with an external two-workers-per-project resource wrapper. TypeScript, lint (four warnings, no errors), Stylelint and documentation/literal gates passed. Root UI bundle budget remained 509.3KB/550KB.

Built-surface evidence covers 26 states at 1440/768 plus two native fullscreen captures. At 768, the 640px center is fully visible (x=14–654); keyboard side-panel access and fullscreen exit restoration were asserted. Default axe's broader scan is explicitly still exit 2: 28/28 scans retain landmark/region/heading-one best-practice findings, zero WCAG-tagged violations, and incomplete results in 18 scans. Do not conflate this with the clean official Storybook a11y report.

Final commands/results and before/after screenshots are recorded in the primary checkout's dated report, `docs/reports/2026-09-20-edge-layer-audit-and-plan.ko.md` §18, and `docs/reports/assets/2026-09-20-edge-completion/`. Those report assets are intentionally not copied into this worktree. Earlier failing MCP files remain diagnostic evidence; use the final validation summary and recorded repair runs for acceptance.

Package/export/bundle/smoke/tarball build and installed Workspace runtime checks were rerun successfully after the final package repairs; the validator's earlier pending-package note is superseded by `parentFollowUp` in the final summary. All 77 official review links are collected in the primary evidence folder's `preview-links.md`.

Real camera/monitor/calibration/SAM, authentication/backend/filesystem persistence, native OS notification and physical equipment correctness are outside this UI-package simulation. Linux visual baselines require a Linux runner and review; macOS captures are evidence, never replacement baselines. Automated axe results do not certify manual screen-reader or every light/high-contrast/reduced-motion state. A document still owns one active root preset; multi-service simultaneous preset composition is not introduced here.
