---
title: PR-E1b — AnnotationToolbar Pattern 신규
date: 2026-05-11
parent: docs/plan/pr/5-E1-image-detail-shell.md
scope: ingradient-ui
status: planning — 사용자 review 대기
---

# PR-E1b — AnnotationToolbar Pattern

## 1. 목적

PR-E1 phased plan 의 Phase 1 두 번째 PR. labeling canvas 하단 가로형 toolbar 를 ui Pattern 으로 추출. **양 repo cover** (platform image-detail bottom toolbar + edge labeling bottom toolbar).

## 2. 조사 결과

### 2.1 platform [ImageDetailToolbar.tsx](frontend/components/gallery/image-detail/ImageDetailToolbar.tsx) (175줄)

**Two 영역**:
- **TopRightGroup** (absolute top-right): zoom out / zoom in / close
- **ModalToolbar** (absolute bottom): CoordReadout + 4 mode buttons (cursor/bbox/point/classification) + 3 history (undo/redo/reset) + delete + mobile-info

### 2.2 edge [ImagesView.tsx ModalBBoxToolbar](src/frontend/components/capture/ImagesView.tsx#L1222)

- **ModalBBoxToolbar** (flex below canvas): 2 mode buttons (cursor + bbox) 뿐
- 단일 row, 간단

### 2.3 공통 + 차이

| 측면 | platform | edge | 통합 방안 |
|---|---|---|---|
| 위치 | absolute bottom | flex below canvas | prop `placement: 'absolute'|'inline'` |
| 액션 개수 | 9 | 2 | 슬롯 기반 `actions[]` |
| leading | CoordReadout | 없음 | optional `leading` slot |
| trailing | mobile-info (오른쪽 끝) | 없음 | optional `trailing` slot |
| bg | rgba(0,0,0,0.6) | rgba(0,0,0,0.55) | ui token 으로 통일 |
| 버튼 size | 40px (IconBtn) | 36px (ModalBBoxToolbarBtn) | prop `size?: 'sm'|'md'` |
| separator | 없음 (가로 일렬) | 없음 | optional 'separator' string in actions[] |

## 3. API 설계

```tsx
export interface AnnotationToolbarAction {
  key: string
  /** Tooltip + aria-label. */
  title: string
  icon: React.ReactNode
  /** Active toggle state (mode buttons). */
  active?: boolean
  disabled?: boolean
  /** Danger style (delete 등). */
  danger?: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  /** Optional className (e.g. for mobile-only show/hide). */
  className?: string
}

export interface AnnotationToolbarProps {
  /** 액션 버튼 배열. 문자열 `'separator'` 가 섞여 있으면 시각적 구분자 표시. */
  actions: Array<AnnotationToolbarAction | 'separator'>
  /** 좌측 슬롯 — 보통 CoordReadout 등. flex 1 차지. */
  leading?: React.ReactNode
  /** 우측 슬롯 — actions 뒤. flex shrink 0. */
  trailing?: React.ReactNode
  /** 배치. `'absolute'` (default platform) 또는 `'inline'` (edge / sticky inline). */
  placement?: 'absolute' | 'inline'
  /** 버튼 사이즈. default `'md'` (40px). `'sm'` (36px). */
  size?: 'sm' | 'md'
  className?: string
  /** ARIA toolbar label. */
  ariaLabel?: string
}
```

### 3.1 placement='absolute' (platform)

```css
position: absolute;
bottom: 0;
left: 0;
right: 0;
min-height: 48px;
padding: 8px 12px;
background: rgba(0, 0, 0, 0.6);
z-index: 10;
display: flex;
align-items: center;
gap: 8px;
```

### 3.2 placement='inline' (edge)

```css
display: flex;
align-items: center;
gap: 8px;
padding: 8px 12px;
background: rgba(0, 0, 0, 0.55);
border-radius: 0 0 12px 12px;
flex-shrink: 0;
```

## 4. 구현

### 4.1 파일 분할

| 파일 | 줄수 |
|---|---|
| `src/patterns/shells/annotation-toolbar.tsx` | ~80 |
| `src/patterns/shells/annotation-toolbar.styles.ts` | ~70 |
| `stories/patterns/annotation-toolbar.stories.tsx` | ~150 |

### 4.2 핵심 구조

```tsx
export function AnnotationToolbar({
  actions, leading, trailing, placement = 'absolute', size = 'md', ariaLabel, className,
}: AnnotationToolbarProps) {
  return (
    <ToolbarRoot $placement={placement} role="toolbar" aria-label={ariaLabel} className={className}>
      {leading ? <LeadingArea>{leading}</LeadingArea> : null}
      {actions.map((action, idx) =>
        action === 'separator' ? (
          <Separator key={`sep-${idx}`} aria-hidden />
        ) : (
          <ToolbarButton
            key={action.key}
            type="button"
            $active={!!action.active}
            $danger={!!action.danger}
            $size={size}
            disabled={action.disabled}
            title={action.title}
            aria-label={action.title}
            aria-pressed={action.active}
            onClick={action.onClick}
            className={action.className}
          >
            {action.icon}
          </ToolbarButton>
        )
      )}
      {trailing ? <TrailingArea>{trailing}</TrailingArea> : null}
    </ToolbarRoot>
  )
}
```

### 4.3 styled — `annotation-toolbar.styles.ts`

- `ToolbarRoot` — placement variant css
- `ToolbarButton` — size + active + danger + disabled state
- `LeadingArea` — flex 1 0 0, min-width 0, overflow auto
- `TrailingArea` — flex 0, margin-left auto
- `Separator` — vertical divider line (1px, rgba(255,255,255,0.12))

### 4.4 Built-in 아이콘?

ui 가 default icon 제공? 아니, **caller 가 icon 자유 제공**. ui card 들 (chart 등) 도 동일 — caller 가 자기 도메인 아이콘 결정.

→ ui 는 *layout + styling* 만. icon SVG 는 caller (Sidebar.icons 같은 자산).

## 5. Storybook variants

- **Review** (placement='absolute' + sticky placeholder canvas)
  - "Full toolbar" (platform-like) — 4 mode + separator + 3 history + delete + leading CoordReadout + trailing mobile-info
  - "Minimal" (edge-like) — 2 mode buttons
  - "Inline placement" — placement='inline'
  - "Size sm" — size='sm'
  - "Disabled states" — undo disabled, redo enabled, delete disabled
  - "Active states" — 한 mode active

## 6. 영향 분석

**ui 추가**: +300 줄 (component + styles + stories)

**consumer 영향**: 0 (본 PR scope). PR-E1d 에서 platform 이 AnnotationToolbar 사용 시작.

## 7. 검증 절차

1. typecheck `npx tsc --noEmit`
2. ui storybook (양 mode):
   - 모든 variants 렌더
   - separator 표시 정상
   - leading 영역 overflow 처리 (긴 CoordReadout 도 flex 1 안)
   - a11y `error` 위반 없음 (toolbar / button-name)
3. storybook tests pass

## 8. 위험

- 낮음. ui 신규 Pattern + 기존 caller 0

## 9. 다음 sub-PR

- **PR-E1a LabelingCanvas** — 가장 복잡 (image + zoom/pan + DrawingLayer + extra overlays slot)
- **PR-E1d 마이그** — Phase 2 platform 적용
