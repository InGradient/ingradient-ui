---
title: Phase 11.1 — LogPanelView 정확 재현
purpose: Phase 11 에서 단순화된 LogPanelView 를 edge 실제 구조 (filter header + FilterPopover + DetailPanel + ImageModal) 대로 정확히 재현
audience: ingradient-ui contributor
date: 2026-05-20
status: draft
related:
  - ./edge-pages-phase-11-spec.md
  - ./edge-pages-phase-14-1-spec.md
---

# Phase 11.1 — LogPanelView 정확 재현

> Phase 11 에서 LogPanelView 를 "simple log list with expand toggle" 로 단순화. edge 실제 동작과 큰 차이 — 본 phase 가 정확 재현.

---

## 1. 현재 상태와 문제

### 1.1 현재 (Phase 11)

LogPanelView 구조:
```
<Panel>
  <PanelHeader>{logs.length} logs · chevron toggle</PanelHeader>
  <LogList>
    {logs.map => <LogRow timestamp + level + message + copy />}
  </LogList>
</Panel>
```

- 단순 list + expand/collapse toggle 만
- filter 가 전혀 없음
- DetailPanel / hover preview 없음
- image modal 없음

### 1.2 edge 의 실제 LogPanel ([components/log/LogPanel.tsx](../../../ingradient-edge/src/frontend/components/log/LogPanel.tsx))

```
<Container>
  <Header>                            ← log + Filter button row
    {title}
    <FilterButtonWrap>
      <FilterActionButton>
        <Filter icon> {filterButton label}
      </FilterActionButton>
      {showFilterPopover && (
        <FilterPopover>
          <FilterSection>
            <Title>{filterByDate}</Title>
            <DropdownSelect /> (all/today/last7/last30/custom)
            {custom && <DateRow×2 with DatePickerField>}
          </FilterSection>
          <FilterSection>
            <Title>{filterLogType}</Title>
            <FilterRow×3>: Switch + label (Progress/Connections/Debug)
          </FilterSection>
        </FilterPopover>
      )}
    </FilterButtonWrap>
  </Header>

  <LogList>                            ← 무한 스크롤
    {entries.map => <LogItem>
      <LogTime />
      <Icon /> (error/success/info)
      <LogMessage title=msg />
    </LogItem>}
    {hasMore && <LogPlaceholder>...</LogPlaceholder>}
  </LogList>

  <DetailPanel $visible={hovered}>    ← hover 시 우측에 표시
    {hoveredLog ? (
      <DetailImageClickable src=... onClick=openModal>
      또는 <OpenImageButton> (path 만 있고 url 없을 때)
      <LogDetailTable text={detail ?? msg} />
    ) : <DetailPlaceholder>{hoverHint}</DetailPlaceholder>}
  </DetailPanel>

  {modalImageUrl && (                  ← image 클릭 시 전체화면 (portal)
    <ImageModalOverlay onClick=close>
      <ImageModalImg src=modalImageUrl />
    </ImageModalOverlay>
  )}
</Container>
```

### 1.3 차이 5가지

| 요소 | 현재 (Phase 11) | edge 실제 |
|---|---|---|
| header | "{n} logs · chevron" | title + `Filter` icon 버튼 |
| FilterPopover | 없음 | Date filter + LogType filter (3 switch) |
| LogItem 구조 | timestamp + level + message + copy | timestamp + level icon + message (제목 tooltip) |
| DetailPanel | 없음 | hover 시 우측 슬라이드 — 이미지 + LogDetailTable |
| Image modal | 없음 | 이미지 클릭 시 portal 전체화면 |
| 무한 스크롤 | 없음 (단순 array render) | scroll bottom 시 loadMoreLogs |
| filter helper | 없음 | `logPassesDateFilter` + `isCapture/Progress/Connections/Debug` + `getTimeFromMsg` |

---

## 2. 해결 방향

### 2.1 LogPanelView 완전 재구성

view 의 책임:
- 헤더 + filter 버튼 + popover render
- log list render (entries 는 props 로 받음 — container 가 filter 적용 결과)
- hover detail panel render
- image modal render (DOM portal 처리는 view 내부)

view 가 받지 않는 것 (container 잔류):
- IPC: `getCaptureLogImageDataUrl`, `openCaptureLogImage`
- store: `useDeviceStore` (logs), `useDatasetStore` (selectedDatasetId)
- 무한 스크롤 implementation 자체 — view 는 `onScroll` callback 만, container 가 `loadMoreLogs`
- filter 적용 로직 — container 가 logs 를 filter 처리한 결과 (`entries`) 만 props 로

### 2.2 helper 복사

