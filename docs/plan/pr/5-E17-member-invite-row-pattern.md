---
title: PR-E17 — Member / Invite row Pattern + table consolidation
date: 2026-05-11
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-ui + ingradient-platform
status: planning — 사용자 review 대기
---

# PR-E17 — Member / Invite row Pattern + table consolidation

## 1. 목적

phase-5-components-audit.md PR-E17. platform settings 의 member/invite 관련 6 파일 (~1471줄) 의 *공통 row 패턴* 추출. 가장 큰 platform 거리.

## 2. audit 결과 요약

### 2.1 패턴 분류

| 파일 | 줄수 | 패턴 |
|---|---|---|
| `tabs/InvitationsTab.tsx` | 459 | search result row + invitations table + join codes table |
| `tabs/OrgMembersTab.tsx` | 131 | org member table (login/name/role/status/remove) |
| `project/ProjectMembers.tsx` | 185 | CSS Grid member row (name/org/email/role/remove) |
| `project/ProjectMemberInvite.tsx` | 126 | search result row (= InvitationsTab 와 *동일*) |
| `project/ProjectPermissions.tsx` | 271 | permission control (delegates) — row 없음 |
| `project/ProjectPermissionMatrix.tsx` | 299 | sticky-column permission matrix — *특수* |

### 2.2 중복 핵심

**A. Search Result Row** (InvitationsTab + ProjectMemberInvite — *거의 동일*):
```tsx
<button width:100% display:flex justify:between padding border-radius>
  <ResultText display:column>
    <span>{primary name}</span>
    <span muted>{email}</span>
  </ResultText>
  <span trailing>{actionLabel}</span>  // "Add" / "Invite" / "Adding…" etc.
</button>
```
→ **고가치 추출 거리** (2 파일 ~50줄 styled 중복).

**B. Compact data table** (InvitationsTab × 2 + OrgMembersTab):
```tsx
const Table = styled.table`font-size:13px; border-collapse:collapse;`
const Th = styled.th`padding:6px 8px; font-weight:500; border-bottom:...;`
const Td = styled.td`padding:8px; border-bottom:...;`
const MutedTd = styled(Td)`color:var(--ig-color-text-muted);`
const StatusTd = styled(Td)<{ $status }>`color: ${statusColor};`
const CodeTd = styled(Td)`font-family: monospace;`
const EmptyTd = styled.td`padding:16px 8px; text-align:center; ...;`
```
→ ui 에 이미 `Table<T>` (columns/rows API) 존재. 사용 가능. 단:
- per-cell color tone 은 `render` callback 안에서 `<span style={...}>` 으로 처리
- empty state 는 외부 conditional render
- 시각 미세 차이 (font-size xs vs 13px, padding) 수용 가능

**C. Member Row (CSS Grid)** (ProjectMembers only — *유일*):
- 5-column grid `1.1fr 1fr 1.3fr auto auto`
- 다른 파일은 table 사용 → grid 공유 안 됨

→ **추출 안 함** (단일 사용, refactor 가치 낮음).

### 2.3 제외

- ProjectPermissions / ProjectPermissionMatrix — 특수 (sticky column + checkbox matrix). 별건.

## 3. 변경 거리

### 3.1 ui 신규

**[src/components/data-display/search-result-row.tsx](src/components/data-display/search-result-row.tsx)** — 신규 ~40줄

```tsx
export interface SearchResultRowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary: React.ReactNode      // 이름 또는 fallback
  secondary?: React.ReactNode   // email (옵션)
  actionLabel: React.ReactNode  // "Add", "Invite", "Inviting…" 등
}

export const SearchResultRow = React.forwardRef<HTMLButtonElement, SearchResultRowProps>(...)
```

스타일: full-width flex justify-between, padding, border, hover border-accent, disabled opacity. 디자인은 InvitationsTab 의 패턴 (var(--ig-color-border-subtle) + surface-interactive) 채택.

**Storybook story** + index 추가.

### 3.2 platform 마이그

| 파일 | 변경 | 추정 |
|---|---|---|
| `ProjectMemberInvite.tsx` | `SearchResultButton` / `ResultText` styled 제거 → ui `SearchResultRow` 사용 | -25줄 |
| `tabs/InvitationsTab.tsx` | `SearchResultButton` / `ResultText` / `ResultSub` / `InviteAction` 제거 + table 2개 → ui `Table<T>` | -90줄 |
| `tabs/OrgMembersTab.tsx` | manual `<Table>` → ui `Table<T>` + 자체 styled (`Th`/`Td`/`MutedTd`/`EmptyTd`) 제거 | -35줄 |
| `project/ProjectMembers.tsx` | **변경 없음** (Grid layout 5-column 유지) | 0 |

**합 추정: -150줄 platform**

### 3.3 추출하지 않는 항목

- **ProjectMembers** CSS Grid — 유지. 5-column custom layout (org column 포함). ui Table 의 fixed table-layout 과 다름.
- **ProjectPermissionMatrix** — sticky 1열 + checkbox toggle. 너무 특수.
- **MemberRow Pattern** — 양 형식 (table vs grid) 혼재 + variation 큼 → 단일 Pattern 으로 통일 시 한쪽 시각 변경. 보류.

## 4. 위험

- **낮음~중간**.
- ui `Table<T>` 의 `table-layout: fixed` 가 기존 자연 sizing 과 다름. 시각 차이 가능 (column width 균등 분배). InvitationsTab 의 5-column table 에서 fixed 가 적합한지 spot-check 필요.
- ui `Th` font-size 가 xs (12px), 기존 13px — 시각 미세 차.
- ui `Td` color 가 `--ig-color-text-secondary`, 기존 text-primary — *시각 변경*. render callback 으로 force override 가능 (`<span style={{color:'var(--ig-color-text-primary)'}}>`) 또는 차이 수용.
- Empty state 가 ui Table 안에 슬롯 없음 — 외부 `{rows.length === 0 && <Placeholder>}` 패턴 사용.

→ **시각 변경 수용 가능** 한지가 핵심 결정 (Settings tab 의 사용자 visibility 낮은 영역). 본 PR 은 *기능 동등*, *시각 약간 align* 으로 진행.

## 5. 변경 순서

1. **ui 작업** — `SearchResultRow` 컴포넌트 + story + index 추가 + build
2. **platform 작업** — 4 파일 (3 마이그, 1 유지) 단일 commit
3. **검증** — typecheck + dev 에서 invitations 페이지 / org members / project members 화면 확인

## 6. 검증 절차

1. `cd ui && npm run build`
2. `cd platform/frontend && npx tsc --noEmit`
3. `npm run dev` →
   - Settings → Org Members 탭: 멤버 리스트 표시, role 표시, remove 버튼 동작
   - Settings → Invitations 탭: 초대 검색 (3자 이상) → 결과 행 표시 + Invite 버튼 / 초대 테이블 (revoke) / join codes 테이블 (delete)
   - Settings → Project → Members: 5-column grid (변경 없음) 정상
   - Settings → Project → Member Invite: 검색 결과 행 + Add 버튼

## 7. 후속

본 PR 후 platform settings 내 데이터 테이블 패턴 통일. 다음 거리:
- **PR-E1e-2** / **PR-E4** (edge BBoxCanvas) — edge 검증 시
- **PR-E15** (platform components/edge folder 1290줄)
- **PR-E16** (edge LogPanel)
