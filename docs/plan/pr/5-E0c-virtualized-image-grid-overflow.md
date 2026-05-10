---
title: PR-E0c — VirtualizedImageGrid 가상화 viewport overflow 버그 fix
date: 2026-05-10
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-ui
status: planning — 사용자 review 대기
---

# PR-E0c — VirtualizedImageGrid overflow fix

## 1. 증상

ui Storybook `Components / Data Display / VirtualizedImageGrid` Review story 에서:
- "Basic / 20 items, 4 columns" 카드 (wrapper `height: 480`) — grid 셀이 카드 경계 밖으로 흘러내려 다음 section 위로 겹침
- "Large dataset / 200 items, 5 columns" 카드 (wrapper `height: 600`) — 더 심하게 화면 밖까지 흘러내림
- 가상화가 동작하지 않음 (모든 row 가 한 번에 렌더된 것처럼 보임)

## 2. 근본 원인

[virtualized-image-grid.tsx:7-11](src/components/data-display/virtualized-image-grid.tsx#L7-L11):

```tsx
const Scroll = styled.div`
  overflow-y: auto;
  min-width: 0;
  position: relative;
`
```

**height 가 없음**. 결과 chain:

1. `Scroll` 은 자신의 자식 `Inner` 의 자연 크기 (= `$totalHeight = rowCount × estimatedItemHeight`) 만큼 커짐
   - 200 items × 5 columns = 40 rows × 220px = **8800px**
2. TanStack `useVirtualizer({ getScrollElement: () => parentRef.current })` 가 `Scroll` 의 `clientHeight` 를 viewport 로 측정 — 그런데 viewport 가 8800px 이라 모든 row 가 viewport 안에 있다고 판단 → 가상화 무력화
3. wrapper `<div style={{ height: 480 }}>` 는 자기 자식 `Scroll` 의 `overflow-y: auto` 가 자기 영역을 넘어가도 *clip 안 됨* (overflow 가 wrapper 가 아닌 Scroll 에 있음). wrapper 는 overflow visible default → 자식 Scroll 이 자유롭게 8800px 늘어나서 다음 section 위로 흘러내림

요약: `Scroll` 이 viewport 역할을 해야 하는데 height 미지정으로 단순 wrapper 처럼 동작.

## 3. 왜 platform/edge 에서는 안 보였나?

consumer 에서 직접:
- `display: flex; flex-direction: column; min-height: 0;` 부모 안에 두고 `flex: 1` 처리
- 또는 wrapper 에 `height: 100%` 명시

→ 우연히 정상 동작 (자식이 부모 100% 를 의도대로 받음). ui 단의 강건성 부족 — 단순한 `<div style={{ height }}>` wrapper 만 줘도 동작해야 함.

## 4. Fix

[virtualized-image-grid.tsx:7-11](src/components/data-display/virtualized-image-grid.tsx#L7-L11) 에 `height: 100%` 추가:

```tsx
const Scroll = styled.div`
  height: 100%;
  overflow-y: auto;
  min-width: 0;
  position: relative;
`
```

## 5. 영향 분석

**ui 단 동작**:
- `Scroll` 이 부모 100% 를 받음 → 부모 wrapper 의 `height: 480` 이 그대로 viewport 로 전달
- TanStack 측정 viewport = 480px → 가상화 정상 (visible row 만 렌더 + overscan)
- Inner ($totalHeight 8800px) 가 Scroll 의 480px viewport 를 넘기 때문에 `overflow-y: auto` 활성 → 정상 스크롤

**consumer 호환**:
- platform / edge 의 기존 wrapper 패턴 (height fixed 또는 flex 1) 모두 유지
  - flex 1 wrapper 안에서는 부모가 *결정한* 크기를 Scroll 이 100% 로 받아 동일 동작
  - height fixed wrapper 안에서는 부모 fixed 크기를 Scroll 이 100% 로 받아 동일 동작
- 회귀 0

**parent 가 height 를 안 정한 경우**:
- 이 경우 `Scroll` 의 `height: 100%` 는 0 으로 해석 (parent height auto + child height % = 0)
- 가상화 viewport 0 → 아무것도 안 보임 (현재는 wrong 렌더, 수정 후는 비어 보임)
- 이는 *consumer 의 잘못된 사용* 이며 명시적 보임. ui 의 contract: "wrapper 가 height 를 정해야 한다"

## 6. 검증 절차

1. typecheck `bun run typecheck` (ui)
2. ui storybook `bun run storybook` 띄우고 시각 확인:
   - "20 items, 4 columns" — 카드 480px 안에 정상 가상화 + 스크롤
   - "Large dataset" — 카드 600px 안에 정상 가상화 + 스크롤
   - "Empty" — 240px 비어 보임 (정상)
   - "Single column" — 360px 안에 5 cell 스크롤 (정상)
3. ui storybook tests `bun run test:storybook` — 102 tests pass
4. platform / edge 시각 회귀 spot-check (해당 그리드 사용 화면 1~2개)

## 7. 위험

- 없음. 1줄 CSS 추가 + 명확한 개선

## 8. 후속

- 본 PR 의 fix 가 ui contract ("wrapper 가 height 를 정한다") 를 명시화. README/Storybook description 에 한 줄 추가 가능 (선택)
