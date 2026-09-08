# 2026-08-19 Platform 품질·접근성 개선 작업 리포트

> 상태: 완료 · 전달 대상: `origin/main` · 최종 커밋: `3a630df`

## 1. 목적과 범위

오늘 작업은 Platform UI의 안전한 통합을 완료하고, 재사용 컴포넌트의 키보드 접근성·대화상자 동작·차트 데이터 접근·Storybook 문서화를 순차적으로 보완하는 범위로 진행했다.

다음은 범위에 포함했다.

1. dirty local `main`과 `origin/main`의 안전한 통합 및 stash 검증
2. Platform story/probe의 회귀 검증과 Auth probe timing race 수정
3. Table, ImageCard, UploadDropzone, TwoColumnDialog, LineChartCard의 접근성 보완
4. backdrop의 보조기술 노출 정리
5. Storybook에서 새 키보드 interaction contract를 확인할 수 있는 문서화

다음은 범위에서 제외했다.

- Linux 전용 visual baseline의 신규 승인 또는 갱신
- 기존 `check:style-literals` debt의 전면 정리
- 제품 기능 또는 visual design의 신규 추가

## 2. 전달 결과

| 항목 | 결과 |
|---|---|
| 원격 기준 브랜치 | `origin/main` |
| 최종 전달 커밋 | `3a630df` |
| 오늘 전달 커밋 | `2a5e3fb`, `c77e842`, `cb19436`, `ec2ce06`, `3a630df` |
| 최종 unit 검증 | 59 files / 244 tests passed |
| TypeScript | `tsc --noEmit` passed |
| ESLint | 0 errors, 기존 warning 4건 |
| package build | `npm run build:package` passed |
| Storybook build | `npm run build:storybook` passed |

## 3. 안전 통합과 기존 작업 보존

### 3.1 통합 전 상태

- local `main`은 `22fc822` 기반의 dirty 상태였다.
- `origin/main`은 `815501e`까지 전진해 있었다.
- local 변경 중 일부는 최신 원격 구현과 동일한 책임을 더 이른 형태로 구현한 것이어서, 무조건 stash를 복원하면 최신 접근성·Storybook 구조를 되돌릴 위험이 있었다.

### 3.2 보존 조치

| 대상 | 조치 |
|---|---|
| dirty main 변경 | `dirty-main-before-merge` stash로 보존 후 비교 |
| merge를 막은 untracked 파일 11개 | `/tmp/dirty-main-untracked-backup/`에 별도 백업 |
| 안전 통합 worktree | `platform-safe-integration` worktree에서 검증·커밋 |
| worktree 전체 백업 | `ingradient-ui-local-backups/platform-safe-integration-20260819-180354`에 보존 |

### 3.3 stash audit 결과

stash의 변경 62개 파일을 현재 `main`과 파일별로 비교했다. 이미 최신 main에 반영된 37개 파일 외의 차이도 모두 최신 구현을 이전 상태로 되돌리는 회귀였다.

대표 사례:

| 파일/영역 | stash가 되돌리려던 변경 | 판정 |
|---|---|---|
| `Table` | `getRowKey`, `headerAriaLabel`, generic row identity 제거 | 최신 main 유지 |
| Class Management | 동적 `sequenceCounts`를 하드코딩 badge 값 `4`로 복원 | 최신 main 유지 |
| Catalog/ClassManage layout | inspector 앞 `dividerBefore: 'strong'` 제거 | 최신 main 유지 |
| Settings Modal | action column 및 field의 accessible name 제거 | 최신 main 유지 |
| Storybook/probe | 이전 flat story 구조와 옛 probe contract 복원 | 최신 grouped story 구조 유지 |

유효한 개선은 발견되지 않았으므로 stash를 안전하게 삭제했다. 이후 반복 가능한 절차는 `auditing-stash-against-main` skill과 프로젝트 gotcha에 기록했다.

## 4. 통합 후 품질 검증과 Table/Auth 개선

### 4.1 responsive·probe 검증

