# Storybook Migration Tracker

이 문서는 제거된 `apps/design-showcase`의 live example가 Storybook으로 어떻게 이관되었는지 추적하는 실행 inventory다.

상세 전략은 [storybook-adoption-plan.md](./storybook-adoption-plan.md)를 본다.

## Status Rules

- `done`: Storybook에 직접 대응 story가 있고, 팀이 showcase 대신 Storybook을 먼저 봐도 되는 상태
- `partial`: Storybook 대응은 있지만 1:1 parity가 아니거나 family 일부만 옮겨진 상태
- `pending`: 아직 Storybook에서 직접 검토할 대응면이 부족한 상태

## Snapshot

| 영역 | done | partial | pending |
| --- | --- | --- | --- |
| Components | 24 | 0 | 0 |
| New Components / Utilities | 13 | 0 | 0 |
| Patterns | 8 | 0 | 0 |

## Components

| example id | showcase source | Storybook target | 유형 | 상태 | showcase 종료 |
| --- | --- | --- | --- | --- | --- |
| `button` | `apps/design-showcase/src/docs/components.tsx` | `src/components/inputs/button.stories.tsx` | component | done | yes |
| `text-field` | `apps/design-showcase/src/docs/components.tsx` | `src/components/inputs/text-fields.stories.tsx`, `search-field.stories.tsx`, `number-field.stories.tsx`, `mention-textarea.stories.tsx` | component | done | yes |
| `select` | `apps/design-showcase/src/docs/components.tsx` | `src/components/inputs/select-field.stories.tsx` | component | done | yes |
| `checkbox-switch` | `apps/design-showcase/src/docs/components.tsx` | `src/components/inputs/toggles.stories.tsx` | component | done | yes |
| `avatar-badge` | `apps/design-showcase/src/docs/components.tsx` | `src/components/feedback/avatar-badge.stories.tsx`, `notification-badge.stories.tsx` | component | done | yes |
| `notification-badge` | `apps/design-showcase/src/docs/components.tsx` | `src/components/feedback/notification-badge.stories.tsx` | component | done | yes |
| `data-grid` | `apps/design-showcase/src/docs/components.tsx` | `src/components/data-display/table.stories.tsx` | component | done | yes |
| `image-grid` | `apps/design-showcase/src/docs/components.tsx` | `src/components/data-display/image-grid.stories.tsx` | component | done | yes |
| `charts` | `apps/design-showcase/src/docs/components.tsx` | `src/components/charts/charts.stories.tsx` | component | done | yes |
| `progress` | `apps/design-showcase/src/docs/components.tsx` | `src/components/feedback/progress.stories.tsx` | component | done | yes |
| `workspace-blocks` | `apps/design-showcase/src/docs/components.tsx` | `stories/patterns/workspace-blocks.stories.tsx` | pattern | done | yes |
| `alert` | `apps/design-showcase/src/docs/components.tsx` | `src/components/feedback/alert.stories.tsx` | component | done | yes |
| `empty-loading` | `apps/design-showcase/src/docs/components.tsx` | `empty-state.stories.tsx`, `spinner.stories.tsx`, `stories/sandboxes/state-matrix.stories.tsx`, `workspace-api-page.stories.tsx` | component/page | done | yes |
| `spinner` | `apps/design-showcase/src/docs/components.tsx` | `src/components/feedback/spinner.stories.tsx` | component | done | yes |
| `card` | `apps/design-showcase/src/docs/components.tsx` | `src/components/surfaces.stories.tsx` | component | done | yes |
| `accordion` | `apps/design-showcase/src/docs/components.tsx` | `src/components/surfaces.stories.tsx` | component | done | yes |
| `navigation` | `apps/design-showcase/src/docs/components.tsx` | `src/components/navigation/navigation-family.stories.tsx`, `tabs.stories.tsx`, `vertical-tabs.stories.tsx` | component | done | yes |
| `vertical-tabs` | `apps/design-showcase/src/docs/components.tsx` | `src/components/navigation/vertical-tabs.stories.tsx` | component | done | yes |
| `icons` | `apps/design-showcase/src/docs/components.tsx` | `src/components/icons/icon-gallery.stories.tsx` | component | done | yes |
| `dialog` | `apps/design-showcase/src/docs/components.tsx` | `src/components/overlays/dialog-shell.stories.tsx` | component | done | yes |
| `overlay-blocks` | `apps/design-showcase/src/docs/components.tsx` | `stories/patterns/overlay-blocks.stories.tsx` | pattern | done | yes |
| `drawer` | `apps/design-showcase/src/docs/components.tsx` | `src/components/overlays/drawer.stories.tsx` | component | done | yes |
| `tooltip` | `apps/design-showcase/src/docs/components.tsx` | `src/components/overlays/tooltip.stories.tsx` | component | done | yes |
| `context-menu` | `apps/design-showcase/src/docs/components.tsx` | `src/components/overlays/context-menu.stories.tsx` | component | done | yes |

