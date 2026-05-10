---
title: PR-E0g — UploadDropzone disabled visual affordance 강화
date: 2026-05-10
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-ui
status: planning — 사용자 review 대기
---

# PR-E0g — UploadDropzone disabled affordance 강화

## 1. 증상

ui Storybook `Components / Inputs / UploadDropzone` Review story 의 "Disabled state" 카드가 활성 (Interactive uploader) 카드와 거의 동일하게 보임:
- 동일: 점선 border (border-subtle), 투명 background, 동일 padding/layout
- 차이: 본문 텍스트 색만 살짝 흐릿 (text-muted → text-soft), cursor 만 default

→ 사용자가 "지금 비활성" 임을 즉시 인지하기 어려움. 클릭 시도 가능성.

## 2. 이력 — PR-D4b

이전에 [upload-dropzone.tsx](src/components/inputs/upload-dropzone.tsx) 는 disabled 시 `opacity: 0.5` 사용 → 시각 약화 명확. 단 PR-D4b 에서 a11y contrast 이유로 제거:
- `text-muted` (#98a2b3 dark / #475467 light) 에 `opacity: 0.5` 적용 시 effective contrast 가 약 2.7:1 → WCAG AA 4.5:1 fail
- 직접 `text-soft` 사용으로 a11y 통과는 했지만 시각 affordance 약화

본 PR 은 a11y 유지 + 시각 명확화 양립.

## 3. 현재 코드

[upload-dropzone.tsx:11-17](src/components/inputs/upload-dropzone.tsx#L11-L17):

```tsx
border: 2px dashed ${(p) => (p.$active ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-border-subtle)')};
border-radius: var(--ig-radius-lg);
background: ${(p) => (p.$active ? 'var(--ig-color-accent-soft-surface)' : 'transparent')};
color: ${(p) => (p.$disabled ? 'var(--ig-color-text-soft)' : 'var(--ig-color-text-muted)')};
font-size: var(--ig-font-size-sm);
text-align: center;
cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};
```

## 4. Fix

[upload-dropzone.tsx:11-17](src/components/inputs/upload-dropzone.tsx#L11-L17):

```tsx
border: 2px dashed ${(p) =>
  p.$disabled
    ? 'var(--ig-color-border-subtle)'
    : p.$active
      ? 'var(--ig-color-accent-soft)'
      : 'var(--ig-color-border-subtle)'};
border-radius: var(--ig-radius-lg);
background: ${(p) =>
  p.$disabled
    ? 'var(--ig-color-surface-muted)'
    : p.$active
      ? 'var(--ig-color-accent-soft-surface)'
      : 'transparent'};
color: ${(p) => (p.$disabled ? 'var(--ig-color-text-soft)' : 'var(--ig-color-text-muted)')};
font-size: var(--ig-font-size-sm);
text-align: center;
cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
```

**변경 요지**:
1. **disabled 시 background = `var(--ig-color-surface-muted)`** — 활성 (transparent) 와 명확 구별
2. **disabled cursor = `not-allowed`** — `default` 보다 의미 명확 (web 표준 패턴)
3. border / color / 그 외 동일 — disabled 와 active 가 섞이지 않도록 disabled 우선 분기

## 5. a11y contrast 검증

`surface-muted` = `palette.slate840`:
- **Dark mode**: `rgba(13, 18, 27, 0.92)` → effective ~ #0d121b (canvas slate950 #0f1115 위에 92% 투명도). canvas 와 거의 동일하지만 약간 darker
- **Light mode**: `rgba(247, 249, 251, 0.92)` → effective ~ #f7f9fb (canvas #ffffff 위에 92% 투명도). canvas 보다 약간 darker

`text-soft` 가 surface-muted 위 contrast:
- Dark `text-soft` (#7e8fa3) vs effective bg (~#0d121b) → ~5.0:1 (4.5:1 통과)
- Light `text-soft` (#5e6776) vs effective bg (~#f7f9fb) → ~5.4:1 (4.5:1 통과)

→ 양 mode WCAG AA pass.

## 6. 시각 효과 비교 (story "Disabled state")

**현재** (transparent bg + dashed border-subtle):
- 카드 background = surface-raised (StorybookCard) → dropzone 이 카드와 사실상 동일 색상
- 점선 border 만 보이며 내용 텍스트는 살짝 흐릿
- "비활성" 인지 약함

**fix 후** (surface-muted bg + dashed border-subtle):
- dropzone 이 카드 surface-raised 와 다른 색 (보다 darker/grayer) → 명확히 구분
- 점선 border 가 surface-muted 위에 자연스러운 inset 인상 → "lock" 느낌
- 본문 텍스트 (text-soft) 와 cursor (not-allowed) 가 보조

## 7. children 시각 영향 (story 기준)

스토리북 caller 는 [upload-dropzone.stories.tsx:64](src/components/inputs/upload-dropzone.stories.tsx#L64) 에서 `<strong style={{ color: 'var(--ig-color-text-primary)' }}>` 사용 → strong 텍스트 색은 disabled 영향 안 받음.
- 본 PR scope 밖 (caller 의 자유)
- 단 caller 가 *완전 disabled affordance* 를 원하면 strong 색을 `inherit` 또는 token 값 안 강제하는 패턴 권장. 이는 별도 가이드 거리

## 8. 영향 분석

**ui 단**:
- 시각 affordance 명확 — 사용자 인지 향상
- a11y contrast 양 mode pass

**consumer**:
- platform / edge UploadDropzone 사용처 grep 시 spot-check (변경 visual 인지)
- 기능 변경 0 — disabled 시 onClick / file input 차단 동작 그대로

## 9. 검증 절차

1. typecheck `npx tsc --noEmit`
2. ui storybook 시각:
   - Disabled state 카드가 활성 카드와 명확히 구분 (darker bg)
   - cursor: not-allowed 호버 확인
3. ui storybook tests `npm run test-storybook` — 102 tests pass
4. ui storybook a11y panel — Disabled state, "error" 위반 없음

## 10. 위험

- 매우 낮음. 2 token 값 + 1 cursor 값 변경
- a11y 위반 위험: text-soft on surface-muted 양 mode 5:1 이상 → 안전