- Platform 화면을 9개 viewport에서 점검했고 horizontal overflow는 모두 `0px`이었다.
- console error는 관찰되지 않았다.
- Auth의 checkbox selector가 초기 scenario reset effect와 경쟁하던 문제를 `checkboxWithLabel()` helper로 안정화했다.
- Platform static probe 전체를 다시 실행해 **89/89 passed**를 확인했다.
  - Auth 12
  - Catalog 22
  - Class Management 16
  - Create Project 5
  - Dashboard 16
  - Settings Modal 18

### 4.2 Table contract 확장 — `2a5e3fb`

`Table<T>`의 공개 contract와 Storybook 예시를 보완했다.

- `getRowKey`로 `{ id?: ... }` 제약이 없는 generic row identity를 지원
- icon-only/비어 있는 header에 `headerAriaLabel`을 제공
- `onRowClick`이 있는 row는 `tabIndex={0}`과 Enter/Space activation을 제공
- 호출자는 `getRowAriaLabel`로 row action의 맥락을 전달
- Storybook에 row keyboard usage 예시와 설명 추가

이 변경과 함께 Auth probe race를 수정했고, unit 223/223, type check, lint, package build, Storybook build를 통과한 뒤 `main`에 반영했다.

## 5. 클릭 가능한 UI 접근성 audit

`src/components/`, `src/patterns/`, `packages/platform-pages/src/`를 대상으로 `onClick` 요소를 전수 점검했다.

- 분석 대상: 86개 `onClick` 요소
- 확정 gap: 11개
- false positive: FilterChipRow는 `styled.button` 기반이라 수정 불필요

분류와 처리 결과:

| 심각도 | 항목 | 결과 |
|---|---|---|
| High | ImageCard | 해결 |
| High | UploadDropzone | 해결 |
| High | FilterChipRow | false positive 확인 |
| Medium | LineChartCard point selection | 해결 |
| Low | TwoColumnDialog Escape/focus | 해결 |
| Low | filter popover/context menu backdrop | 해결 |
| Low | DialogShell, MobileNavShell, MediaDialogShell backdrop | 기존 Escape/close/`aria-hidden` contract 확인, 변경 불필요 |

## 6. 컴포넌트별 접근성 개선

### 6.1 ImageCard와 UploadDropzone — `c77e842`

#### ImageCard

- `onOpen` 또는 `onSelect`가 제공될 때만 interactive semantics 부여
- `role="button"`, `tabIndex={0}`, action 기반 `aria-label` 추가
- Enter/Space가 primary action을 실행하도록 `onKeyDown` 추가
- non-interactive 상태는 tab order에서 제외
- token 기반 `:focus-visible` outline 추가
- unit test 7건 신규 추가

#### UploadDropzone / DropZone

- visible dropzone을 keyboard button으로 노출
- enabled 상태: `role="button"`, `tabIndex={0}`, `aria-label="Upload files"`
- disabled 상태: tab order 제외
- Enter/Space가 native file picker를 열도록 처리
- DropZone에 token 기반 `:focus-visible` outline 추가
- unit test 5건 추가

### 6.2 TwoColumnDialog와 backdrop — `cb19436`

#### TwoColumnDialog

- open 시 dialog shell로 focus 이동
- close 시 이전 focus 복원
- Escape로 `onClose` 실행
- dialog shell에 `tabIndex={-1}` 추가

#### filter popover / context menu backdrop

- click-catcher backdrop을 `aria-hidden="true"`로 표시
- 보조기술의 탐색 경로에 purely visual overlay가 섞이지 않도록 보완

### 6.3 LineChartCard data access — `ec2ce06`

Recharts SVG point는 기본적으로 마우스 click만 지원한다. `onPointClick`을 제공하는 차트에 동일한 데이터를 제공하는 visually-hidden data table을 추가했다.

- `onPointClick`이 있을 때만 table 렌더링
- column header는 `xKey`와 series label을 사용
- data row는 `tabIndex={0}`으로 focus 가능
- Enter/Space가 pointer click과 같은 `onPointClick(entry, index)`를 호출
- loading 또는 empty state에서는 table을 렌더링하지 않음
- chart layer의 dependency boundary를 지키기 위해 table layer의 `VisuallyHidden`을 import하지 않고 local `SrOnly`을 사용
- unit test 9건 신규 추가

## 7. Storybook executable documentation — `3a630df`

새 interaction contract가 코드에만 머물지 않도록 Storybook에 다음 문서와 play validation을 추가했다.

