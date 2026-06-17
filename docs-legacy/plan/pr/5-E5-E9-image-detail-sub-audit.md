---
title: PR-E5/E6/E7/E9 — image-detail sub-component audit + light cleanup
date: 2026-05-11
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-platform
status: planning — 사용자 review 대기
---

# PR-E5/E6/E7/E9 — image-detail sub-component audit + light cleanup

## 1. 목적

phase-5-components-audit.md 의 audit-only 항목 PR-E5/E6/E7/E9 를 한 PR 로 묶어 처리. 각각 *30~50줄 마이그 추정* 의 작은 거리.

지금까지 ui 마이그가 안 된 부분 만 인라인 styled / inline style → ui 컴포넌트 1:1 매핑. caller-facing API 변경 없음.

## 2. 각 파일 audit 결과

### 2.1 PR-E5 [ImageDetailComments.tsx](frontend/components/gallery/image-detail/ImageDetailComments.tsx) (193줄)

**현재**: ui `CommentThread` / `CommentItem` / `MentionTextarea` 사용 중. 인라인/styled 잔여:

| 위치 | 현재 | 마이그 |
|---|---|---|
| L86-92 | inline count badge `<span style={{...}}>` (7줄) | ui `Badge` (count > 0 ? `$tone="accent"` : `$tone="neutral"`) |
| L125-130 | `<button style={{...}}>` Edit/Archive (6줄) | ui `IconButton variant="secondary" size="sm"` |
| L154-160 | `CommentRetryButton` styled | ui `Button size="sm" tone="danger" variant="secondary"` |
| L181-187 | `CommentButton $secondary` styled | ui `Button variant="secondary"/"accent" size="sm"` |
| L105-119 | author tooltip (inline hover) | *유지* — platform-specific UX (이메일 hover 툴팁) |

`CommentButton` / `CommentRetryButton` styled (in comments-core.ts) 제거 (-40줄 styles).

**절약 추정**: 본체 -15줄 + styles -40줄 = **-55줄**

### 2.2 PR-E6 [ImageDetailContextMenu.tsx](frontend/components/gallery/image-detail/ImageDetailContextMenu.tsx) (130줄)

**현재**: 이미 ui `ContextMenuBackdrop/Button/Item/List/Sub/SubItem` 전부 사용 중. 잔여:

| 위치 | 현재 | 마이그 |
|---|---|---|
| L122 | inline color swatch `<span style={{ width: 10, height: 10, ... }} />` | ui `ColorSwatch $color $size="xs" $shape="square"` |

**절약 추정**: **-2줄** (cosmetic)

### 2.3 PR-E7 [ImageDetailToolbar.tsx](frontend/components/gallery/image-detail/ImageDetailToolbar.tsx) (175줄)

**현재**: PR-E1d-2 에서 `AnnotationToolbar` 로 완전 마이그. trailing slot 의 mobile info button (L126-148) 만 inline 잔여.

| 위치 | 현재 | 마이그 |
|---|---|---|
| L127-147 | inline `<button>` (mobile 토글 22줄, display:none default + className="mobile-info-btn") | ui `IconButton variant="secondary"` wrapper (className 으로 platform CSS media query 로 mobile flex 토글) |

**절약 추정**: **-10줄**

### 2.4 PR-E9 [ImageDetailSidebar.tsx](frontend/components/gallery/image-detail/ImageDetailSidebar.tsx) (236줄)

**현재**: 가장 큰 거리. local styled `UserList/UserRow/AccountIconWrap/UserText` + `iconAccount` svg + inline section header / count badge.

