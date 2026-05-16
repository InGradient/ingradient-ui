---
title: Phase 2 — ClassManage 추출
purpose: storybook 의 ClassManageScene JSX 를 @ingradient/ui/platform-pages/class-manage 로 추출하고 25 scenario story 를 새 view 기반으로 rewrite
audience: ingradient-ui contributor
date: 2026-05-15
status: draft
related:
  - ./platform-pages-extraction-roadmap.md
  - ./platform-pages-phase-1-spec.md
---

# Phase 2 — ClassManage 추출

> Roadmap: [platform-pages-extraction-roadmap.md](./platform-pages-extraction-roadmap.md) § Phase 2

---

## 1. 목적

storybook 의 `ClassManageScene` 과 platform 의 `ClassManagePage` 가 같은 JSX 를 공유하도록 `ClassManageView` 를 `src/platform-pages/class-manage/` 로 추출. UI 부품 (`ClassListSidebar`, `ClassImagesPanel`, `ClassInfoSidebar`, `AddClassDialog` 등) 은 이미 `@ingradient/ui/patterns` 에 있으므로 view 는 **얇은 orchestrator**.

---

## 2. JSX 출처 비교

| 영역 | Story (현재) | Platform | View 채택 |
|---|---|---|---|
| Top header | `PageHeader/PageTitle/PageSubtitle` + projectName | 자체 `TopBar/TopBarCopy/TopBarTitle/TopBarSubtitle` styled | **PageHeader** (ui pattern 재사용. platform 측은 추후 마이그레이션) |
| Body shell | `BodyRow` (gap 18, padding `space-8 space-11 space-11`) | `BodyRow` (자체 styled) | story 의 BodyRow 채택 — token 사용 |
| Status branch | `permissionDenied / error / noProject` → Alert / EmptyState | 분기 없음 (hook 이 사전 차단) | story 분기 유지 (caller 가 prop 으로 신호) |
| Left pane | `ClassListSidebar` (ui pattern) | 동일 | ui pattern 그대로 |
| Center pane | `ClassImagesPanel` + ImageGrid + AnnotationOverlay + chip row | 동일 | ui pattern 그대로 |
| Right pane | `ClassInfoSidebar` + ReferenceImageSection + ModelMappingSelect (mapping slot) | 동일 | ui pattern 그대로 |
| Overlays | `AddClassDialog`, `ImageContextMenu`, `ClassLightbox`, `ConfirmDialog` | 별도 `ClassPageOverlays` 묶음 | view 안의 `ClassManageOverlays` 로 묶음 (platform 패턴) |

요컨대 view 는 **patterns 호출 + props pass-through + 상태 분기** 만.

---

## 3. Props 설계 — Group 전략

플랫 30+ props 는 호출부에서 가독성 나쁨. **3 그룹 + 4 overlay 그룹** 으로 묶음 (platform hook 출력 단위와 매칭).

