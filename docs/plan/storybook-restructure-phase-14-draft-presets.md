# Phase 14 — Save as Draft Preset (V2 § 25.3 / § 24.3)

**상위 문서**: [storybook_architecture_restructure.md § 17.4, § 24.3, § 25.3](../storybook_architecture_restructure.md)
**위험도**: 낮음 (localStorage + ThemeBuilder UI 만)
**선행 조건**: Phase 11 (ThemeBuilder Export)
**후속 단계**: Story Review Status, Visual Regression baseline

---

## 1. 목적

디자이너가 ThemeBuilder 에서 만든 조합을 **브라우저에 저장** 해 두고 나중에 복원. Export (download/copy) 와 별개로 **세션 간 임시 보관** + 빠른 비교.

§ 24.3 "Save as Draft Preset" — V2 첫 항목. 서버 불필요 (localStorage only).

## 2. 동작

```
ThemeBuilder 에서 조합 작업
→ "Save as draft" 버튼 클릭 + name 입력
→ localStorage 에 named draft 저장

이후 페이지 열림
→ "Drafts" 리스트에 saved drafts 표시
→ "Load" 클릭 → 해당 args 로 복원 (Storybook updateArgs)
→ "Delete" 클릭 → draft 제거
```

## 3. 설계

### 3.1 storage 형식

localStorage key: `ingradient-ui:theme-builder:drafts`
값: `Record<string, { args: BuilderArgs; savedAt: number }>`

### 3.2 helper

`stories/support/drafts.ts`:
- `listDrafts(scope)` → `Draft[]`
- `saveDraft(scope, name, args)` → `void`
- `deleteDraft(scope, name)` → `void`
- `scope` 인자로 namespace 분리 (theme-builder / page-composer 등)

### 3.3 ThemeBuilder UI

- 새 섹션 "Drafts":
  - name input + "Save as draft" 버튼
  - 저장된 drafts list — 각 row: name, savedAt, Load, Delete
- Load 클릭 → `updateArgs(draft.args)` (storybook/preview-api 의 useArgs)
- Save 성공 시 flash feedback (기존 export feedback 와 동일)

## 4. 작업 체크리스트

- [ ] `stories/support/drafts.ts` — listDrafts / saveDraft / deleteDraft
- [ ] ThemeBuilder.stories.tsx — Save/Load drafts UI + useArgs 연동
- [ ] 본 plan 문서

## 5. 검증
- [ ] typecheck 통과
- [ ] Save 후 브라우저 새로고침 시 draft 유지
- [ ] Load 클릭 시 ThemeBuilder controls 즉시 반영
- [ ] Delete 클릭 시 list 갱신

## 6. 산출물
- 1 helper + ThemeBuilder UI 갱신 + plan

## 7. 제외 (다음)
- PageComposer / LayoutComposer drafts (필요 시 동일 패턴)
- Cloud 동기화 (당분간 local only)
- 다른 사용자와 draft 공유
