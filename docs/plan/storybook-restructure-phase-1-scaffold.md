# Phase 1 — Storybook 폴더 Scaffold

**상위 문서**: [storybook_architecture_restructure.md](../storybook_architecture_restructure.md)
**위험도**: 낮음 (폴더 + placeholder 만 추가, 기존 코드 영향 없음)
**선행 조건**: 없음
**후속 단계**: [Phase 2 — Platform Pages 0.0.1](./storybook-restructure-phase-2-platform-pages.md)

---

## 1. 목적

상위 문서 5.1 의 stories/ 트리와 6.1 / 7.1 의 service/version 구조를 빈 골격 상태로 만든다. 실제 story 파일은 Phase 2 부터 채운다.

---

## 2. 현재 상태

```
stories/
├─ assets/       ✅
├─ builders/     ✅ (서브폴더 없음)
├─ fixtures/     ✅ (서브폴더 없음)
├─ foundations/  ✅
├─ guides/       ✅
├─ pages/        ✅ (서브폴더 없음)
├─ patterns/     ✅
├─ sandboxes/    ✅ (서브폴더 없음)
└─ support/      ✅
```

누락: `primitives/`, `components/`. 그리고 4개 폴더의 service/version 서브폴더.

---

## 3. 목표 상태

```
stories/
├─ assets/
├─ builders/
│  ├─ ThemeBuilder/        + README + index.ts
│  ├─ PageComposer/        + README + index.ts
│  └─ LayoutComposer/      + README + index.ts
├─ components/             + README + index.ts        ← 신규
├─ fixtures/
│  ├─ platform/0.0.1/      + README + index.ts
│  ├─ edge/                + README
│  └─ medical/             + README
├─ foundations/
├─ guides/
├─ pages/
│  ├─ platform/0.0.1/      + README + index.ts
│  ├─ edge/                + README
│  └─ medical/             + README
├─ patterns/
├─ primitives/             + README + index.ts        ← 신규
├─ sandboxes/
│  ├─ platform/            + README
│  ├─ edge/                + README
│  └─ medical/             + README
└─ support/
```

각 README 는 1~2줄 의도 명시. 각 index.ts 는 빈 re-export placeholder (`export {}`).

---

## 4. 작업 체크리스트

### 4.1 신규 최상위 폴더
- [ ] `stories/primitives/README.md` — "Primitive 컴포넌트 stories (Button, Input, Select, Modal, Table 등 기본 UI 요소)"
- [ ] `stories/primitives/index.ts` — `export {}`
- [ ] `stories/components/README.md` — "제품 도메인 컴포넌트 stories (DatasetCard, TrainingJobCard, StatusBadge, LabelToolbar 등)"
- [ ] `stories/components/index.ts` — `export {}`

### 4.2 Builders 서브폴더
- [ ] `stories/builders/ThemeBuilder/README.md` — "Theme + Brand + Density + Token override 조합 실험 도구"
- [ ] `stories/builders/ThemeBuilder/index.ts` — `export {}`
- [ ] `stories/builders/PageComposer/README.md` — "Pattern + Layout 조합으로 페이지 변형 실험 도구"
- [ ] `stories/builders/PageComposer/index.ts` — `export {}`
- [ ] `stories/builders/LayoutComposer/README.md` — "Layout primitive 조합 실험 도구"
- [ ] `stories/builders/LayoutComposer/index.ts` — `export {}`

### 4.3 Pages 서브폴더 (service/version)
- [ ] `stories/pages/platform/README.md` — "platform 서비스 페이지 snapshot. 버전별 하위 폴더로 관리"
- [ ] `stories/pages/platform/0.0.1/README.md` — "platform 0.0.1 MVP UI snapshot"
- [ ] `stories/pages/platform/0.0.1/index.ts` — `export {}`
- [ ] `stories/pages/edge/README.md` — "edge 서비스 페이지 snapshot (Phase 6)"
- [ ] `stories/pages/medical/README.md` — "medical 서비스 페이지 snapshot (Phase 6)"

### 4.4 Fixtures 서브폴더 (service/version)
- [ ] `stories/fixtures/platform/README.md` — "platform 서비스 mock data + UX scenario"
- [ ] `stories/fixtures/platform/0.0.1/README.md` — "platform 0.0.1 mock data + state simulation"
- [ ] `stories/fixtures/platform/0.0.1/index.ts` — `export {}`
- [ ] `stories/fixtures/edge/README.md` — "edge 서비스 fixtures (Phase 6)"
- [ ] `stories/fixtures/medical/README.md` — "medical 서비스 fixtures (Phase 6)"

### 4.5 Sandboxes 서브폴더 (service)
- [ ] `stories/sandboxes/platform/README.md` — "platform 실험 공간 (정식 stories/pages 승격 전 prototype)"
- [ ] `stories/sandboxes/edge/README.md` — "edge 실험 공간 (Phase 6)"
- [ ] `stories/sandboxes/medical/README.md` — "medical 실험 공간 (Phase 6)"

---

## 5. 검증 기준

- [ ] 위 체크리스트 모든 항목 완료
- [ ] `find stories -type d | sort` 결과가 § 3 의 목표 트리와 정확히 일치
- [ ] `find stories -name "README.md" | wc -l` ≥ 19 (신규 README 개수)
- [ ] storybook 빌드 정상 (`npm run build-storybook` 또는 동등 명령) — placeholder 가 빌드 깨지지 않음 확인
- [ ] git status 에 빈 폴더 누락 없음 (README/index.ts 가 모두 tracked)

---

## 6. 산출물

- 새 폴더 19+ 개 (구조)
- 새 README 19개
- 새 index.ts placeholder 9개
- 코드 변경: 없음 (src/ 무변경)

---

## 7. 제외 (다음 phase)

- 실제 story 파일 — Phase 2
- token 폴더 재구조 — Phase 3
- preset 파일 작성 — Phase 4
- builders 내부 실제 도구 구현 — Phase 5
- edge / medical 실제 콘텐츠 — Phase 6
