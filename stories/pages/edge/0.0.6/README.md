# pages/edge/0.0.6

Edge stories organized the same way as Platform 0.0.1: each page has purpose groups
(`Workspace`, `System States`, `Workflows`), and each page's workflows live in its own
`Workflows` group. Screens and data are the same as 0.0.5; this version changes how they are
arranged and how workflows play.

## Structure

```
Pages/Edge/0.0.6/
├─ Login           Workspace (Overview · Online form) · System States
├─ License         Workspace (Overview · Bind device) · System States
├─ Dataset Select  Workspace (Overview · Online) · System States · Workflows
├─ Capture         Workspace (Overview · Setup) · System States · Workflows
│                  Review Workflows · Log and Setup Workflows
├─ Images          Workspace · Workflows
├─ Statics         Workspace
├─ Settings        Tabs (one story per tab) · Workflows · Tab Workflows
└─ App Chrome      Workflows (language, account, system monitor)
```

Canonical entries follow Platform: `pages-edge-0-0-6-<page>-workspace--overview`.
`Workspace` and `System States` show screens without steps; every story with steps is in a
`*Workflows` group. Capture has three workflow groups because they render three different
scenes (full page, review/labeling, log/setup panels).

## Slow playback

Workflow plays use `userEvent` from [`stories/support/paced-play.ts`](../../../support/paced-play.ts)
and are wrapped in `paced()`. In Storybook each action waits 700 ms, the target is outlined,
and a caption at the bottom left shows the step title and the action (`Click · Save`,
`Type "192.168.1.42" · Static IP`). Use the Interactions panel's replay to watch again.

Automated runs keep full speed: Playwright and the Vitest browser runner set
`navigator.webdriver`, so `test-storybook`, probes and visual tests skip every pause.
Add `&pace=<ms>` to an iframe URL to force a pace.

## Reuse instead of copies

0.0.6 files import the 0.0.5 story modules (and `0.0.1/License`) and override only the title,
story names and parameters. Scenes, fixtures and play steps are not copied, so a fix in 0.0.5
appears here too. The 0.0.5 stories, probes (`tests/probes/edge-routes.mjs`) and visual
snapshots stay unchanged; 0.0.5 moves to an archive only after 0.0.6 is approved.

Story code renders the same `@ingradient/edge-pages` Views as 0.0.5, so component changes
show in both versions.
