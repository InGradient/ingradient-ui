---
title: Phase 6 — Story 정리 + 문서 동기화
purpose: 5 페이지 추출 후 storybook story 들의 잔여 정합성 점검, plan 문서 업데이트, 새 사용 가이드 작성
audience: ingradient-ui contributor
date: 2026-05-15
status: draft
related:
  - ./platform-pages-extraction-roadmap.md
  - ./platform-pages-package-plan.md
  - ./platform-pages-phase-5-spec.md
---

# Phase 6 — Story 정리 + 문서 동기화

> Roadmap: [platform-pages-extraction-roadmap.md](./platform-pages-extraction-roadmap.md) § Phase 6

---

## 1. 목적

Phase 1~5 에서 5 페이지 view 를 추출했음. 본 phase 는 **추출 완성도 검증 + 문서 sync** 만 — 코드 변경 거의 없음. ingradient-platform 마이그레이션 (Phase 7) 직전의 정리 단계.

---

## 2. 작업 항목

### 2.1 Story import 정합성 점검 (grep)

5 platform page story 가 모두 `@ingradient/platform-pages` 의 view 만 호출하는지 확인:

```bash
grep -nE "import.*@ingradient/platform-pages" stories/pages/platform/0.0.1/*.stories.tsx
```

기대: 5 file (Catalog, ClassManage, CreateProject, Dashboard, SettingsModal) 모두 매치.

```bash
grep -nE "<(CatalogShell|DatasetListPanel|ClassListSidebar|SettingsAccountTab|DashboardOverviewPanel)" stories/pages/platform/0.0.1/*.stories.tsx
```

기대: 0 match — story 가 직접 ui pattern 을 조립하지 않고 view 를 통해서만 사용.

### 2.2 줄 수 점검

story file 4개 (CatalogClassManageCreateProjectSettingsModalDashboard) 줄 수가 모두 < 200 줄 인지 확인. helper file 들도 < 200.

### 2.3 빌드 / probe 회귀 점검

```bash
npm run build:package
npm run build:storybook
node tests/probes/{create-project,class-manage,catalog,settings-modal,dashboard}.mjs
```

모두 통과해야 함.

### 2.4 lint 통과 점검

```bash
npm run lint
```

### 2.5 platform-pages re-export 정합성

`packages/platform-pages/src/index.ts` 에 5 페이지 모두 export 됐는지 확인. 누락된 type 이 있으면 추가.

### 2.6 plan 문서 업데이트

[platform-pages-package-plan.md](./platform-pages-package-plan.md) 의 다음 section 갱신:

- §11 (마이그레이션 단계) 의 Phase 1~3 상태를 "완료" 로 표시
- Phase 4 (Settings) / Phase 5 (Dashboard) 도 완료된 것으로 추가 (원래 plan 의 1차 대상 아니었으나 사용자 요청으로 포함)
- §2 (문제 정의) / §3 (결정) 은 그대로 유지
- §15 (다음 액션) 을 Phase 7 (ingradient-platform 마이그레이션) 으로 갱신

### 2.7 사용 가이드 작성

새 파일 `docs/plan/platform-pages-usage.md` — ingradient-platform 측 개발자가 view 를 어떻게 import / props 주입 / 마이그레이션하는지 안내.

구성:
- 1. Quick start (package.json dependency + import)
- 2. 5 view 의 props 시그니처 요약 표
- 3. 페이지별 마이그레이션 예시 (CreateProjectPage 기준 — 가장 단순)
- 4. Hook → props 변환 패턴 (group spread 방식)
- 5. Storybook story 의 helper (`buildCatalogViewProps`, `buildSettingsViewProps`, `buildDashboardWidgets`) 가 참고 모델 임을 명시

### 2.8 (옵션) README 업데이트

`README.md` 에 `@ingradient/platform-pages` 의 존재를 한 줄 명시. 필수는 아님.

---

## 3. 변경 파일

### 3.1 신규 (1 file)

- `docs/plan/platform-pages-usage.md`

### 3.2 수정 (1 file)

- `docs/plan/platform-pages-package-plan.md` — §11, §15 갱신

### 3.3 점검만 (변경 없음)

- 5 story file
- `packages/platform-pages/src/index.ts`
- 모든 view 파일

---

## 4. 검증

| # | 명령 | 기대 |
|---|---|---|
| 1 | `grep -nE "import.*@ingradient/platform-pages" stories/pages/platform/0.0.1/*.stories.tsx` | 5 file 매치 |
| 2 | `grep -cE "^\s*<(CatalogShell\|DatasetListPanel\|ClassListSidebar\|DashboardOverviewPanel)\b" stories/pages/platform/0.0.1/*.stories.tsx` | 모두 0 |
| 3 | `wc -l stories/pages/platform/0.0.1/*.stories.tsx` | 모두 < 200 |
| 4 | `npx tsc --noEmit -p tsconfig.json` | 0 error |
| 5 | `npm run build:package` | exit 0 |
| 6 | `npm run build:storybook` | exit 0 |
| 7 | 5 probe sequential | 5+7+12+8+6 = 38/38 통과 |
| 8 | `npm run lint` | exit 0 |
| 9 | `docs/plan/platform-pages-usage.md` 존재 + 5 view 예시 포함 | manual |
| 10 | `docs/plan/platform-pages-package-plan.md` 의 §11, §15 갱신 | manual |

---

## 5. 성공 기준

- 검증 1~10 통과
- ingradient-platform 측 개발자가 사용 가이드만 보고 마이그레이션 시작 가능

---

## 6. 리스크 / Non-goals

### 6.1 lint 실패 가능성

위험: 기존 lint 규칙이 새 packages/platform-pages/ 를 검사 안 함 또는 새로운 위반 발생

대응: 검증 8 단계에서 발견 시 해당 violation 만 수정. lint config 변경은 별도 phase.

### 6.2 doc coverage 검사 통과 여부

`scripts/check-doc-coverage.mjs` 가 `packages/` 도 검사하는지 확인 필요. 검사하지 않으면 OK. 검사하는데 새 view 가 미달이면 별도 phase.

### 6.3 Non-goals

- `packages/ui/` 로의 추가 이동 (별도 phase)
- ingradient-platform 측 작업 (Phase 7)
- ingradient-edge / auth-service 등 다른 consumer 작업
- 새 visual regression snapshot 생성
- platform-pages 의 `*.stories.tsx` 작성 (story 자산은 그대로 ingradient-ui 의 stories/ 폴더에 유지)

---

## 7. Rollback

git revert 신규 1 + 수정 1 (문서 파일 2개만). 빌드/probe 영향 없음.

---

## 8. 종료 후 상태

- 5 platform page 의 view extraction 가 깔끔하게 정리됨
- `@ingradient/platform-pages` 사용 가이드 존재
- ingradient-platform 측 마이그레이션 (Phase 7) 진입 준비 완료

---

## 9. 다음 액션

1. 본 spec ok
2. 검증 1~8 실행 (대부분 read-only 명령)
3. 결과 따라 plan 문서 + usage 문서 작성
4. 검증 9~10 (문서 존재 + 내용 확인)
5. 모든 통과 시 Phase 6 완료 — Phase 7 spec 작성 또는 종료
