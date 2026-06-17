# Phase 2 — Platform Pages 0.0.1 채우기

**상위 문서**: [storybook_architecture_restructure.md](../storybook_architecture_restructure.md)
**위험도**: 낮음 (story 파일만 추가)
**선행 조건**: Phase 1 완료 (폴더 scaffold)
**후속 단계**: [Phase 3 — Token 재구조](./storybook-restructure-phase-3-token-restructure.md)

---

## 1. 목적

`stories/pages/platform/0.0.1/` 와 `stories/fixtures/platform/0.0.1/` 에 platform 0.0.1 의 첫 페이지 mockup 4개를 실제 story 로 작성한다. 이 단계까지 끝나면 storybook 으로 platform 페이지 모양을 디자이너/PM 이 직접 볼 수 있다.

---

## 2. 범위

### 2.1 대상 페이지 (현재 스코프: 2개)

| Story | 원본 platform 페이지 | Gap | 비고 |
|---|---|---|---|
| `auth/Login.stories.tsx` | `pages/auth/LoginPage.tsx` | 없음 | TextField + PasswordField + Button + Alert |
| `auth/Signup.stories.tsx` | `pages/auth/SignupPage.tsx` | 없음 | Login 패턴 재사용 |

**이연 (deferred)**:
- `CreateProject.stories.tsx` — `RadioCardGroup` (`projectType` 의 OptionCard 대체) + `UploadDropzone` 검증 후 진행. Phase 2 연장 가능
- `Dashboard.stories.tsx` — platform 의 DashboardPage 는 analysis dashboard (charts + widget grid). WidgetGrid 는 Phase 3+ 의 gap 확장과 직결 → Phase 4 (preset) 이후 별도 phase 로 분리

P3 (Catalog, ClassManage, AnalysisDashboard) 는 prop 확장 필요 — Token 재구조(Phase 3) 후 진행.

### 2.2 의존성 정책

- **only `@ingradient/ui/{components,patterns,primitives,tokens}` import** — platform/* 또는 다른 외부 의존성 금지
- mock 데이터는 `stories/fixtures/platform/0.0.1/` 에 정의 → story 에서 import
- 비즈니스 hook / API 호출 / 라우팅 없음

---

## 3. Fixtures 작성

### 3.1 파일 트리 (현재 스코프)
```
stories/fixtures/platform/0.0.1/
├─ preset.ts              # platform 0.0.1 토큰 메타 (Phase 4 에서 정식화, 지금은 placeholder)
├─ users.ts               # mock 사용자 (Login/Signup prefill 등)
└─ index.ts               # 모두 re-export
```

`projects.ts` / `project-types.ts` 는 Dashboard / CreateProject 진행 시 추가.

### 3.2 작업 항목
- [ ] `users.ts` — `{ id, name, email, avatarUrl? }` mock 3개
- [ ] `preset.ts` — `export const platformV001Preset = {}` placeholder (Phase 4 에서 채움)
- [ ] `index.ts` — 위 모듈 re-export

---

## 4. Story 작성 — 페이지별

### 4.1 `auth/Login.stories.tsx`

**필요 ui**: `Panel`, `FormGroup`, `FieldRow`, `TextField`, `PasswordField`, `Button`, `Alert`, `SmallText`

**Variants (export)**:
- [ ] `Default` — 빈 form
- [ ] `Filled` — email 입력 상태
- [ ] `ValidationError` — `<Alert tone="danger">` 표시
- [ ] `Submitting` — Button 에 `loading` 표시 + 폼 disabled

### 4.2 `auth/Signup.stories.tsx`

**필요 ui**: Login 과 동일 + `Checkbox` (약관 동의)

**Variants**:
- [ ] `Default`
- [ ] `PasswordMismatch` — Alert
- [ ] `Submitting`

### 4.3 `Dashboard.stories.tsx`

**필요 ui**: `AppShell`, `SidebarShell`, `AppSidebar`, `PageHeader`, `PageContent`, `DashboardGrid`, `SelectableListItem` (card variant), `Avatar`, `Badge`, `EmptyState`

**Variants**:
- [ ] `Empty` — 프로젝트 0개, `EmptyState` 표시
- [ ] `Default` — 프로젝트 3개
- [ ] `Many` — 프로젝트 12개

**검토 사항**: 새 프로젝트 카드 (점선 border) 의 시각이 `SelectableListItem` 으로 가능한지. 불가하면 Phase 2 안에서 ui 확장 또는 Phase 3 연계.

### 4.4 `CreateProject.stories.tsx`

**필요 ui**: `Panel`, `PageHeader`, `Breadcrumbs`, `FormSection`, `FieldGroup`, `FieldRow`, `TextField`, `TextareaField`, `RadioCardGroup`, `SelectField`, `Button`

**Variants**:
- [ ] `Default` — 빈 form
- [ ] `Step1Filled` — 이름 + 설명 입력
- [ ] `Step2TypeSelected` — RadioCardGroup 선택 상태
- [ ] `Submitting`

---

## 5. 검증 기준

### 5.1 시각 검증
- [ ] 각 story 가 platform 의 실제 페이지 스크린샷과 시각적으로 동일 (스크린샷 첨부 권장)
- [ ] dark / light token 모두 정상 표시 (Storybook backgrounds toolbar 로 전환 테스트)
- [ ] 반응형 — sm/md/lg viewport 에서 깨지지 않음

### 5.2 의존성 검증
- [ ] 각 story 파일의 import 가 `@ingradient/ui/*` 또는 fixtures 만
- [ ] `grep -r "from 'react'" stories/pages/platform/0.0.1/` 외 외부 의존성 없음
- [ ] react / styled-components 외 패키지 import 없음 (lucide-react 는 ui 가 의존하므로 허용)

### 5.3 빌드/실행
- [ ] `npm run storybook` 으로 4개 story 모두 열람 가능
- [ ] 각 story 의 variant 가 Storybook 사이드바에 노출

---

## 6. 산출물

- fixtures 모듈 5개 (`stories/fixtures/platform/0.0.1/`)
- story 파일 4개 (`stories/pages/platform/0.0.1/`)
- Storybook 에서 4 페이지 × variants 열람 가능

---

## 7. 제외 (다음 phase)

- Catalog / ClassManage / AnalysisDashboard (Gap 3건 처리 후) — Phase 3 또는 Phase 2 연장
- preset.ts 의 실제 토큰 정의 — Phase 4
- API mocking (msw 등) — 비즈니스 동작 시뮬레이션 필요 시 별도 계획

---

## 8. 참고

- [storybook_mockup_ui_gaps.md](../../../ingradient-platform/docs/plans/storybook_mockup_ui_gaps.md) — gap 검증 결과
- [storybook_mockup_roadmap.md](../../../ingradient-platform/docs/plans/storybook_mockup_roadmap.md) — 페이지별 mockup 계획
