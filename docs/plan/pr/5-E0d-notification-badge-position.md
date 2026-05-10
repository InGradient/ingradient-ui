---
title: PR-E0d — NotificationBadge bubble position 버그 fix
date: 2026-05-10
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-ui
status: planning — 사용자 review 대기
---

# PR-E0d — NotificationBadge bubble position fix

## 1. 증상

ui Storybook `Components / Feedback / NotificationBadge` Review story 의 "Compact trigger review" 섹션:
- "Danger tone" 카드 — bubble (9) 이 IconButton 우측 상단이 아니라 *카드 우측 상단* 에 표시
- "Accent tone" 카드 — bubble (2) 도 동일

기대 동작: bubble 이 trigger (IconButton) 의 우측 상단에 살짝 걸쳐 표시.

## 2. 근본 원인

[notification-badge.tsx:4-10](src/components/feedback/notification-badge.tsx#L4-L10):

```tsx
const Root = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`
```

[notification-badge.tsx:12-16](src/components/feedback/notification-badge.tsx#L12-L16) — Bubble 은 `position: absolute; top: 0; right: 0` (relative parent 기준 우측 상단).

문제 chain:
1. `Root` 가 `display: inline-flex` — block flow 부모 안에서는 content 만큼 wrap (정상)
2. 하지만 *flex 부모* 안에서는 자식이 cross-axis 방향으로 default `align-items: stretch` 적용
3. StorybookCard 는 [storybook-layout.tsx:111-132](stories/support/storybook-layout.tsx#L111-L132) 에서 `display: flex; flex-direction: column` — 자식들이 cross-axis (horizontal) 방향으로 stretch
4. `inline-flex` 라도 flex item 으로서 stretch → Root 가 카드 전체 width 차지
5. Bubble 의 `top: 0; right: 0` 이 *Root* 기준이지만 Root 가 카드 전체 width 라 → 카드 우측 상단

## 3. 왜 platform/edge 에서는 안 보였나?

consumer 미사용 (grep 결과 0건). ui storybook 에서만 노출되는 시각적 버그. 단 *향후 consumer 가 column flex 안에 배치하면 동일 발생*. ui-level 강건성 부족.

## 4. Fix

[notification-badge.tsx:4-10](src/components/feedback/notification-badge.tsx#L4-L10) Root 에 `width: fit-content` 추가:

```tsx
const Root = styled.span`
  position: relative;
  display: inline-flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`
```

## 5. 영향 분석

**`width: fit-content` 효과**:
- flex item stretch override — content 만큼만 wrap
- block flow 부모 안에서도 동일 (inline-flex 의 자연 wrap 과 동일 결과)
- grid 부모 안에서도 동일 (grid item 의 default `align-self: stretch` 회피)

**ui 단 동작**:
- bubble 이 Root (= IconButton wrap) 우측 상단에 정상 표시
- 모든 부모 컨텍스트 (block / flex / grid / inline) 에서 robust

**consumer 호환**:
- 현재 consumer 미사용 → 회귀 0
- 향후 consumer 가 어느 컨텍스트에 두든 정상 동작

## 6. 검증 절차

1. typecheck `npm run typecheck` (또는 `npx tsc --noEmit`)
2. ui storybook 시각:
   - "Danger tone" / "Accent tone" — bubble 이 IconButton 우측 상단에 정상
3. ui storybook tests `npm run test-storybook` — 102 tests pass

## 7. 위험

- 없음. 1줄 CSS 추가
- typical NotificationBadge 사용 = "icon trigger 를 wrap" 이며 wrap 은 항상 content 크기. fit-content 가 의도와 일치

## 8. 후속

- 동일 패턴 (inline-flex Root + absolute Bubble) 다른 컴포넌트가 있는지 sweep — 별도 PR 거리 (현 PR scope 밖)