```ts
export interface ClassManageViewProps {
  projectName?: string | null

  // 상태 분기 — 하나만 set, 나머지 false/undefined
  permissionDenied?: boolean
  error?: string | null
  noProject?: boolean

  // 3 pane 그룹
  list: ClassListPaneProps
  images: ClassImagesPaneProps
  info: ClassInfoPaneProps | null   // 선택된 class 없으면 null

  // overlay 그룹
  overlays: ClassManageOverlaysProps
}

export interface ClassListPaneProps {
  classes: ClassEntry[]
  selectedClassId: string | null
  loading?: boolean
  onSelectClass: (id: string | null) => void
  onAddClass: () => void
}

export interface ClassImagesPaneProps {
  selectedClassId: string | null
  datasets: ClassDataset[]
  activeDatasetIds: Set<string>
  detailLoading?: boolean
  imagesLoading?: boolean
  images: ClassImage[]
  classIdToColor: Record<string, string>
  onToggleDataset: (id: string) => void
  onOpenImage: (image: ClassImage) => void
  onOpenContextMenu: (image: ClassImage, position: { top: number; left: number }) => void
}

export interface ClassInfoPaneProps {
  selectedClass: ClassEntry
  isReferenceDragOver: boolean
  referencePending?: boolean
  referenceError?: string | null
  referenceBboxCandidates?: Array<{ imageId: string; bboxIndex: number }>
  images: ClassImage[]                          // referenceImage apply 시 imageId → url lookup
  showCocoMapping?: boolean
  cocoMappingOptions: readonly string[]
  currentMapping: string
  onChangeClass: (patch: Partial<ClassEntry>) => void
  onRandomizeColor: () => void
  onDeleteClass: () => void
  onSetReferenceDragOver: (v: boolean) => void
  onApplyReferenceImage: (imageId: string) => void
  onChangeMapping: (value: string) => void
}

export interface ClassManageOverlaysProps {
  addClass: {
    open: boolean
    name: string
    onNameChange: (name: string) => void
    onClose: () => void
    onConfirm: () => void
  }
  contextMenu: {
    position: { top: number; left: number } | null
    onClose: () => void
    onAction?: (actionKey: string) => void   // 기본 "add-ref" 한 항목
  }
  lightbox: {
    image: ClassImage | null
    siblings: ClassImage[]
    selectedClassId: string | null
    classIdToColor: Record<string, string>
    onClose: () => void
  }
  deleteConfirm: {
    open: boolean
    selectedClass: ClassEntry | null
    onConfirm: () => void
    onCancel: () => void
  }
}
```

도메인 type 들 (`ClassEntry`, `ClassImage`, `ClassDataset`) 은 `types.ts` 에 정의 — fixtures 의 `MockClass` / `MockClassImage` / `MockClassDataset` 와 모양 일치. fixtures import 금지 (story-only).

---

## 4. 변경 파일

### 4.1 신규 (6 file)

```
src/platform-pages/class-manage/
├─ ClassManageView.tsx        — top orchestrator (≤ 150 줄)
├─ ClassManageView.styles.ts  — Page/BodyRow/HeaderProjectName styled (≤ 50 줄)
├─ ClassManageBody.tsx        — 3-pane body + 상태 분기 + grid composition (≤ 170 줄)
├─ ClassManageOverlays.tsx    — 4 overlay 묶음 (≤ 130 줄)
├─ types.ts                   — Props + 도메인 type 5개 (≤ 130 줄)
└─ index.ts                   — barrel (≤ 10 줄)
```

### 4.2 수정 (2 file)

#### `src/platform-pages/index.ts`

```ts
export * from './create-project'
export * from './class-manage'
```

#### `stories/pages/platform/0.0.1/ClassManage.stories.tsx`

- 기존 `ClassManageScene` JSX 모두 삭제
- `ClassManageView` import + `useClassManageScene` → view props 변환 함수 추가
- ≤ 200 줄 목표 (현재 255)

scene hook (`stories/pages/platform/0.0.1/class/use-class-manage-scene.ts`) 은 그대로 유지.

### 4.3 건드리지 않음

- `stories/fixtures/platform/0.0.1/class-*.ts` (fixture)
- `class/use-class-manage-scene.ts` (scene hook)
- 25 scenario 정의 (`class-scenarios.ts`)
- 모든 `@ingradient/ui/patterns` 의 클래스 관련 pattern

---

## 5. 도메인 type 정의 (`types.ts`)

fixtures 의 모양과 정확히 맞추기. (확실치 않으면 spec 작성 후 fixtures 재확인.)

```ts
export interface ClassEntry {
  id: string
  name: string
  color: string
  description: string | null
  image_count: number
  reference_image_url: string | null
  task_type?: 'object_detection' | 'classification' | 'segmentation' | 'point'
}

export interface ClassImage {
  id: string
  thumb_url: string
  original_url?: string | null
  width?: number
  height?: number
  sequence_id?: string | null
  bboxes?: Array<{ x: number; y: number; width: number; height: number; class_id: string }>
  points?: Array<{ x: number; y: number; class_id: string }>
}

export interface ClassDataset {
  id: string
  name: string
}
```

