---
title: PR-E15 — platform components/edge folder targeted migration
date: 2026-05-11
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-platform
status: planning — 사용자 review 대기
---

# PR-E15 — platform components/edge folder targeted migration

## 1. 목적

phase-5-components-audit.md PR-E15. platform 의 *edge 디바이스 관리* 화면 (`components/edge/`, 1290줄, 7 파일) audit. ui 마이그 가능한 거리 식별 후 high-value 만 진행.

**Option B (targeted)** 채택 — 도메인 form pattern (CheckList/CheckItem/FieldRow/ReportBox 등) 은 유지, *재발명 거리* 만 마이그.

## 2. audit 결과

### 2.1 이미 마이그된 부분

[edge.styles.tsx](frontend/components/edge/edge.styles.tsx) 가 이미 ui 활용:
- `Alert`, `InlineMessage`, `NumberField`, `StatusPill` (re-export) — components
- `FormSection`, `PageContent` — patterns

### 2.2 마이그 거리 (high-value)

| 위치 | 현재 | 마이그 | 예상 |
|---|---|---|---|
| edge.styles `ProgressBar`/`ProgressFill`/`ProgressLabel` (-23줄) | custom progress styled | ui `ProgressBar` (determinate, value prop) | -15 |
| edge.styles `DropZone`/`DropZoneMt` (-15줄) | custom dropzone styled | ui `UploadDropzone` (drag+drop+click 내장) | -15 |
| edge.styles `SelectInput` (-10줄) | native `<select>` styled | ui `SelectField` (drop-in) | -10 |
| ImportTab 사용 변경 | ProgressBar + ProgressFill + ProgressLabel + DropZoneMt | ui ProgressBar + UploadDropzone | -10 |
| WorkOptionsTab 사용 변경 | `<SelectInput>` × 2 | `<SelectField>` × 2 | 0 (drop-in) |

### 2.3 마이그 안 함 (도메인 보존)

| 항목 | 이유 |
|---|---|
| `CheckList` / `CheckItem` / `CheckDivider` | edge config form 의 일관된 도메인 패턴 (5 tab 에서 사용) |
| `FieldRow` / `Label` | 일반적이나 caller-side variation 큼 (각 tab 마다 미세 layout 차이) |
| `ReportBox` / `ReportGrid` / `ReportStat` | ImportTab 의 4-column stat grid, 특수 layout |
| `Section` / `SectionTitle` / `SectionTitleMt` | PR-E18 결정 (옵션 C — 보류) |
| DeflectometryPreview 의 local Badge/CanvasFrame 등 | 과학 시각화 도메인 |
| `NumberInput` | `styled(NumberField)` 단순 width 80px 추가 — 유지 |

## 3. 변경 거리

### 3.1 edge.styles.tsx 정리

```diff
- ProgressBar, ProgressFill, ProgressLabel  (커스텀 progress bar)
- DropZone, DropZoneMt                       (커스텀 dropzone)
- SelectInput                                (native select wrapper)
```

기존 export 가 다른 file 에서 사용되는지 확인:
- `ProgressBar` / `ProgressFill` / `ProgressLabel` → ImportTab.tsx only
- `DropZone` / `DropZoneMt` → ImportTab.tsx only
- `SelectInput` → WorkOptionsTab.tsx only

→ caller 변경 동시 진행으로 전부 삭제 가능. **-48줄 styles**.

### 3.2 ImportTab.tsx 변경

```diff
- import { DropZoneMt, ProgressBar, ProgressFill, ProgressLabel, ... }
+ import { ProgressBar, UploadDropzone } from '@ingradient/ui/components'

- <DropZoneMt $active={dragOver} onDragOver={...} onDragLeave={...} onDrop={...} onClick={...}>
+ <UploadDropzone
+   accept=".igp,.ige,.zip"
+   multiple={false}
+   disabled={uploadPct !== null || polling}
+   onFiles={(files) => {
+     const file = files[0]
+     if (file && /\.(zip|ige|igp)$/i.test(file.name)) startImport(file)
+   }}
+ >
    {uploadPct !== null ? (
      <ProgressBar value={uploadPct} />  // ui determinate
    ) : polling ? (
      <ProgressBar value={job?.progress ?? 0} />
    ) : (
      'Drop .igp or .zip here or click to select'
    )}
+ </UploadDropzone>
```

`HiddenFileInput` + `fileInputRef` + 자체 dragover/drop handler 제거 — UploadDropzone 내장.

→ **-15줄**.

### 3.3 WorkOptionsTab.tsx 변경

```diff
- import { ..., SelectInput, ... } from './edge.styles'
+ import { SelectField } from '@ingradient/ui/components'

- <SelectInput id=... value=... onChange=...>
+ <SelectField id=... value=... onChange=...>
   <option ...>...</option>
- </SelectInput>
+ </SelectField>
```

(× 2 인스턴스 — capture_directions, exposure_per_pattern)

→ 같은 줄수 (drop-in).

## 4. 변경 파일

| 파일 | 변경 | 예상 줄수 |
|---|---|---|
| `edge.styles.tsx` | ProgressBar/Fill/Label + DropZone/DropZoneMt + SelectInput 제거 | 197 → 149 (-48) |
| `ImportTab.tsx` | UploadDropzone + ui ProgressBar 사용 | 243 → 228 (-15) |
| `WorkOptionsTab.tsx` | SelectField drop-in | 247 → 247 (0) |

**합 추정: -63줄 platform**

## 5. 위험

- **낮음~중간**.
- **시각 변경**:
  - **UploadDropzone disabled 시 surface-muted 배경** (현재는 transparent). 업로드 중 시각이 약간 회색조 — UX 로 *진행 중* 강조에 적합. 수용 권장.
  - **ui ProgressBar 너비**: 현 `max-width: 420px` → ui ProgressBar default 100%. caller 가 wrap 으로 width 제어.
  - **SelectField**: native select 가 portal 기반 DropdownMenu 로 바뀜. visual UX 향상 (custom styled menu).
- **기능 동등**: file ext validation 은 caller 의 onFiles 안 옮김 (drag-drop + click 모두 cover).
- **HiddenFileInput** 제거: UploadDropzone 내장 input 사용 → ImportTab 의 fileInputRef 도 제거.

## 6. 검증 절차

1. `cd frontend && npx tsc --noEmit`
2. `npm run dev` → 프로젝트 → Settings → Edge:
   - **Work Options** 탭: capture_directions / exposure_per_pattern dropdown 선택 동작
   - **Import** 탭:
     - dropzone click → file picker 열림, .igp/.zip 만 허용
     - dropzone 드래그 인 → border accent 색
     - .zip 드롭 → 업로드 시작 + ProgressBar 표시 + Cancel 동작
     - 업로드 완료 → polling + ProgressBar (stage 별 label)
     - 완료 시 report 표시 + status pill

## 7. 후속

본 PR 후 platform components/edge 거리 마감. Phase 5 platform 남은 거리:
- **PR-E1e-2 / PR-E4 / PR-E16** — edge runtime 검증 필요 → deferred
