---
title: Phase 1 — CreateProject 추출
purpose: storybook 의 CreateProjectScene JSX 를 @ingradient/ui/platform-pages/create-project 로 승격하고 story 를 새 view 기반으로 rewrite
audience: ingradient-ui contributor
date: 2026-05-15
status: draft
related:
  - ./platform-pages-extraction-roadmap.md
  - ./platform-pages-package-plan.md
---

> **Archive only.** 이 draft는 Create Project extraction 당시의 source arbitration을 보존한다. 현재 package 계약은 [`packages/platform-pages/README.md`](../../packages/platform-pages/README.md), 현재 story 계약은 [Platform 0.0.1 README](../../stories/pages/platform/0.0.1/README.md)를 따른다.

# Phase 1 — CreateProject 추출

> Roadmap: [platform-pages-extraction-roadmap.md](./platform-pages-extraction-roadmap.md) § Phase 1

---

## 1. 목적

storybook 의 `CreateProjectScene` 컴포넌트와 ingradient-platform 의 `CreateProjectPage` 가 같은 JSX 를 공유하도록, **`CreateProjectView`** 를 `src/platform-pages/create-project/` 로 추출한다.

성공 후 양쪽 사용 모양:

```tsx
// storybook story
<CreateProjectView {...sceneToProps(scenario)} />

// ingradient-platform (Phase 7 에서 마이그레이션)
<CreateProjectView {...hookToProps(state)} />
```

---

## 2. JSX 출처 — Platform 기준

storybook story 와 platform page 의 JSX 가 다음 4 곳에서 다름. **view 는 platform 의 JSX 를 따른다** (실제 운용 코드라 더 정확).

| 항목 | Story 현행 | Platform | View 채택 |
|---|---|---|---|
| Project type UI | `RadioCardGroup` (label) | `OptionCard` (title + description) | OptionCard (platform) |
| Image dropzone | `UploadDropzone` 컴포넌트 | 자체 styled `Dropzone` + `FileInput` + file list | styled dropzone (platform) |
| 파일 표시 | `"N image(s) ready to upload"` 한 줄 | 파일별 `name (size KB)` 리스트 + hint | 파일 리스트 (platform) |
| Page shell | inline style 6개 | styled `Page` / `Content` / `LogoWrap` / `Card` / `Title` | styled (platform) |
| 에러 슬롯 | `error` (danger) + `validationError` (warning) 두 개 | `error` 하나 | 두 개 (story 호환) |
| 입력 모드 | 모두 readOnly | 완전 controlled | controlled |

`OptionCard` / `Dropzone` 등 styled-components 는 platform 의 `CreateProjectFormSections.styles.tsx` 를 그대로 복사한 뒤 ingradient-ui token (`var(--ig-color-*)`) 으로 정규화한다.

---

## 3. Props Interface

```ts
export type ProjectType = 'general' | 'deflectometry'

export interface CreateProjectViewProps {
  // controlled values
  name: string
  description: string
  firstDatasetName: string
  projectType: ProjectType
  files: File[]

  // status
  submitting?: boolean
  error?: string | null
  validationError?: string | null

  // callbacks
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onFirstDatasetNameChange: (value: string) => void
  onProjectTypeChange: (value: ProjectType) => void
  onFilesAdd: (newFiles: File[]) => void   // dropped/picked, append 책임은 caller
  onSubmit: () => void                     // view 가 e.preventDefault 처리
  onCancel: () => void
}
```

설계 노트:
- View 의 **local state** 는 `dragOver` (drag 시각 표시) + `fileInputRef` 만. 둘 다 §9.2 의 "purely visual" 허용 범위.
- `submitting` 시 모든 input / button `disabled`.
- 검증 (이름 비어있을 때 차단) 은 **caller 책임** — view 는 `onSubmit` 호출만, caller 가 trim 후 error 세팅.
- File handler 는 `onFilesAdd(newFiles)` 한 개. caller 가 `setFiles(prev => [...prev, ...newFiles])` 로 누적. view 는 누적 책임 없음.
- `cancel` 동작도 caller (router 또는 history.back).

---

## 4. 변경 파일

### 4.1 신규 (4 file)

```
src/platform-pages/create-project/
├─ CreateProjectView.tsx          — view 본체 (≤ 180 줄 목표)
├─ CreateProjectView.styles.ts    — styled-components (Page/Content/LogoWrap/Card/Title/Form/OptionCard/OptionGrid/OptionTitle/OptionText/Dropzone/FileInput/FileList/FileItem/OptionalLabel)
├─ types.ts                       — `ProjectType`, `CreateProjectViewProps` export
└─ index.ts                       — barrel: `export * from './CreateProjectView'; export * from './types'`
```

### 4.2 수정 (3 file)

#### `src/platform-pages/index.ts`

```ts
export * from './create-project'
```

#### `stories/pages/platform/0.0.1/CreateProject.stories.tsx`