`packages/edge-pages/src/log/log-filters.ts` 신규 — edge 의 `modules/log/model/log-filters.ts` 의 pure helper 복사:
- `isDebugLog`, `isCaptureResultLog`, `isProgressLog`, `isConnectionsLog`
- `logPassesDateFilter`, `getTimeFromMsg`
- `DatePreset` type

또한 LogEntry 도메인 type 도 자체 정의 (현재 `LogPanelEntry` 가 있는데 edge 의 LogEntry shape 따라 확장):
```ts
export interface LogEntry {
  msg: string
  type: 'info' | 'success' | 'error'
  timestamp?: string
  detail?: string | null
  imageUrl?: string | null
  imagePath?: string | null
}
```

### 2.3 props 재정의

```ts
export type LogTypeFilter = 'progress' | 'connections' | 'debug'

export interface LogPanelLabels {
  title: string                       // 'logs.title'
  filterButton: string                // 'logs.filterButton'
  filterByDate: string                // 'logs.filterByDate'
  filterLogType: string               // 'logs.filterLogType'
  filterProgress: string              // 'logs.filterProgress'
  filterConnections: string           // 'logs.filterConnections'
  filterDebug: string                 // 'logs.filterDebug'
  dateAll: string
  dateToday: string
  dateLast7: string
  dateLast30: string
  dateCustom: string
  dateFrom: string
  dateTo: string
  noActivity: string                  // 'logs.noActivity'
  hoverHint: string                   // 'logs.hoverHint'
  openSavedImage: string              // 'logs.openSavedImage'
}

export interface LogPanelViewProps {
  // data (already filtered by container)
  entries: { log: LogEntry; index: number }[]
  hasMore: boolean

  // filter state (lifted)
  showFilterPopover: boolean
  datePreset: DatePreset
  dateFrom: string
  dateTo: string
  showProgress: boolean
  showConnections: boolean
  showDebug: boolean

  // hover / detail state (lifted)
  hoveredLogIndex: number | null
  displayedLogIndex: number | null
  hoveredLog: LogEntry | null
  displayImageUrl: string | null      // resolved data URL (container 가 IPC 후 전달)

  // image modal state (lifted)
  modalImageUrl: string | null

  labels: LogPanelLabels

  // callbacks
  onToggleFilterPopover: () => void
  onCloseFilterPopover: () => void    // click-outside trigger
  onSetDatePreset: (p: DatePreset) => void
  onSetDateFrom: (v: string) => void
  onSetDateTo: (v: string) => void
  onSetShowProgress: (v: boolean) => void
  onSetShowConnections: (v: boolean) => void
  onSetShowDebug: (v: boolean) => void
  onSetHoveredLogIndex: (i: number | null) => void
  onSetPanelHovered: (v: boolean) => void
  onScrollNearBottom: () => void      // 무한 스크롤 trigger
  onOpenImageModal: (url: string) => void
  onCloseImageModal: () => void
  onOpenSavedImage: (path: string) => void  // 외부 image 열기 (electron API)
}
```

### 2.4 view 줄 수

LogPanelView 가 풍부해져서 ~180 줄 예상 (200 룰 안). 필요시 sub-view 분리 (`LogPanelHeader` / `LogPanelDetailPanel`).

### 2.5 styles 교체

기존 `LogPanelView.styles.ts` (Phase 11 의 단순 styles) 삭제. edge 의 `LogPanel.styles.ts` 전체 복사 (~220 줄 — 200 룰 미세 위반 예상, 분할 검토). 사용 export: Container, Header, FilterButtonWrap, FilterActionButton, FilterPopover, FilterSection, FilterSectionTitle, FilterRow, DateRow, DateLabel, FilterButtonLabel, LogList, LogItem, LogTime, LogMessage, DetailPanel, DetailImageClickable, ImageModalOverlay, ImageModalImg, DetailContent, DetailPlaceholder, OpenImageButton, LogPlaceholder.

### 2.6 LogDetailTableView 보강

기존 `LogDetailTableView` 는 `Record<string, unknown>` 받는 key-value 표. 하지만 edge 의 `LogDetailTable` 는 raw text 받아서 parse — 다른 패턴. 본 phase 에서는 두 가지 다 지원:
- `details?: Record<string, unknown>` (Phase 11 유지)
- `text?: string` (edge 패턴 — `key: value` 라인 parse)

또는 단순히 text prop 으로 통일하고 raw text 파싱. 본 phase 에선 text 변형 추가 — backward-compat.

---

## 3. 변경 파일

### 3.1 신규 (1 file)

- `packages/edge-pages/src/log/log-filters.ts` — pure helper 복사

### 3.2 수정 (4 file)

