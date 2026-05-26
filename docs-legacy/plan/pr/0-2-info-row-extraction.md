---
plan: PR-0.2 — InfoRow ui 추출 + platform/edge 마이그레이션
date: 2026-05-09
phase: 0 (warm-up)
pr id: PR-0.2
parent plan: ../components-audit-findings.md (§ 2)
master plan: ../../MASTER-PLAN.md (§ 9.1 — D-012 plan-first)
governance: ../../governance.md (D-007: 도메인 무관 + 재사용 가능)
estimated: 1-2h
---

# PR-0.2 — InfoRow ui 추출 + 양 repo 마이그레이션

## 목표

- ui 에 `<InfoRow>` 컴포넌트 신설 (label + value 2-column 표시).
- platform `ImageInfoRow` (image metadata) → ui `InfoRow` 마이그.
- edge `DiagRow` (NIC 진단 readout) + `NicStatusCard` 의 의존 → ui `InfoRow` 마이그.

## 왜

- 양 repo 모두 **2-column key-value readout** 패턴이 다수 사용. 도메인 무관 (image meta / 진단 / 설정 readout 어디든 적용).
- governance D-007 만족: 도메인 무관 + 재사용 가능성 + props ≤ 5.
- PR-0.1 와 같은 "시각 통일" 정신 — 양쪽 readout 시각이 한 곳에서 결정.

## audit (2026-05-09)

### platform `ImageInfoRow` (image-detail-modal.styles.info.ts:16-32)

```ts
export const ImageInfoRow = styled.div`
  font-size: 12px;
  margin-bottom: 4px;
  display: flex;
  gap: 8px;
  min-width: 0;
`
export const ImageInfoLabel = styled.span`
  color: var(--ig-color-text-soft);
  flex-shrink: 0;
`
export const ImageInfoValue = styled.span`
  color: var(--ig-color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
```

특징: **inline row** — 12px 작은 글자, no border, label/value flex, value 는 ellipsis. ImageDetailInfoPanel.tsx 의 ~30 항목 (File, Uploaded, Captured, Camera Type, etc).

### edge `DiagRow` (ConnectionTab.styles.ts:112-114)

```ts
export const DiagRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--ig-color-border-subtle);
  &:last-child { border-bottom: none; }
`
export const DiagLabel = styled.span`
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-muted);
  width: 110px;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`
export const DiagValue = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-primary);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`
```

특징: **table-row 분위기** — uppercase label (110px 고정), 행간 border, padding, value 가 badge/긴 텍스트 wrap. NicStatusCard.tsx 안의 ~25 행.

### 시각 비교

| 항목 | platform ImageInfoRow | edge DiagRow |
|---|---|---|
| Label 스타일 | text-soft, 일반 weight | uppercase + 110px 고정폭, text-muted |
| Row 구분 | `margin-bottom: 4px` | `border-bottom + padding 6px 12px` |
| Value | ellipsis (1줄) | flex-wrap (badge 포함, 다줄 가능) |
| Container | (단순 div) | `GigeDiagCard` (Panel + radius) 안 |

→ **시각 패턴 다름**. platform 은 dense inline list, edge 는 table-like rows.

## 결정 (사용자 합의 필요)

PR-0.1 의 "시각 통일이 중요" 결정과 일관 — ui InfoRow 1개 + 표준 시각으로 통일.

### 옵션 A (권장) — ui InfoRow 표준 시각 1개

ui InfoRow 의 표준 시각은 PR-0.1 의 `FormSection / FieldGroup / FieldLabel` 분위기와 일관:
- label: `var(--ig-font-size-xs)`, `weight 600`, `color: text-muted`, no uppercase
- value: `var(--ig-font-size-sm)`, `color: text-primary`
- row: `display: flex; gap: var(--ig-space-3); align-items: baseline; min-width: 0`
- border / padding: **없음** (caller 가 행간 분리 원하면 wrapper 처리)

→ platform image metadata: 시각 변화 적음 (글자 크기 조금 ↑, 정렬 살짝 변화).
→ edge NicStatusCard: uppercase + 행간 border 사라짐. `GigeDiagCard` (Panel) 안의 list 분위기. 행간 구분이 시각적으로 약해질 수 있음.

### 옵션 B — variant prop

`<InfoRow variant="inline" | "table">` — 두 needs 모두 cover. 단점: governance "no flexibility" 정신과 약간 충돌 (props 1 추가).

### 옵션 C — caller styled override

ui InfoRow 는 가장 단순한 시각만 (옵션 A). edge 가 행간 border 원하면 `styled(InfoRow)` 로 wrap. 단순함 유지하지만 edge 측 1 wrap 발생 (governance § 1.1 customize 5줄 이내 OK).

### assistant 권장: **옵션 A + (필요 시 edge caller override)**

이유:
1. PR-0.1 의 시각 통일 결정과 일관 (uppercase, border 사라지는 방향).
2. ui InfoRow 가 가장 단순 (props 0 또는 children-only) — 양쪽 자연 fit.
3. edge 진단 분위기를 더 강하게 원하면 caller (NicStatusCard) 가 wrapper 1개 추가 — D-007 § 3 의 "5줄 이내 customize OK" 안에 들어옴.

## 제안 ui API

```tsx
// @ingradient/ui/components/data-display/info-row.tsx (~30줄)