- `CreateProjectScene` 컴포넌트 안의 JSX 삭제
- 새 `CreateProjectView` import + scenario → props 변환 함수 + `useState` 5개 (name/description/firstDatasetName/projectType/files) 로 controlled wrapping
- 줄 수 < 130 목표

변환 함수 (예시):
```ts
function useScenarioState(scenario: CreateProjectScenario) {
  const scene = createProjectScenarios[scenario]
  const [name, setName] = useState(scene.name)
  const [description, setDescription] = useState(scene.description)
  const [firstDatasetName, setFirstDatasetName] = useState(scene.firstDatasetName)
  const [projectType, setProjectType] = useState(scene.projectType)
  const [files, setFiles] = useState<File[]>(
    Array.from({ length: scene.filesCount }, (_, i) =>
      new File([''], `image-${i + 1}.jpg`, { type: 'image/jpeg' })
    )
  )
  return {
    name, description, firstDatasetName, projectType, files,
    submitting: scene.submitting,
    error: scene.error,
    validationError: scene.validationError,
    onNameChange: setName,
    onDescriptionChange: setDescription,
    onFirstDatasetNameChange: setFirstDatasetName,
    onProjectTypeChange: setProjectType,
    onFilesAdd: (newFiles: File[]) => setFiles(prev => [...prev, ...newFiles]),
    onSubmit: () => undefined,
    onCancel: () => undefined,
  }
}
```

#### `stories/fixtures/platform/0.0.1/create-project-scenarios.ts`

변경 없음. (scene 모양 그대로, story-side 에서 view props 로 변환)

---

## 5. 파일 줄 수 예산

| 파일 | 예산 |
|---|---|
| `CreateProjectView.tsx` | ≤ 180 |
| `CreateProjectView.styles.ts` | ≤ 120 |
| `types.ts` | ≤ 40 |
| `index.ts` | ≤ 10 |
| `CreateProject.stories.tsx` (rewrite) | ≤ 130 |

각 파일 200 줄 미만 규칙 준수.

---

## 6. 검증

| # | 명령 | 기대 |
|---|---|---|
| 1 | `npx tsc --noEmit -p tsconfig.json` | 0 error |
| 2 | `npm run build:package` | `lib/platform-pages.js` 크기 > 1 KB (view 코드 포함) |
| 3 | `npm run build:storybook` | exit 0 |
| 4 | Playwright probe — 5 scenario (default/filled/validation-error/submitting/server-error) | 모두 정상 렌더링, console error 0 |

Probe 스크립트 (별도 `.mjs` — `tests/probes/create-project.mjs`)에서 다음 확인:
- `Project name` label 존재
- `Project type` 라디오 2개 존재
- `Create Project` 버튼 존재
- `filled` scenario 에서 name input 값이 "Wafer line A Q2 2026"
- `submitting` scenario 에서 submit 버튼 disabled + 텍스트 "Creating…"
- `validation-error` scenario 에서 warning alert 존재
- `server-error` scenario 에서 danger alert 존재
- `filled` scenario 에서 파일 리스트 12개 row 존재

---

## 7. 성공 기준

- 검증 1~4 통과
- view 가 storybook 내부에서 import 가능 (`@ingradient/ui/platform-pages` 경로)
- story 의 도메인 JSX 삭제 (storyfile 줄 수 < 130)
- 줄 수 예산 준수

---

## 8. 리스크

### 8.1 styled-components 토큰 미스매치

위험: platform 의 `.styles.tsx` 가 `theme.color.*` 또는 raw hex 사용 → view 가 `var(--ig-color-*)` 와 불일치

대응: view styles 에서 모두 `var(--ig-color-*)` / `var(--ig-space-*)` / `var(--ig-radius-*)` 로 정규화. 이미 패턴 작업 시 `check:style-literals` 가드 있음. 실패 시 토큰 매핑 표 추가.

### 8.2 File 객체 placeholder 생성

위험: storybook 에서 `new File([''], ...)` 생성 시 jsdom / 브라우저 호환

대응: storybook 은 브라우저 환경이라 `File` 생성자 사용 가능. visual snapshot 에서 파일명 / 크기 KB 표시 정상인지 확인.

### 8.3 RadioCardGroup → OptionCard 시각 변화

위험: 기존 story 의 RadioCardGroup 시각 baseline 이 변함

대응: 의도된 변화 (platform 일치 목적). visual regression baseline 존재 시 update 필요. spec 7 에 명시.

### 8.4 story 의 validation/error alert 두 개 슬롯

위험: 한 시나리오에서 둘 다 표시 가능 (현재는 분리)

대응: view 는 둘 다 받지만 일반 사용은 하나만. story scenario 도 한 번에 하나만 세팅.

---

## 9. Rollback

git revert 7 file (신규 4 + 수정 3). lib 산출물 `lib/platform-pages.js` 가 다시 빈 entry 크기로 회귀하는지 확인.

---

## 10. 다음 액션

1. 본 spec ok
2. 4 신규 file 작성 → barrel export → story rewrite → probe 스크립트 작성
3. 검증 1~4 실행
4. Phase 2 (ClassManage) spec 으로 이동