| 위치 | 현재 | 마이그 |
|---|---|---|
| L32-56 | local styled `UserList` / `UserRow $active` / `AccountIconWrap` / `UserText` (25줄) | ui `SelectableListItem variant="flat" selected={...}` + `Avatar size={22} initials={...}` |
| L57-62 | local `iconAccount` svg const | 제거 — ui `Avatar` 의 initials 또는 lucide `User` icon |
| L145 | inline section header `<div style={{...}}>Class</div>` | inline style 유지 (CSSProperties 상수로) 또는 ui `SectionHeader` 가 없으므로 그대로 |
| L194-207 | inline Users section header count badge (동일 패턴) | ui `Badge` (E5 와 동일) |
| L211 li wrapper | `<li style={{width:'100%'}}>` | ui `SelectableListItem as="li"` 직접 |

**절약 추정**: **본체 -40줄**

### 2.5 보너스 — [ImageDetailSidePanel.tsx](frontend/components/gallery/image-detail/ImageDetailSidePanel.tsx) (117줄)

**audit 결과**: 거의 wrapper. mobile-sidebar-backdrop inline div (L103-113) 만 잔여. 이건 platform mobile UX 라 *유지*. **변경 없음**.

### 2.6 PR-E9 보너스 — [ImageDetailClassList.tsx](frontend/components/gallery/image-detail/ImageDetailClassList.tsx) (84줄)

**audit 결과**: `ClassRow` 가 `$selected` + `$classified` 두 상태로 색 분기 (hover dim, active highlight, 외 outline). ui `SelectableListItem` 의 `selected` 하나 prop 만 노출 → 표현력 부족.

**결정**: classification 상태 표현 위해 *현 styled 유지*. 변경 없음. (향후 SelectableListItem 에 `classified` variant 추가하면 마이그 가능)

## 3. 변경 파일

| 파일 | 변경 | 절약 |
|---|---|---|
| `ImageDetailComments.tsx` | inline badge / icon button → ui Badge / IconButton | -15 |
| `ImageDetailContextMenu.tsx` | color swatch → ColorSwatch | -2 |
| `ImageDetailToolbar.tsx` | mobile-info-btn inline → ui IconButton | -10 |
| `ImageDetailSidebar.tsx` | UserRow/AccountIcon/UserText/iconAccount + count badge → SelectableListItem + Avatar + Badge | -40 |
| `image-detail-modal.styles.comments-core.ts` | CommentButton/CommentRetryButton/CommentButtons (필요 시) 제거 | -40 |
| `image-detail-modal.styles.sidebar.ts` | (해당 없음 — UserRow 는 ImageDetailSidebar.tsx 안 local styled) | 0 |

**합 추정**: **~ -107줄 platform**

## 4. 위험

- **낮음**. 모두 시각적 1:1 매핑.
- 주의: ui `Badge` 의 padding/font-size 가 inline badge 와 미세 차이 (var(--ig-space-1) var(--ig-space-4) vs 0 6px). 시각 spot-check 필요.
- ui `Avatar size={22} initials=...` 가 기존 22x22 AccountIconWrap 과 시각 동등한지 확인. initials 가 이메일 첫 글자/대문자 처리.
- `SelectableListItem` 의 hover/active background 토큰이 기존 `UserRow $active` 의 `rgba(77,136,255,0.12)` 와 다름 — design 의 의도된 alignment 일 가능성 (ui 표준 색).

## 5. 검증 절차

1. `cd frontend && npx tsc --noEmit` pass
2. `npm run dev` → 갤러리 이미지 모달:
   - **Comments**: count badge 표시 (0 vs >0 색 분기) / Edit / Archive 버튼 / Retry 버튼 동작 / Cancel/Post 버튼
   - **ContextMenu**: 우클릭 → Class submenu → 색 swatch 표시
   - **Toolbar**: mobile breakpoint 에서 info 버튼 정상 표시 (sidebar 토글)
   - **Sidebar Users**: labelers 표시 / selected user toggle / hover dim 동작 / Avatar 표시 / count badge

## 6. 후속

다음 거리: **PR-E14** (platform 최상위 modals — CommentModal/NoticeModal/ProjectModal audit + DialogShell 정렬).
