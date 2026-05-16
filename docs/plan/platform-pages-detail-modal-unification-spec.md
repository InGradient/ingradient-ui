---
title: Image Detail Modal — Storybook 측 시각 통일 구현
purpose: storybook 의 catalog image detail 을 platform 의 ImageDetailModal 과 시각적으로 일치시키기 위한 ui 측 변경
audience: ingradient-ui contributor
date: 2026-05-15
status: draft
related:
  - ./platform-pages-detail-modal-gap.md
---

# Image Detail Modal — 시각 통일 구현

이전 gap 문서 [§12.5 추가 정정](./platform-pages-detail-modal-gap.md#125-중요-정정--labelingcanvas-는-이미-공유-자산) 에서 canvas 자체는 공유라 확인. 하지만 **shell / sidebar 구조 / info panel 모양** 의 차이는 그대로 남음. 본 spec 으로 이 3 영역 통일.

---

## 1. 변경 범위

3 단계 통일:

### Step 1 — `GalleryDetailModal` 의 외부 shell 교체

`DialogShell` (중간 크기 dialog) → `MediaDialogShell` (전체 화면급 + sidebar).

| 영역 | 현재 | 목표 |
|---|---|---|
| 너비 | min(960px, 100%) | 95vw (`MediaDialogShell` 기본) |
| 높이 | content auto | calc(100vh - 80px) |
| Sidebar | 별도 column (2-col grid 안) | `MediaDialogShell` 의 native sidebar slot (resize 가능) |
| 배경 | 일반 backdrop | 다크 backdrop |

API 변경: `children` slot 만 받던 것을 `main` + `sidebar` 두 slot 으로. 기존 `children` 만 쓰는 caller 는 main 으로 fallback.

### Step 2 — 신규 `ImageDetailInfoPanel` pattern

platform 의 `ImageDetailInfoPanel.tsx` 를 ui pattern 으로 추출. 기능:

- "Image info" 섹션 타이틀
- Position row (group image 일 때만, "Image N of M")
- Always-visible rows: File / Uploaded / Captured
- Collapsible toggle: "Show details" / "Hide details"
- Collapsible body: Upload Source / Camera IP / Camera Type / Camera Model / Edge Device / Dimensions / Size / Sequence / Pattern / Quality / etc.
- Optional `cameraParamsSlot` for 추가 camera 정보 collapsible

Props:
```ts
interface ImageDetailInfoPanelProps {
  image: ImageDetailInfo            // 도메인 type — 본 spec 에 정의
  positionLabel?: string             // "Image 2 of 5" 같은 group 표시
  detailsOpen: boolean
  onToggleDetails: () => void
  cameraParamsSlot?: ReactNode
}

interface ImageDetailInfo {
  name?: string
  created_at?: string
  captured_at?: string
  upload_source?: string
  camera_ip?: string
  camera_type?: string
  camera_model?: string
  edge_device?: string
  dimensions?: { width: number; height: number }
  size_bytes?: number
  uploader?: string
  labeled_by?: string
  labeled_at?: string
  upload_quality?: string
  sequence_id?: string
  sequence_step?: number
  pattern_label?: string
  package_version?: number
  capture_duration_ms?: number
}
```

`InfoRow` / `InfoRowLabel` / `InfoRowValue` (already in `@ingradient/ui/components`) 재사용.

### Step 3 — `ImageDetailViewer` 의 sidebar 구조 변경

현재: 2-col grid (image left + metadata/class/comments right) — modal body 안에서 자체 layout.

목표: viewer 가 **sidebar 만** 렌더 (image canvas 는 caller 가 `main` 슬롯에 직접 주입). 또는 viewer 가 두 영역 (main / sidebar) 분리해서 반환하고 caller 가 GalleryDetailModal 의 main/sidebar slot 에 매핑.

선택: **viewer 분리** — `ImageDetailViewer` 를 deprecate 하고:
- `ImageDetailCanvas` — main 슬롯 콘텐츠 (caller 가 ImageInspectorCanvas 등 주입)
- `ImageDetailSidebar` — sidebar 슬롯 콘텐츠 (info + class + comments + labelers 슬롯 조합)

이 방식이 platform 의 `ImageDetailCanvasArea` + `ImageDetailSidePanel` 분할과 매칭.

### Step 4 — Catalog story rewire

`build-view-props.tsx` 의 `buildDetailContent` 변경:
- `<ImageDetailViewer>` 호출 제거
- `<GalleryDetailModal main={...} sidebar={...}>` 직접 호출

main:
```tsx
<ImageInspectorCanvas imageUrl={image.thumb_url} boxes={sampleAnnotations} />
```

sidebar:
```tsx
<ImageDetailSidebar
  infoPanel={<ImageDetailInfoPanel image={info} detailsOpen={...} onToggleDetails={...} />}
  classTagsSlot={<ImageClassTags tags={sampleClassTags} />}
  commentsSlot={<CommentsPanel comments={sampleComments} />}
/>
```

---

## 2. 신규 / 변경 파일

### 2.1 신규 (3 file)

- `src/patterns/shells/image-detail-info-panel.tsx` — info panel + collapsible + InfoRow 들
- `src/patterns/shells/image-detail-info-panel.stories.tsx` — 4 variant story
- `src/patterns/shells/image-detail-sidebar.tsx` — sidebar 조립 (info + class + comments + labelers 슬롯)

### 2.2 수정 (3 file)

- `src/patterns/shells/gallery-detail-modal.tsx` — `DialogShell` → `MediaDialogShell`, `main` + `sidebar` 슬롯 추가
- `src/patterns/shells/image-detail-viewer.tsx` — body grid 제거. main slot 만 (또는 deprecate)
- `src/patterns/index.ts` — 신규 2개 export

### 2.3 Story rewire (1 file)

- `stories/pages/platform/0.0.1/catalog/build-view-props.tsx` — buildDetailContent 재작성

---

## 3. 도메인 type 정리

storybook 측 mock 데이터 (`stories/fixtures/platform/0.0.1/catalog-images.ts` 의 `MockGalleryImage`) 와 새 `ImageDetailInfo` 매핑 필요. 변환 함수는 `buildDetailContent` 안에 inline.

storybook 의 fixture 는 platform 의 full ImageItem 보다 적은 정보 (uploader, created_at, size_bytes, width, height, sequence_id, pattern_label 정도만) 라 "Show details" 본문은 부분적으로 비어 보임 — 의도된 결과 (mock 한계).

---

## 4. 검증

| # | 명령 | 기대 |
|---|---|---|
| 1 | `npx tsc --noEmit` | 0 error |
| 2 | `npm run build:package` | success |
| 3 | `npm run build:storybook` | success |
| 4 | Catalog probe | 12/12 통과 |
| 5 | 다른 probe 회귀 | 5+7+8+6 = 26/26 |
| 6 | 수동 시각 확인 | catalog 의 detail-open / detail-with-annotations scenario 가 platform 모양과 유사 |

---

## 5. 시각 변화 (의도된 것)

| 영역 | Before | After |
|---|---|---|
| Modal 크기 | 960px 중간 dialog | 95vw 큰 dialog |
| Backdrop | 일반 | 어두운 + blur |
| Sidebar | 280-320px column (grid) | 320px native sidebar (resizable) |
| Info | flat 6 rows | "Image info" title + 기본 3 rows + show/hide details |
| 시각 무게 | inspector / 작음 | editor / 큼 (platform 과 동일) |

storybook 의 catalog 의 모든 `detail-*` scenario screenshot 이 변함. baseline 이 있으면 update 필요.

---

## 6. 리스크

### 6.1 `GalleryDetailModal` API 변경의 backward compat

기존 호출:
```tsx
<GalleryDetailModal image={...} open={...} onClose={...}>
  <ImageDetailViewer ... />
</GalleryDetailModal>
```

새 호출:
```tsx
<GalleryDetailModal image={...} open={...} onClose={...} main={...} sidebar={...} />
```

대응: `children` prop 도 그대로 받음 — 있으면 main 으로 fallback. 기존 catalog story 가 immediate break 되진 않음.

### 6.2 `ImageDetailViewer` 의 운명

storybook 외에 직접 consumer 없음 (자체 story 만). deprecate 가능. 단, 기존 story 가 깨지면 story 도 같이 업데이트.

### 6.3 너비 변경으로 인한 다른 scenario 영향

`detail-open` 외 scenario (`detail-with-annotations`, `detail-with-comments`, `detail-multi-class`) 도 같은 modal 사용. 모두 새 모양으로 자동 전환 — 의도된 변화.

---

## 7. Rollback

git revert: 신규 3 + 수정 4 = 7 file. catalog probe 회귀 없으면 OK.

---

## 8. 다음 액션

1. 본 spec ok
2. ImageDetailInfoPanel + ImageDetailSidebar pattern 작성 (+ story)
3. GalleryDetailModal 내부 교체
4. ImageDetailViewer 변경 또는 deprecate
5. Catalog story rewire
6. 검증
7. gap 문서 § 추가 update — 시각 통일 완료 명시
