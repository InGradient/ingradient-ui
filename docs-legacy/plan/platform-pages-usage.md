---
title: '@ingradient/platform-pages' Usage Guide
purpose: ingradient-platform 측 개발자가 추출된 view 를 import / props 주입 / 페이지 컨테이너 작성하는 방법
audience: ingradient-platform frontend developer
date: 2026-05-15
status: stable
related:
  - ./platform-pages-package-plan.md
  - ./platform-pages-extraction-roadmap.md
---

# `@ingradient/platform-pages` Usage Guide

ingradient-ui 가 추출한 5 platform page view 를 ingradient-platform 에서 소비하는 가이드.

---

## 1. Quick start

### 1.1 Dependency 추가

ingradient-platform 의 `package.json`:

```json
{
  "dependencies": {
    "@ingradient/ui": "file:../ingradient-ui",
    "@ingradient/platform-pages": "file:../ingradient-ui/packages/platform-pages"
  }
}
```

`npm install` 후 `node_modules/@ingradient/platform-pages` 가 symlink 로 잡힘.

### 1.2 빌드 순서

`@ingradient/platform-pages` 는 `@ingradient/ui` 의 lib/ (`.d.ts` 포함) 가 빌드돼 있어야 type 해석. ingradient-ui 측에서:

```bash
cd ingradient-ui
npm run build:package
```

`packages/platform-pages/lib/index.js` + `lib/index.d.ts` 가 생성됨.

### 1.3 Import

```tsx
import {
  CreateProjectView,
  ClassManageView,
  CatalogView,
  SettingsModalView,
  DashboardView,
} from '@ingradient/platform-pages'

import type {
  CreateProjectViewProps,
  ClassManageViewProps,
  CatalogViewProps,
  SettingsModalViewProps,
  DashboardViewProps,
} from '@ingradient/platform-pages'
```

---

## 2. View 5종 — props 시그니처 요약

| View | Props group | 특징 |
|---|---|---|
| `CreateProjectView` | 5 controlled value + 3 status + 8 callback (flat) | 가장 단순. form page |
| `ClassManageView` | 4 group: `list / images / info / overlays` | 3-pane + 4 overlay |
| `CatalogView` | 9 group: `page / datasets / toolbar / images / rightSidebar / mobile? / statsContent / detailContent / overlays` | 가장 복잡. desktop + mobile + 10 overlay + stats/detail slot |
| `SettingsModalView` | 7 group: `tab / onTabChange / isAdmin / general / account / project / admin?` | modal + 5 tab + 4 admin sub-tab |
| `DashboardView<K>` | 5 group: `header / customize / overview / dateRange / widgets` | widget grid slot |

자세한 시그니처는 각 view 의 `types.ts` 또는 자동 생성된 `packages/platform-pages/lib/index.d.ts` 참조.

---

## 3. 마이그레이션 예시 — CreateProjectPage

**기존 ingradient-platform** (`frontend/pages/CreateProjectPage.tsx`, 약 134 줄):

```tsx
export function CreateProjectPage() {
  const navigate = useNavigate()
  const { refetchProjects, setCurrentProjectId } = useProjects()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  // ... 6+ useState
  // ... 60 줄의 JSX (Page, Card, Form, ProjectDetailsSection, ...)
}
```

**마이그레이션 후** (≈ 90 줄):

```tsx
import { useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import { CreateProjectView, type ProjectType } from '@ingradient/platform-pages'
import { uploadFiles } from '../api/images'
import { createProject, fetchDatasets } from '../api/projects'
import { useProjects } from '../store/useProjectStore'

export function CreateProjectPage() {
  const navigate = useNavigate()
  const { refetchProjects, setCurrentProjectId } = useProjects()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [firstDatasetName, setFirstDatasetName] = useState('')
  const [projectType, setProjectType] = useState<ProjectType>('general')
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setError(null)
    setValidationError(null)
    const trimmedName = name.trim()
    if (!trimmedName) {
      setValidationError('Project name is required.')
      return
    }
    setSubmitting(true)
    try {
      const project = await createProject({
        name: trimmedName,
        description: description.trim() || undefined,
        first_dataset_name: firstDatasetName.trim() || undefined,
        deflectometry_enabled: projectType === 'deflectometry',
      })
      await refetchProjects()
      setCurrentProjectId(project.id)
      if (files.length > 0) {
        const datasets = await fetchDatasets(project.id)
        if (datasets[0]) await uploadFiles(files, undefined, { datasetId: datasets[0].id })
      }
      navigate('/', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create project.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <CreateProjectView
      name={name}
      description={description}
      firstDatasetName={firstDatasetName}
      projectType={projectType}
      files={files}
      submitting={submitting}
      error={error}
      validationError={validationError}
      onNameChange={setName}
      onDescriptionChange={setDescription}
      onFirstDatasetNameChange={setFirstDatasetName}
      onProjectTypeChange={setProjectType}
      onFilesAdd={(newFiles) => setFiles((prev) => [...prev, ...newFiles])}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    />
  )
}
```

기존 `frontend/components/projects/CreateProjectFormSections.tsx` + `.styles.tsx` 는 **삭제 가능** — view 가 동일한 JSX 를 내장.

---

## 4. Hook → props 변환 패턴

복잡한 페이지 (Catalog / SettingsModal / Dashboard) 의 경우 hook 출력이 그룹 단위라 `buildXxxViewProps()` 헬퍼 패턴이 깔끔.

**예시 — Catalog:**