만약 fixture 와 모양 mismatch 시 fixture 가 더 풍부할 수 있음 — view type 은 **필요한 필드만** 정의하고 나머지는 fixture 가 더 들고 있어도 OK (`Pick`/`extends` 관계).

---

## 6. 검증

| # | 명령 | 기대 |
|---|---|---|
| 1 | `npx tsc --noEmit -p tsconfig.json` | 0 error |
| 2 | `npm run build:package` | `lib/platform-pages.js` 크기 증가 (10 KB → ~30 KB 예상) |
| 3 | `npm run build:storybook` | exit 0 |
| 4 | Playwright probe — 25 scenario 중 핵심 7개 | 모두 정상 렌더링, console error 0 |

probe 대상 7 scenario:
- `default` — 3-pane 정상
- `no-class-selected` — 우측 sidebar 사라짐
- `permission-denied` — 분기 alert
- `empty` — 클래스 0
- `many-items` — 클래스 다수
- `add-class-modal-open` — Add Class dialog 열림
- `lightbox-open` — Lightbox 열림

핵심 selector 후보:
- left pane: `[data-pane="class-list"]` 또는 첫 `<aside>` 또는 클래스 row 텍스트
- right pane: "Reference image" 섹션 텍스트
- Add dialog: dialog text "Add Class" 또는 input by id
- Lightbox: image element with original_url

---

## 7. 성공 기준

- 검증 1~4 통과
- view 파일 6개 각 200 줄 미만
- story file < 200 줄 (현재 255)
- platform 의 `ClassManagePage.tsx` 가 (Phase 7 시점) view import 만 으로 동일 렌더 가능

---

## 8. 리스크

### 8.1 patterns 의 props 와 view 의 도메인 type 불일치

위험: `ClassListSidebar` 가 기대하는 class 모양과 view 의 `ClassEntry` 가 다를 수 있음

대응: 실행 시 typecheck 가 즉시 잡음. 불일치 시 view type 을 pattern 의 input 에 맞춰 조정. fixture (story-side) 가 view type 을 충족하도록 변환.

### 8.2 `ImageGrid` + `AnnotationOverlay` 가 view 내부에 embed 됨

위험: caller 가 grid 외형을 customize 할 수 없음

대응: 의도된 제약. ClassManage 페이지의 grid 는 platform 과 storybook 모두 동일 모양. 다른 페이지에서 다른 grid 가 필요하면 별도 view.

### 8.3 ConfirmDialog 의 description 분기 (image_count > 0)

위험: view 안의 비즈니스 텍스트 — view 가 도메인 로직 살짝 보유

대응: 텍스트 분기는 "labels 가 N 개 있다" 알림 — 순수 표시. 도메인 로직 (정책) 이 아니라 데이터 조건 렌더링. 허용 범위.

### 8.4 25 scenario 중 일부가 새 props 로 표현 불가

위험: 기존 `useClassManageScene` 이 노출하는 일부 state 가 view 에 매핑되지 않을 수 있음

대응: 25 scenario 마다 변환 함수 (story-side) 가 props 만들어 view 호출. 매핑 안 되는 state 발견 시 spec 보강.

### 8.5 hook state setter 의 시그니처 차이

위험: 기존 `s.updateClass(id, patch)` 가 `id` + `patch` 2-arg. view 의 `onChangeClass` 는 `(patch)` 1-arg (selectedClass 가 context).

대응: 변환 함수에서 `(patch) => s.updateClass(selectedClass!.id, patch)` 로 어댑팅.

---

## 9. Rollback

git revert 8 file (신규 6 + 수정 2). lib/platform-pages.js 크기 회귀 확인.

---

## 10. 다음 액션

1. 본 spec ok
2. 6 신규 file 작성 (types → styles → Overlays → Body → View → index 순)
3. barrel + story rewrite
4. probe 작성
5. 검증 1~4 실행
6. Phase 3 (Catalog) spec 으로 이동