| Story | 추가 내용 |
|---|---|
| `Components/Data Display/ImageCard` | `KeyboardActivation` story. Enter로 `onOpen` 호출을 검증하고 a11y를 blocking mode로 설정 |
| `Components/Inputs/UploadDropzone` | Tab → Enter/Space로 file picker를 열 수 있다는 사용법과 keyboard focus contract 기록 |
| `Patterns/Charts/Overview` | `KeyboardDataAccess` story. data row Enter 선택 후 live status가 갱신되는 흐름을 검증 |

UploadDropzone의 native file picker는 browser play에서 직접 제어하면 환경별로 flaky할 수 있으므로, Storybook play는 role/tabindex/focus contract만 확인한다. 실제 Enter/Space → input click 동작은 unit test가 검증한다.

## 8. 실행한 검증

### 통합·기능 검증

| 검증 | 결과 |
|---|---|
| Platform responsive QA | 9 viewport, overflow `0px`, console error 없음 |
| Platform probe sweep | 89/89 passed |
| Auth focused probe | 12/12 passed |
| 접근성 변경 후 unit suite | 59 files / 244 tests passed |
| `tsc --noEmit` | passed |
| `npm run lint` | 0 errors, 기존 warnings 4건 |
| `npm run build:package` | passed |
| `npm run build:storybook` | passed |

### 알려진 환경/기존 이슈

| 항목 | 상태와 판단 |
|---|---|
| `check:doc-coverage` | 이번 변경과 무관한 seed file 14개 누락으로 기존 실패. 문서화 변경은 Storybook build에서 정상 compile됨 |
| symlinked worktree의 Storybook browser project | Vite가 addon setup real path를 worktree 밖으로 해석할 수 있어 focused browser project를 신뢰할 수 없음. production Storybook build로 확인 |
| Storybook addon 경고 | symlink 환경에서 `@storybook/addon-mcp`, stylelint 관련 package resolution 경고가 있었으나 build는 성공 |
| Linux visual baseline | snapshot 기준은 `chromium-linux`. macOS/Darwin capture를 baseline으로 대체하지 않음 |

## 9. 커밋·배포 이력

| 커밋 | 내용 | 전달 상태 |
|---|---|---|
| `2a5e3fb` | Table row keyboard activation·accessible label, Auth probe timing 안정화 | `origin/main` 반영 |
| `c77e842` | ImageCard·UploadDropzone keyboard accessibility | `origin/main` 반영 |
| `cb19436` | TwoColumnDialog Escape/focus, backdrop `aria-hidden` | `origin/main` 반영 |
| `ec2ce06` | LineChartCard visually-hidden data table | `origin/main` 반영 |
| `3a630df` | Storybook keyboard interaction documentation | `origin/main` 반영 |

모든 오늘 작업 커밋의 author는 `simonkang76`이며, 최종적으로 `main`에 fast-forward merge 후 원격에 push했다.

## 10. 남은 작업과 권장 우선순위

1. **Linux visual baseline 승인**
   - Dashboard, Settings Modal, Auth, Create Project의 Linux baseline 상태를 CI/Linux 환경에서 확인·승인한다.
   - macOS capture는 geometry 확인용으로만 사용하고 Linux baseline을 대체하지 않는다.

2. **`check:doc-coverage` seed 누락 정리**
   - 현재 누락된 14개 seed file이 의도적인 consolidation 결과인지, 다시 등록해야 하는 현재 contract인지 문서 migration 관점에서 분류한다.

3. **`check:style-literals` debt audit**
   - raw color가 실제 token 누락인지, chart palette·color swatch처럼 domain data인지 구분한 뒤 필요한 항목만 token화한다.

4. **6006 visual review**
   - 최신 `main`에서 ImageCard focus ring, UploadDropzone focus/disabled state, Chart keyboard data access story를 실제 검토한다.

## 11. 결론

오늘 작업으로 안전 통합 과정에서 기존 작업을 잃지 않고 최신 `main`을 보존했으며, audit에서 발견된 유효한 clickable-element accessibility gap을 모두 해결했다. 변경은 component contract, unit test, Storybook executable documentation, platform probe, build validation, remote delivery까지 연결되어 있다.