export const InfoRow = styled.div`
  display: flex;
  gap: var(--ig-space-3);
  align-items: baseline;
  min-width: 0;
`

export const InfoRowLabel = styled.span`
  font-size: var(--ig-font-size-xs);
  font-weight: 600;
  color: var(--ig-color-text-muted);
  flex-shrink: 0;
  min-width: 80px;
`

export const InfoRowValue = styled.span`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-primary);
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
  flex-wrap: wrap;
`
```

→ InfoRowValue 는 `flex-wrap: wrap` 으로 badge + 긴 텍스트 둘 다 cover (edge needs). ellipsis 가 필요한 caller 는 `style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}` inline (platform image metadata).

→ **props 0** (styled-components 의 className/style 만), 도메인 무관, 파일 ≤ 30줄.

## 변경 파일

### ui 추가 (1)

1. `ingradient-ui/src/components/data-display/info-row.tsx` 신설 (~30줄)
2. `ingradient-ui/src/components/data-display/index.ts` re-export 추가

### platform 마이그 (2)

3. `frontend/components/gallery/image-detail/image-detail-modal.styles.info.ts` 의 `ImageInfoRow / ImageInfoLabel / ImageInfoValue` 제거 (다른 export `ImageInfoSection / ImageInfoTitle / InfoDetailsToggle / InfoDetailsBody` 는 유지)
4. `frontend/components/gallery/image-detail/ImageDetailInfoPanel.tsx` import 변경 — `ImageInfoRow → InfoRow`, `ImageInfoLabel → InfoRowLabel`, `ImageInfoValue → InfoRowValue`

### edge 마이그 (2)

5. `src/frontend/components/settings/connection/ConnectionTab.styles.ts` 의 `DiagRow / DiagLabel / DiagValue` 제거 (다른 export `DiagDivider`, `GigeDiagCard`, `DiagRecommendTitle`, `DiagRecRow` 는 유지)
6. `src/frontend/components/settings/connection/NicStatusCard.tsx` import + 사용 변경

## 시각 변화 양상

### platform ImageDetailInfoPanel
- 글자 크기: 12px → `--ig-font-size-sm` (≈ 13-14px)
- Label: 일반 weight → weight 600
- 정렬: gap 8px → `--ig-space-3` (12px)
- ellipsis: caller inline style 로 보존 가능 (필요 시)

### edge NicStatusCard
- Label: uppercase + 110px 고정폭 → 일반 case + 80px min-width
- Row: 행간 border + padding 사라짐
- Container `GigeDiagCard` 의 panel 시각은 보존 → list 분위기 약간 약해짐

## 위험 / trade-off

- edge 진단 readout 의 행간 분리 약화 — list 가 "한 덩어리"로 보일 수 있음. 시각 결과 따라 후속 조정 (e.g., NicStatusCard 안 wrapper 에 `> * + * { border-top: ... }` 추가).
- platform image metadata 의 ellipsis 가 사라지면 긴 파일명 wrap → 시각 결과 후 `style={{whiteSpace:'nowrap', ...}}` inline 추가.
- 양쪽 다 시각 변화 — PR-0.1 의 시각 통일 흐름과 일관, 마지막 일괄 검증 시 종합 확인.

## 검증

- ui typecheck (`npx tsc --noEmit`)
- platform typecheck
- edge typecheck
- 시각 검증: 마지막 일괄 (사용자 결정)

## 후속

- edge 진단 readout 시각 더 명확히 원하면 NicStatusCard 안 wrapper 조정 (별도 PR 또는 본 PR 내)
- platform 긴 텍스트 wrap 처리 — 필요 시 inline style
- Phase 1 (ImageGrid) 본격 진입

## 완료 record (2026-05-09)

- ✅ 옵션 A 채택 — D-013 (시각 통일) 일관 적용
- ✅ ui InfoRow 신설 (`src/components/data-display/info-row.tsx`, props 0, ~28줄)
- ✅ platform `ImageDetailInfoPanel.tsx` 마이그 (~30 행 = 13 InfoRow 묶음)
- ✅ edge `NicStatusCard.tsx` 마이그 (~25 InfoRow 행)
- ✅ ui build + edge node_modules sync (D-014 — github tarball install 흐름)
- ✅ typecheck 통과 (ui / platform / edge — PR-0.2 관련 에러 0)
- 시각 검증: 마지막 일괄 (사용자 결정)