## New Components / Utilities

| example id | showcase source | Storybook target | 유형 | 상태 | showcase 종료 |
| --- | --- | --- | --- | --- | --- |
| `hooks` | `apps/design-showcase/src/docs/new-components.tsx` | `stories/sandboxes/hooks-lab.stories.tsx` | sandbox | done | yes |
| `search-field` | `apps/design-showcase/src/docs/new-components.tsx` | `src/components/inputs/search-field.stories.tsx` | component | done | yes |
| `number-field` | `apps/design-showcase/src/docs/new-components.tsx` | `src/components/inputs/number-field.stories.tsx` | component | done | yes |
| `mention-textarea` | `apps/design-showcase/src/docs/new-components.tsx` | `src/components/inputs/mention-textarea.stories.tsx` | component | done | yes |
| `selection-action-bar` | `apps/design-showcase/src/docs/new-components.tsx` | `src/components/feedback/selection-action-bar.stories.tsx`, `stories/sandboxes/hooks-lab.stories.tsx` | component/sandbox | done | yes |
| `empty-state` | `apps/design-showcase/src/docs/new-components.tsx` | `src/components/feedback/empty-state.stories.tsx` | component | done | yes |
| `image-viewer` | `apps/design-showcase/src/docs/new-components.tsx` | `src/components/data-display/image-viewer.stories.tsx` | component | done | yes |
| `drawing-layer` | `apps/design-showcase/src/docs/new-components.tsx` | `src/components/data-display/drawing-layer.stories.tsx`, `src/components/data-display/image-viewer.stories.tsx` | component | done | yes |
| `comment-thread` | `apps/design-showcase/src/docs/new-components.tsx` | `src/components/data-display/comment-thread.stories.tsx` | component | done | yes |
| `tag-list` | `apps/design-showcase/src/docs/new-components.tsx` | `src/components/data-display/tag-list.stories.tsx` | component | done | yes |
| `date-picker` | `apps/design-showcase/src/docs/new-components.tsx` | `src/components/inputs/date-picker.stories.tsx` | component | done | yes |
| `interaction-utils` | `apps/design-showcase/src/docs/new-components.tsx` | `stories/sandboxes/interaction-utils-lab.stories.tsx` | sandbox | done | yes |
| `layout-utils` | `apps/design-showcase/src/docs/new-components.tsx` | `stories/sandboxes/interaction-utils-lab.stories.tsx` | sandbox | done | yes |

## Patterns

| example id | showcase source | Storybook target | 유형 | 상태 | showcase 종료 |
| --- | --- | --- | --- | --- | --- |
| `app-shell` | `apps/design-showcase/src/docs/patterns.tsx` | `stories/patterns/shell-and-layouts.stories.tsx` | pattern | done | yes |
| `sidebar-shell` | `apps/design-showcase/src/docs/patterns.tsx` | `stories/patterns/shell-and-layouts.stories.tsx` | pattern | done | yes |
| `toolbar` | `apps/design-showcase/src/docs/patterns.tsx` | `stories/patterns/shell-and-layouts.stories.tsx` | pattern | done | yes |
| `split-layout` | `apps/design-showcase/src/docs/patterns.tsx` | `stories/patterns/shell-and-layouts.stories.tsx` | pattern | done | yes |
| `form-section` | `apps/design-showcase/src/docs/patterns.tsx` | `stories/patterns/form-sections.stories.tsx`, `stories/sandboxes/interaction-utils-lab.stories.tsx`, `stories/pages/settings-workspace-page.stories.tsx` | pattern/page | done | yes |
| `dashboard-grid` | `apps/design-showcase/src/docs/patterns.tsx` | `stories/patterns/dashboard-grid.stories.tsx`, `stories/patterns/shell-and-layouts.stories.tsx` | pattern | done | yes |
| `list-detail` | `apps/design-showcase/src/docs/patterns.tsx` | `stories/patterns/shell-and-layouts.stories.tsx` | pattern | done | yes |
| `settings-shell` | `apps/design-showcase/src/docs/patterns.tsx` | `stories/pages/settings-workspace-page.stories.tsx`, `shell-and-layouts.stories.tsx` | page/pattern | done | yes |

## Remaining Priority Work

1. 오래된 reference 문서에서 Storybook 이전 dead path를 계속 제거
2. Storybook과 `docs/reference` 사이의 링크 품질을 정리하고 recipe 누락을 메운다
3. public export 전체를 Storybook/reference coverage 기준으로 정기 점검한다

## Update Rule

- Storybook에 새 대응면을 추가하면 이 문서의 상태를 같이 갱신한다.
- `showcase 종료 = yes`는 Storybook에서 팀 검토가 실질적으로 대체 가능한 경우에만 바꾼다.
- `partial` 상태는 장기 방치하지 말고 다음 migration 우선순위 후보로 다룬다.
