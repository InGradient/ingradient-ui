# Phase 5 — Builders (ThemeBuilder / PageComposer / LayoutComposer)

**상위 문서**: [storybook_architecture_restructure.md](../storybook_architecture_restructure.md)
**위험도**: 중 (새 인터랙티브 UI 구현)
**선행 조건**: Phase 4 완료 (preset 시스템)
**후속 단계**: [Phase 6 — Multi-service 확장](./storybook-restructure-phase-6-multi-service.md)

---

## 1. 목적

상위 문서 8 의 builders 도구를 구현한다. 디자이너가 Storybook 안에서 직접 다음을 실험할 수 있게 한다:

- **ThemeBuilder** — Theme + Brand + Density + Token override 조합
- **PageComposer** — Pattern + Layout 조합으로 페이지 변형
- **LayoutComposer** — Layout primitive 조합

각 도구는 코드를 작성하지 않고도 결과를 즉시 시각화 → 안정화되면 `stories/pages/` 로 승격.

---

## 2. ThemeBuilder

### 2.1 기능
- 좌측 패널: theme / brand / density / mode 선택 + 개별 토큰 override input
- 우측 패널: 현재 preset 으로 렌더된 sample page (Phase 2 story 중 하나, 예: Dashboard)
- "Save as preset" 버튼 — 현재 조합을 새 preset (`.ts` 파일) 으로 export 다운로드

### 2.2 작업 항목
- [ ] `stories/builders/ThemeBuilder/ThemeBuilder.tsx` — 메인 UI
- [ ] `stories/builders/ThemeBuilder/TokenEditor.tsx` — 개별 토큰 input row
- [ ] `stories/builders/ThemeBuilder/PreviewFrame.tsx` — 우측 sample 영역
- [ ] `stories/builders/ThemeBuilder/exportPreset.ts` — preset JSON / TS 파일 다운로드 helper
- [ ] `stories/builders/ThemeBuilder/ThemeBuilder.stories.tsx` — Storybook story
- [ ] `stories/builders/ThemeBuilder/index.ts` — re-export

### 2.3 사용 ui
`@ingradient/ui/components` 의 `Panel`, `FormGroup`, `SelectField`, `TextField`, `Button`, `ColorSwatch`, `Switch` 만 사용. raw styled 금지.

---

## 3. PageComposer

### 3.1 기능
- pattern 선택 (예: SplitLayout, ListDetailLayout, InspectorLayout)
- 각 slot 에 어떤 component / pattern 을 넣을지 dropdown 선택
- 결과 페이지 실시간 렌더
- 현재 조합을 코드 스니펫으로 표시 (copy 가능)

### 3.2 작업 항목
- [ ] `stories/builders/PageComposer/PageComposer.tsx` — 메인 UI
- [ ] `stories/builders/PageComposer/SlotPicker.tsx` — slot 별 dropdown
- [ ] `stories/builders/PageComposer/CodeSnippet.tsx` — JSX snippet 표시
- [ ] `stories/builders/PageComposer/registry.ts` — 사용 가능한 patterns / components 목록 (예: `[{ id: 'SplitLayout', component: SplitLayout, slots: ['left', 'right'] }, ...]`)
- [ ] `stories/builders/PageComposer/PageComposer.stories.tsx`
- [ ] `stories/builders/PageComposer/index.ts`

---

## 4. LayoutComposer

### 4.1 기능
- layout primitive 조합 (Flex, Grid, Stack 등 — `src/primitives/layout` 활용)
- 각 primitive 의 props (gap, columns, alignment) 인터랙티브 조정
- 결과 + 코드 스니펫

### 4.2 작업 항목
- [ ] `stories/builders/LayoutComposer/LayoutComposer.tsx`
- [ ] `stories/builders/LayoutComposer/PrimitivePicker.tsx`
- [ ] `stories/builders/LayoutComposer/PropEditor.tsx`
- [ ] `stories/builders/LayoutComposer/LayoutComposer.stories.tsx`
- [ ] `stories/builders/LayoutComposer/index.ts`

---

## 5. 공통 — Sandbox 승격 흐름

builders 에서 만든 조합을 `stories/sandboxes/{service}/<name>.stories.tsx` 로 저장 → 검토 후 `stories/pages/{service}/{version}/` 로 승격.

- [ ] sandbox export helper — builder 화면의 "Save as sandbox" 버튼이 .stories.tsx 템플릿 생성
- [ ] 승격 절차 문서 `docs/plan/storybook-builders-promotion.md` (별도 작성 권장)

---

## 6. 검증 기준

- [ ] 3개 builder 모두 Storybook 사이드바 `Builders/` 그룹에 노출
- [ ] ThemeBuilder 에서 조합 변경 시 PreviewFrame 즉시 반영
- [ ] PageComposer / LayoutComposer 의 code snippet copy 동작
- [ ] 각 builder UI 가 `@ingradient/ui/*` import 만 사용 (raw styled 0건)
- [ ] preset 저장 / sandbox 저장 흐름이 동작

---

## 7. 산출물

- 3개 builder × (메인 + 보조 컴포넌트 + story + index.ts)
- preset / sandbox export helper
- 승격 절차 문서

---

## 8. 제외 (다음 phase)

- 다른 service (edge, medical) 용 builder 변형 — Phase 6
- backend 저장 (현재는 클라이언트 download / clipboard 만)
- 협업 (다중 사용자 동시 편집) — 별도 검토