```tsx
function buildCatalogViewProps(
  data: ReturnType<typeof useCatalogPageData>,
  ui: ReturnType<typeof useCatalogPageUiState>,
): CatalogViewProps {
  return {
    page: { title: 'Catalog', subtitle: '...', projectName: data.projectName },
    datasets: {
      datasets: data.datasets,
      selectedIds: ui.selectedDatasetIds,
      onSelectAll: ui.setSelectedDatasetIds,
      // ...
    },
    toolbar: { /* ... */ },
    images: { /* ... */ },
    rightSidebar: { /* ... */ },
    overlays: { /* ... */ },
  }
}

export function CatalogPage() {
  const data = useCatalogPageData(...)
  const ui = useCatalogPageUiState()
  return <CatalogView {...buildCatalogViewProps(data, ui)} />
}
```

이 패턴은 storybook 의 `stories/pages/platform/0.0.1/catalog/build-view-props.tsx` 가 그대로 reference. mock fixture 대신 실제 hook 결과를 넣기만 하면 동작.

---

## 5. Storybook helper — 참고 모델

각 페이지의 view-props 변환은 storybook 에 이미 작성됨. ingradient-platform 측 마이그레이션 시 다음 helper 파일을 reference 로 사용:

| View | Storybook helper |
|---|---|
| `CreateProjectView` | (story 안에 inline — 60 줄) `stories/pages/platform/0.0.1/CreateProject.stories.tsx` |
| `ClassManageView` | (story 안에 inline — 80 줄) `stories/pages/platform/0.0.1/ClassManage.stories.tsx` |
| `CatalogView` | `stories/pages/platform/0.0.1/catalog/build-view-props.tsx` (+ `build-overlays.ts`, `build-stats-content.tsx`) |
| `SettingsModalView` | `stories/pages/platform/0.0.1/settings/build-view-props.tsx` (+ `build-admin-props.tsx`, `build-storage-slots.tsx`) |
| `DashboardView` | `stories/pages/platform/0.0.1/dashboard/build-widgets.tsx` + story inline |

차이점 — mock fixture 대신 ingradient-platform 의 hook (`useCatalogPageData`, `useGalleryImageList`, `useSettings()` 등) 결과를 props 로 변환.

---

## 6. Slot 패턴

다음 영역은 view 가 **slot** 으로 받음 — caller 가 JSX 직접 제공:

| View | Slot | 이유 |
|---|---|---|
| `CatalogView` | `statsContent`, `detailContent` | 차트/annotation viewer 는 platform 마다 다른 데이터 |
| `SettingsModalView` | `admin.storage.{overviewSlot, tierChartSlot, ...}` (8 slot) | storage analytics 차트 8개 |
| `DashboardView` | `widgets.widgets` (Record) | 8 widget 의 시각화는 story-specific |

ingradient-platform 측에서 slot 을 채울 때는 storybook 의 helper 파일의 JSX 를 **그대로 복사** 하거나, 자체 데이터로 차트 패턴 (`BarChartCard`, `LineChartCard` 등) 을 구성.

---

## 7. View 가 받지 않는 책임

다음은 caller (ingradient-platform 의 페이지 컨테이너) 가 책임:

- API 호출 (`useGalleryImageList`, `createProject`, `IAM API` 등)
- react-query mutation / invalidation
- `react-router-dom` navigation
- `zustand` store read/write
- auth / permission 판단 (view 는 `permissionDenied` bool prop 으로 받음)
- localStorage 영속화
- route param 해석
- 검증 (예: 이름 trim 후 빈값 차단) — view 는 `onSubmit` 만 호출, validation 결과를 `validationError` prop 으로 재주입

---

## 8. Trouble shooting

### 8.1 type import 가 안 풀림

`@ingradient/platform-pages` 의 `lib/index.d.ts` 가 빌드돼 있어야 함. ingradient-ui 측에서 `npm run build:package` 실행.

### 8.2 `Cannot find module '@ingradient/ui/components'`

`@ingradient/platform-pages` 는 `@ingradient/ui` 를 peer dependency 로 가짐. ingradient-platform 의 node_modules 에 `@ingradient/ui` 가 함께 있어야 함.

### 8.3 view 의 시각이 platform 의 기존 화면과 차이

view 는 storybook 기준으로 작성됐고, platform 의 기존 JSX 와 일부 시각 차이가 있을 수 있음 (예: `CreateProjectView` 의 page width 가 platform 의 720px 이 아닌 520px). 마이그레이션 시 의도된 시각 통일 — platform 기존 컴포넌트는 삭제.

### 8.4 view 가 받지 않는 prop 가 필요한 경우

view 의 props 가 부족하면 view 자체를 확장하기 전에 **caller 가 wrapper 컴포넌트** 를 만들어 추가 prop 을 prepend. view 의 props surface 확장은 ingradient-ui 측에서 별도 작업.

---

## 9. 마이그레이션 순서 권장

1. `CreateProjectPage` (가장 단순, form 1개)
2. `DashboardPage` (slot 패턴 검증)
3. `ClassManagePage` (3-pane)
4. `SettingsModal` (modal + tabs)
5. `CatalogPage` (가장 복잡, desktop + mobile)

각 페이지 마이그레이션 후:
- 빌드 (`npm run build`) 통과
- 수동으로 페이지 열어서 기존 동작 확인
- e2e (있다면) 통과
- commit

---

## 10. 변경 시 절차

`@ingradient/platform-pages` 의 view 시그니처를 변경할 때:

1. ingradient-ui repo 에서 view 수정 + story rewrite + probe 통과
2. `npm run build:package` 로 lib 갱신
3. ingradient-platform repo 에서 `npm install` 또는 file: dep 갱신
4. ingradient-platform 의 페이지 컨테이너에 type error 발생 시 props 조정
5. e2e 확인 후 commit

view 의 props 가 platform 의 hook 출력 모양과 점차 어긋나면 별도 phase 에서 view 를 platform 모양에 맞춤.
