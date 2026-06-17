---
title: PR-E14 — platform 최상위 modals audit + ui 정리
date: 2026-05-11
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-platform
status: planning — 사용자 review 대기
---

# PR-E14 — platform top-level modals audit

## 1. 목적

phase-5-components-audit.md PR-E14 항목. platform 의 최상위 modals 3 개 (CommentModal / NoticeModal / ProjectModal, 합 442줄) 의 잔여 local styled 를 ui 컴포넌트로 정리. 동작 변경 없음.

## 2. 각 파일 audit 결과

### 2.1 [CommentModal.tsx](frontend/components/CommentModal.tsx) (168줄)

**이미 사용**: ui `DialogShell` + `Badge` (CountChip 가 Badge extend).

**잔여 local styled** (105줄 분량):
- `TitleWrap` / `Subtitle` — DialogShell title 안 subtitle UX
- `Body` (max-height + overflow)
- `EmptyHint` (-)
- `CommentList` / `CommentRow` (grid 96px 1fr auto, 14줄) — domain-specific grid layout
- `Thumb` (96x96, border-radius 10px) — *ui Avatar 는 round 만 지원* → 유지
- `CommentMain` / `ImageName` / `Meta` / `Preview` / `PreviewAuthor` — text styling
- `CountChip` styled(Badge) extend — Badge 직접 + inline style 로 단순화 가능

| 위치 | 현재 | 마이그 |
|---|---|---|
| L99-105 | `CountChip` = `styled(Badge).attrs({ $tone: 'accent' })` + 추가 style | `Badge $tone="accent"` + inline style (`alignSelf: 'start'`, `fontSize: 11`, `letterSpacing: 0.03em`, `textTransform: 'uppercase'`) |

**절약 추정**: -7줄 (CountChip styled 제거). 나머지 row layout 은 domain-specific 라 유지.

### 2.2 [NoticeModal.tsx](frontend/components/NoticeModal.tsx) (158줄)

**이미 사용**: ui `DialogShell` + `Button` + `IconButton`.

**잔여 local styled / inline**:
- `ActionBtn = styled(Button).attrs(...)` (3줄 attrs + 1줄 font-size override)
- `ArchiveBtn = styled(IconButton).attrs(...)` (3줄 attrs + svg width/height override)
- `iconArchive` inline SVG (7줄, 24px viewBox + 3 path)
- `Body` / `EmptyHint` / `NoticeList` / `NoticeRow` / `NoticeMain` / `NoticeTitle` / `NoticeDescription` / `NoticeMeta` / `NoticeActions` — 일반 token-styled divs

| 위치 | 현재 | 마이그 |
|---|---|---|
| L71-73 | `ActionBtn` styled extend | inline `<Button variant="secondary" size="sm">` |
| L75-80 | `ArchiveBtn` styled extend | inline `<IconButton variant="secondary" size="sm">` |
| L82-88 | `iconArchive` inline SVG (7줄) | lucide `Archive` icon (size={16}) |

**절약 추정**: -15줄.

### 2.3 [ProjectModal.tsx](frontend/components/ProjectModal.tsx) (116줄)

**이미 사용**: ui `DialogShell` + `Button`.

**잔여 local styled**:
- `Body` / `Empty` / `ProjectList` — token-styled wrappers
- `ProjectRow $selected` (10줄) + `ProjectName` (17줄 nested button) + `ProjectDescription` (8줄) — `$selected` 상태로 background/color 분기
- `AddProjectBtn = styled(Button).attrs({ variant: 'secondary' })` + `width: 100%; margin-top: 8px`

| 위치 | 현재 | 마이그 |
|---|---|---|
| L15-41 | `ProjectRow $selected` + `ProjectName` button (selected 시 background tint) | ui `SelectableListItem variant="flat" selected={...}` 직접 |
| L50-53 | `AddProjectBtn` styled extend | inline `<Button variant="secondary" style={{ width: '100%', marginTop: 8 }}>` |

**절약 추정**: -25줄 (ProjectRow + ProjectName + AddProjectBtn styled 제거).

## 3. 변경 파일

| 파일 | 변경 | 줄수 |
|---|---|---|
| `CommentModal.tsx` | CountChip styled → Badge inline style | 168 → 161 (-7) |
| `NoticeModal.tsx` | ActionBtn/ArchiveBtn/iconArchive → ui Button/IconButton/lucide Archive | 158 → 143 (-15) |
| `ProjectModal.tsx` | ProjectRow/ProjectName → SelectableListItem / AddProjectBtn → Button | 116 → 91 (-25) |

**합 추정**: **-47줄 platform**

## 4. 위험

- **낮음**. 모두 1:1 시각 매핑. caller API 변경 없음.
- `SelectableListItem variant="flat"` 의 hover/selected 토큰 (var(--ig-color-blue-tint-14)) 이 기존 ProjectRow 의 같은 토큰과 일치 — design 정합.
- lucide `Archive` icon (16px) 이 기존 inline SVG (16px) 와 시각 동등 — `archive` icon stroke 가 다를 수 있음, spot-check.

## 5. 검증 절차

1. `cd frontend && npx tsc --noEmit` pass
2. `npm run dev` →
   - **CommentModal**: 헤더 우클릭 (또는 Notice/Comment 버튼) 으로 open → comment row count chip 표시 확인 (accent 색)
   - **NoticeModal**: 알림 패널 → notice row 에 Open 버튼 + Archive icon 버튼 동작 + 시각 동등
   - **ProjectModal**: 프로젝트 선택 모달 → 현 프로젝트 highlight 확인 + Add Project 버튼 full-width

## 6. 후속

본 PR 후 audit-only 모달 마이그 마감. 다음 거리:
- **PR-E4** (edge BBoxCanvas split 725줄) — edge 작업 가능 시
- **PR-E15** (platform components/edge 1290줄) — 도메인 분류 신중
- **PR-E18** (Settings Tab framework audit) — audit-only
