# Phase 6 — Edge / Medical 페이지 인벤토리

**상위 plan**: [storybook-restructure-phase-6-multi-service.md](./storybook-restructure-phase-6-multi-service.md)
**작성일**: 2026-05-12

Step 6.1 산출물. 두 서비스의 페이지 목록 + Phase 6 첫 버전에 포함할 우선순위.

---

## 1. ingradient-edge

**위치**: `/home/june/workspace/projects/ingradient-edge/`
**구조**: Electron app, React + styled-components
**@ingradient/ui 사용**: ✅ 적극 활용 중

### 페이지

| 페이지 | 복잡도 | 비고 |
|---|---|---|
| `LoginScreen.tsx` | 중 | 온/오프라인 모드 토글 + email/password + 저장된 계정 |
| `LicenseScreen.tsx` | 낮 | 라이선스 키 입력 + 기기 fingerprint 표시 |
| `DatasetSelectScreen.tsx` | 높 | 프로젝트별 데이터셋 그리드 + 최근 작업 |
| `Workspace.tsx` | 매우 높 | 캔버스 라벨링 — Phase 6 후순위 |

### 추정 Preset

```ts
{ theme: 'industrial-dark', brand: 'default', density: 'compact', mode: 'dark' }
```

근거: Electron 앱, 다크 배경, 공간 활용 최소화 (compact)

---

## 2. medilabel (medical)

**위치**: `/home/june/workspace/projects/medilabel/`
**구조**: Next.js + Tailwind + 자체 CSS class
**@ingradient/ui 사용**: ❌ 미사용 (자체 디자인 시스템)

### 페이지

| 페이지 | 복잡도 | 비고 |
|---|---|---|
| `AuthCard` (login/signup) | 낮 | 폼 + 모드 토글 |
| `ProjectPicker` | 중 | 프로젝트 그리드 + 생성 모달 (invites/classes) |
| `ClassWorkspace` | 낮 | 라벨 클래스 관리 |
| `CatalogWorkspace` | 중 | 이미지 카탈로그 관리 |
| `Workbench` (viewer) | 매우 높 | 3D VTK + Cornerstone — Phase 6 제외 |

### 추정 Preset (plan 가정 수정)

**원래 plan 가정**: `{ theme: 'medical', mode: 'light' }`
**실제**: `{ theme: 'medical-dark', mode: 'dark' }`

```ts
{ theme: 'medical-dark', brand: 'default', density: 'comfortable', mode: 'dark' }
```

근거:
- medilabel 의 CSS: `--bg-primary: #000000`, `--panel: #141722` (의료용 dark, 낮은 블루라이트)
- Density comfortable: 웹 앱, 읽기성 중시
- DICOM 영상 관찰 특성 (눈 피로 최소화) → light 가 아닌 dark

### 추가 작업 필요

medilabel 은 @ingradient/ui 미사용 → mockup 은 ui 컴포넌트로 재구성하는 형태. 시각이 약간 다를 수 있음.

---

## 3. Phase 6 첫 버전 페이지 선정 (3개 × 2 서비스)

### Edge — `0.0.1`
1. **Login** — LoginScreen 단순화 (온/오프라인 토글 + email/password)
2. **License** — 라이선스 키 입력 + status
3. **DatasetSelect** — 프로젝트 그리드 단순화 (3~6개 카드)

### Medical — `0.0.1`
1. **Auth** — login/signup 토글 폼
2. **ProjectPicker** — 프로젝트 그리드 + EmptyState variant
3. **ClassWorkspace** — 클래스 리스트 + 추가 폼

### 제외

- Edge `Workspace` (캔버스 라벨링) — 복잡도 매우 높음
- Medical `Workbench` (3D viewer) — 외부 의존성 (VTK/Cornerstone) + 복잡

---

## 4. ThemeId / DensityId 확장 필요

현재 types.ts 의 ThemeId/DensityId 에 추가:
- `ThemeId`: `industrial-dark` ✅, `medical-dark` (신규)
- `DensityId`: `compact` ✅, `comfortable` ✅

별도 코드 변경 없이 string union 에 추가하면 됨.

---

## 5. 다음 단계

1. Edge preset + 3 pages + fixtures
2. Medical preset + 3 pages + fixtures
3. Storybook preview 의 Preset toolbar 에 edge/medical 추가
4. types.ts 의 ThemeId 에 'medical-dark' 추가