- `packages/edge-pages/src/log/types.ts` — `LogEntry` 확장, `LogPanelLabels` 재정의, `LogPanelViewProps` 완전 교체, `DatePreset` export
- `packages/edge-pages/src/log/LogPanelView.styles.ts` — edge 의 `LogPanel.styles.ts` 전체 복사로 교체
- `packages/edge-pages/src/log/LogPanelView.tsx` — edge 의 LogPanel.tsx 의 render 부분 그대로 (단 store/IPC 없이 props 만)
- `packages/edge-pages/src/log/LogDetailTableView.tsx` — `text` prop 추가 옵션

### 3.3 영향받는 storybook

- `stories/pages/edge/0.0.1/AppShell.stories.tsx` 의 `LogPanelSlot` — 새 props 시그니처에 맞춰 수정 (entries / filter state / hover state / labels 등)

### 3.4 type 충돌 처리

이전 Phase 11 에서 `LogPanelEntry` 로 rename 했음 (settings 의 LogEntry 와 충돌 피하려). 본 phase 에서도 같은 이름 유지 (`LogPanelEntry`) — 단 shape 만 확장.

---

## 4. 실행 순서

1. `log/log-filters.ts` 신규 — edge helper 복사 (DatePreset, isXxxLog, logPassesDateFilter, getTimeFromMsg)
2. `log/types.ts` 수정 — LogPanelEntry 확장 (msg/type/timestamp/detail/imageUrl/imagePath), labels 재정의, props 교체
3. `log/LogPanelView.styles.ts` 교체 — edge styles 복사
4. `log/LogPanelView.tsx` 재작성 — edge JSX 그대로
5. `log/LogDetailTableView.tsx` 보강 — text prop 추가
6. `stories/pages/edge/0.0.1/AppShell.stories.tsx` 의 `LogPanelSlot` 갱신
7. typecheck + build + storybook build
8. 시각 검증 — Workspace 시나리오에서 좌측 LogPanel header 에 Filter 버튼 보이는지

---

## 5. 검증

| # | 명령 | 기대 |
|---|---|---|
| 1 | `npm run build --workspace packages/edge-pages` | exit 0 |
| 2 | `npx tsc --noEmit -p tsconfig.json` | 0 error |
| 3 | `npm run build:storybook` | exit 0 |
| 4 | grep 금지 import | 0 match |
| 5 | LogPanelView.tsx wc -l | < 200 |
| 6 | storybook `WorkspaceCapture` / `WorkspaceImagesTab` 시각 | 좌측 LogPanel header 에 `Filter` 버튼 표시 + 클릭 시 popover (Date filter / LogType filter) |

---

## 6. 성공 기준

- 검증 1~6 통과
- LogPanelView header 가 edge 와 동일 (title + Filter button)
- FilterPopover open/close 동작
- DetailPanel hover 표시 (storybook 의 mock data 로 시연)
- 모든 파일 < 200 (styles 는 ~220 — 미세 위반 허용)

---

## 7. 리스크

### 7.1 LogEntry shape 변경 backward-compat

기존 LogPanelEntry (Phase 11) 가 timestamp/level/message 였는데 edge 는 msg/type/timestamp/detail/imageUrl/imagePath. shape 다름. Phase 11 에선 storybook 만 사용 (실제 edge 마이그레이션 X) — 영향 없음. shape 교체.

### 7.2 DetailPanel hover 동작 시뮬레이션

storybook 에선 mouse hover 가 동작하나 자동 검증 어려움. 시각 확인으로 갈음.

### 7.3 useClickOutside

view 내부 hook 사용 — visual-only concern. props `onCloseFilterPopover` callback + view 안 ref 처리.

### 7.4 ReactDOM.createPortal (image modal)

storybook 에서 portal 동작 확인 — `@ingradient/ui` 의 다른 modal 들도 portal 쓰므로 정상 동작 예상.

### 7.5 styles 200 룰

edge LogPanel.styles.ts 215 줄 — 200 미세 초과. 본 phase 에선 그대로 복사 후 follow-up 으로 분할 미룸.

---

## 8. Rollback

5 file 변경 git revert. 영향: storybook 의 LogPanelSlot 사용처만.

---

## 9. 종료 후 상태

- LogPanelView 가 edge 와 동일 layout (Filter header + popover + LogList + DetailPanel + Image modal)
- DatePreset / log filter helpers 가 edge-pages export
- storybook 의 `WorkspaceCapture` / `WorkspaceImagesTab` / 등 좌측 LogPanel 에 Filter 버튼 정상 표시

---

## 10. 다음 액션

1. 본 spec ok
2. 실행 (§4 의 8 step)
3. 검증 (§5 의 6 step)
