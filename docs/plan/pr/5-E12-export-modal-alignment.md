---
title: PR-E12 — ExportModal cross-repo 정렬 (양 repo styled → ui Button/ProgressBar)
date: 2026-05-11
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-platform + ingradient-edge
status: planning — 사용자 review 대기
---

# PR-E12 — ExportModal 정렬

## 1. 목적

PR-E11 과 같은 패턴 — 양 repo 의 ExportModal 의 자체 styled (`*ModalBtn / ExportActionBtn / *ProgressFill / *ModalLabel/Value/Hint` 등) 를 ui 컴포넌트 (`Button`, `ProgressBar`) 로 정렬.

## 2. 양 repo 비교

| 측면 | platform IgpExportModal | edge ExportModal |
|---|---|---|
| 줄수 | 76 + 72 styles = 148 | 97 + 65 styles = 162 |
| DialogShell | ✅ ui | ✅ ui |
| 버튼 | `IgpModalBtn` styled (variant secondary/default) | `ExportActionBtn` styled ($primary) |
| Progress | determinate (`IgpProgressFill $progress={job.progress}`) — value-based | animated **indeterminate** during running (keyframes) + done(100%) + error(red 100%) |
| Body labels | `IgpModalLabel/Value/Hint` styled | `ExportDatasetName/ImageCount/LocalCount/StatusMsg` styled |
| Body container | `IgpModalBody` styled (flex column gap) | inline JSX |

## 3. 변경 매핑

### 3.1 platform IgpExportModal (-90줄 추정)

- `IgpModalBtn` → ui `Button variant="secondary"` / `variant="accent"` size="sm"
- `IgpModalBody` → inline `<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-3)' }}>`
- `IgpModalLabel` → inline `<div style={{ fontSize: '12px', color: 'var(--ig-color-text-muted)' }}>`
- `IgpModalValue` → inline `<div style={{ fontSize: '14px', fontWeight: 500 }}>`
- `IgpModalHint` → inline 동일 패턴
- `IgpProgressTrack / Fill / Label / Meta` → ui `ProgressBar value={job.progress}` + inline labels

→ `IgpExportModal.styles.ts` 거의 전부 제거 (-70줄)

### 3.2 edge ExportModal (-30~40줄 추정)

- `ExportActionBtn` → ui `Button variant="secondary"` / `variant="accent"` size="sm"
- `ExportDatasetName/ImageCount/LocalCount/StatusMsg` → inline div with ui token style

**Progress bar 처리** — *indeterminate UX 보존 필요*:
- 옵션 A: ui ProgressBar 만 사용 (determinate). running 시 0 → ... → done 100. *indeterminate UX 손실*
- **옵션 B 추천**: edge 의 ProgressBarTrack/Fill (indeterminate keyframe) 유지. ui ProgressBar 는 사용 안 함. ui token (border-radius pill, white-08 track) 만 정합

→ `ExportModal.styles.ts` 약 -30줄 (Button + label styled 제거. Progress 유지)

## 4. 변경 파일

| 파일 | 변경 |
|---|---|
| `platform IgpExportModal.tsx` | IgpModalBtn → ui Button. body 인라인. ui ProgressBar 사용 |
| `platform IgpExportModal.styles.ts` | 거의 전부 제거 (-70줄) |
| `edge ExportModal.tsx` | ExportActionBtn → ui Button. labels 인라인 |
| `edge ExportModal.styles.ts` | Button + label styled 제거 (-30줄). Progress 유지 |

**합 추정**: 양 repo **-130줄**

## 5. ui Progress 활용 검토

ui [ProgressBar](src/components/feedback/progress.tsx) — `value: number` (0~100) prop. determinate only.

향후 indeterminate 보강 거리:
- `indeterminate?: boolean` prop 추가
- 별도 PR (선택)

본 PR 에서는 platform 만 ui ProgressBar 사용. edge 는 자체 indeterminate 유지.

## 6. 위험

- 낮음. ui Button / ProgressBar 기반 — 시각 일관 + 토큰 사용
- platform 의 `IgpProgressFill` background 가 `var(--ig-color-accent)` 단색 → ui ProgressBar 의 linear-gradient (accent → accent-strong) 로 변화. 시각 미세 차이

## 7. 검증 절차

1. ui rebuild
2. platform / edge typecheck
3. platform `npm run dev` → catalog 에서 dataset .igp export 트리거:
   - "Export Dataset as .igp" 시작 화면 — Cancel / Export 버튼
   - exporting progress 표시 (job.progress 갱신)
   - completed 화면 — Download Again
4. edge `npm run dev:web` → dataset Export 모달:
   - idle / running (indeterminate animation) / done / error 분기 모두

## 8. 후속

- ui ProgressBar 에 `indeterminate` prop 추가 (별도 PR)
- 그 후 edge ExportModal 도 완전 ui 정렬 가능
