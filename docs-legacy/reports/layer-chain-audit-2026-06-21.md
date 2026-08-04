# Foundation → Primitives → Components → Patterns → Pages 계층 감사

> **Status — archived dated audit snapshot.** 아래 수치와 위반 목록은 2026-06-21 기준이다. 현재 계층 authority는 [Components Vs Patterns](../../docs/reference/components-vs-patterns.md), [`ui-refactoring-rule.md`](../../ui-refactoring-rule.md), [`@ingradient/platform-pages`](../../packages/platform-pages/README.md)를 따른다.

- 감사일: 2026-06-21
- 대상: `src/`, `packages/edge-pages/src/`, `packages/platform-pages/src/`, 관련 검사 스크립트와 활성 문서
- 원칙: 코드는 변경하지 않고 정적 분석, 타입 검사, 기존 테스트/검사 실행 결과만 기록한다.
- 결론: import 방향은 대체로 하향을 지키지만, 실제 UI 조합은 특히 Edge Pages에서 중간 계층을 광범위하게 우회한다. Primitives 자체에도 토큰 계약과 시맨틱 HTML 오류가 있어, Pages만 치환하기 전에 기반 계약부터 고쳐야 한다.

## 1. 판정 기준

이 감사에서는 다음 의존 방향을 정상으로 본다.

```text
Foundation (tokens, brand assets)
  ↓
Primitives (layout, typography, surface, recipes)
  ↓
Components (input, feedback, navigation, overlay, data display, chart)
  ↓
Patterns (shell, pane, toolbar, page rhythm, composed workflow UI)
  ↓
Pages (platform/edge product view and domain composition)
```

`hooks`와 `utils`는 시각 계층과 직교하는 support 계층으로 별도 취급했다. `stories/pages`는 제품 구현이 아니라 Pages 패키지를 조합하는 소비/검증 코드로 보았다.

정상 판정은 “상위 레이어를 import하지 않는다”만 뜻하지 않는다. 다음도 함께 확인했다.

1. 상위 레이어가 바로 아래 재사용 단위를 실제로 사용하고 있는가.
2. raw CSS 값을 토큰 이름으로 옮겨 적기만 한 것은 아닌가.
3. 같은 역할의 control/layout을 페이지에서 다시 구현하지 않았는가.
4. 파일 위치, public export, `data-ig-layer`, 문서의 분류가 일치하는가.
5. 검사 자동화가 Pages까지 같은 규칙으로 보호하는가.

## 2. 전체 요약

### 2.1 계층별 상태

| 계층 | 판정 | 핵심 근거 |
|---|---|---|
| Foundation | 주의 | product/domain 전용 layout token이 core에 있고, `brand`가 asset과 React component를 혼합하며, tokens가 compatibility alias로 primitives를 역참조한다. |
| Primitives | 수정 선행 필요 | 숫자 spacing prop이 token 단계가 아니라 raw px가 되며, `Heading`의 실제 태그가 한 단계씩 밀리고, `Text` 기본 weight가 token을 우회한다. |
| Components | 부분 준수 | primitives import 방향은 정상이나, 이미 존재하는 Button/Text/Stack 계열을 쓰지 않고 내부 native styled control을 다시 만든 사례가 남아 있다. 일부 shell/multi-pane 단위는 문서 기준상 Patterns 성격이다. |
| Patterns | 대체로 준수 | Components 44개, Primitives 22개 import declaration을 사용하고 역방향 import는 없다. 다만 15개 파일에 native styled 정의 76개가 남아 있고 문서의 “전부 제거” 기록과 다르다. |
| Platform Pages | 부분 준수 | lower layer 사용량은 높지만 inline style과 숫자 typography 값이 많고, domain pattern이 Pages 패키지 안에서 `data-ig-layer="patterns"`를 선언한다. |
| Edge Pages | 미준수 비중 큼 | native styled 정의 467개, 그중 `styled.button` 50개. 명시적 primitives import는 1건뿐이며 `Text` primitive 사용은 0건이다. |

### 2.2 import 방향

production `.ts/.tsx`를 TypeScript AST로 분석한 결과, 명백한 하위 → 상위 import는 1건뿐이다.

| From | To | import declaration 수 |
|---|---:|---:|
| Components | Foundation | 34 |
| Components | Primitives | 41 |
| Patterns | Foundation | 10 |
| Patterns | Primitives | 22 |
| Patterns | Components | 44 |
| Pages | Foundation | 10 |
| Pages | Primitives | 61 |
| Pages | Components | 163 |
| Pages | Patterns | 48 |
| Pages | root barrel `@ingradient/ui` | 102 |

유일한 역방향은 [`src/tokens/recipes.ts`](../../src/tokens/recipes.ts)의 `../primitives/recipes` re-export다. 파일 주석에 backward compatibility라고 명시되어 있어 즉시 버그는 아니지만, Foundation이 Primitives를 참조하는 구조적 예외다.

즉, 가장 큰 문제는 import 그래프의 화살표가 아니라 중간 계층을 사용하지 않고 상위 계층 내부에서 동일 UI를 다시 만드는 것이다.

### 2.3 구현 우회 신호

아래 수치는 결함 수가 아니라 native 구현 밀도를 보는 지표다. specialized SVG/table/layout처럼 정당한 사례도 포함한다.

| 영역 | production 파일 | native `styled.tag` 정의 | native JSX tag | inline `style` attribute |
|---|---:|---:|---:|---:|
| Components | 140 | 219 | 77 | 93 |
| Patterns | 39 | 76 | 32 | 37 |
| Edge Pages | 150 | 467 | 85 | 77 |
| Platform Pages | 144 | 143 | 152 | 220 |

Edge Pages의 native styled 구성은 Platform Pages의 3.2배다. Platform은 primitives/components 조합 비중이 높고, Edge는 큰 `.styles.ts` 파일에서 화면과 control을 함께 다시 구현하는 경향이 뚜렷하다.

## 3. 우선순위별 발견사항

## F-01. Primitives의 숫자 spacing prop이 Foundation token을 우회한다

- 심각도: 높음
- 영향: Components, Patterns, Platform Pages 전반

[`src/primitives/shared.ts:3`](../../src/primitives/shared.ts)에서 숫자 `Space`를 `${value}px`로 바꾼다.

```ts
return typeof value === 'number' ? `${value}px` : value
```

따라서 `<Stack gap={3}>`은 `var(--ig-space-3)`인 8px가 아니라 raw `3px`이다. 반면 [archived components extraction audit](./components-extraction-candidates-2026-05.md)는 `gap` 숫자 범위를 `0-13`으로 설명하고, 실제 production 코드는 token 단계처럼 작은 숫자를 반복 사용한다.

production의 `Box/Stack/Inline/Grid/Container` 숫자 `gap` 사용은 총 66건이다.

- `gap={0}`: 27건
- non-zero raw px: 39건
- Components: 30건
- Patterns: 12건
- Platform Pages: 24건

대표 위치:

- [`src/components/data-display/side-panel-layout.tsx:46`](../../src/components/data-display/side-panel-layout.tsx)
- [`src/components/inputs/date-range-picker.tsx:109`](../../src/components/inputs/date-range-picker.tsx)
- [`src/patterns/comment/comment-thread.tsx:10`](../../src/patterns/comment/comment-thread.tsx)
- [`src/patterns/forms/checkbox-group.tsx:57`](../../src/patterns/forms/checkbox-group.tsx)
- [`packages/platform-pages/src/catalog/gallery/gallery-filter-panel.tsx:74`](../../packages/platform-pages/src/catalog/gallery/gallery-filter-panel.tsx)

수정 권고:

1. 기존 numeric prop 의미를 갑자기 token index로 바꾸지 않는다. Storybook은 `gap={32}`처럼 raw px 계약에도 의존하므로 전역 변경은 회귀 위험이 크다.
2. production에서는 spacing 숫자 사용을 금지하고 `gap="var(--ig-space-3)"` 또는 typed token alias만 허용한다.
3. `Space`를 `TokenSpace | CssLength`처럼 구분하거나 `spaceToken={3}` 같은 명시적 API를 추가한다.
4. `space()`와 layout primitives 단위 테스트를 추가한다.

## F-02. `Heading level`과 실제 HTML heading 태그가 한 단계씩 어긋난다

- 심각도: 높음
- 영향: 접근성, 문서/구현 신뢰성

[`src/primitives/typography/heading.tsx:16`](../../src/primitives/typography/heading.tsx)은 다음처럼 렌더 태그를 계산한다.

```ts
const as = `h${Math.min(level + 1, 6)}`
```

결과는 다음과 같다.

| API | 문서상 태그 | 실제 태그 |
|---|---|---|
| `Heading level={1}` / `H1` | `h1` | `h2` |
| `Heading level={2}` / `H2` | `h2` | `h3` |
| `Heading level={3}` / `H3` | `h3` | `h4` |
| `Heading level={4}` / `H4` | `h4` | `h5` |

Storybook 문서는 H1~H4가 의미적 `h1~h4`로 렌더된다고 명시한다. production에서 현재 확인된 직접 영향은 [`src/components/overlays/two-column-dialog.tsx:88`](../../src/components/overlays/two-column-dialog.tsx)의 `H4`가 `h5`가 되는 사례다.

수정 권고:

1. 시각 size와 semantic heading level을 분리할지 먼저 결정한다.
2. 현재 계약을 유지한다면 `as = h${level}`로 고친다.
3. H1~H4 각각의 `tagName`, font-size token, weight token을 검증하는 테스트를 추가한다.

## F-03. `Text`가 기본 weight token을 실제로 사용하지 않고, Pages에서 숫자 typography가 확산됐다

- 심각도: 높음
- 영향: theme 변경, typography 일관성

[`src/primitives/typography/text.tsx:42`](../../src/primitives/typography/text.tsx)의 `resolveWeight()`는 `weight` 미지정 시 숫자 `400`을 반환한다. 이 값이 항상 `$weight`로 전달되므로 line 66의 `var(--ig-font-weight-regular)` fallback은 실행되지 않는다.

추가로 Platform Pages에는 다음 우회가 있다.

- `<Text weight={500|600|700}>`: 55건
- `<Text letterSpacing="0.04em|0.05em|0.5px|1px">`: 20건

`Text`는 이미 `regular/medium/semibold/bold/black`과 `tight/normal/wide/wider/widest` alias를 지원하므로 대부분 기존 primitive API로 치환할 수 있다.

대표 위치:

- [`packages/platform-pages/src/settings-modal/storage/storage-analytics-tab.tsx:76`](../../packages/platform-pages/src/settings-modal/storage/storage-analytics-tab.tsx)
- [`packages/platform-pages/src/settings-modal/project/project-settings-form.tsx:100`](../../packages/platform-pages/src/settings-modal/project/project-settings-form.tsx)
- [`packages/platform-pages/src/dashboard/dashboard-header.tsx:40`](../../packages/platform-pages/src/dashboard/dashboard-header.tsx)

수정 권고:

1. `resolveWeight(undefined)`가 `undefined`를 반환하게 하여 CSS token fallback이 작동하도록 한다.
2. 숫자 weight는 backward compatibility만 유지하고 production 신규 사용을 lint로 금지한다.
3. 55건을 `medium/semibold/bold` alias로, 20건을 letter-spacing alias로 치환한다.
4. `Text` 기본/alias 렌더 값을 단위 테스트한다.

## F-04. Edge Pages가 Components/Primitives를 우회해 control과 layout을 재구현한다

- 심각도: 높음
- 영향: 시각/상태/a11y 불일치, 유지보수 비용

Edge Pages production 150개 파일에서 확인된 수치:

- native `styled.*`: 467개
- `styled.button`: 50개
- primitives 명시 import declaration: 1개
- root barrel을 통해 확인된 primitive symbol: 6개
- `Text` primitive 사용: 0건
- package 내부 Storybook story: 0개
- package 내부 unit test: 0개

대표적인 재구현 묶음:

1. [`packages/edge-pages/src/login/LoginView.styles.ts`](../../packages/edge-pages/src/login/LoginView.styles.ts)와 [`packages/edge-pages/src/license/LicenseView.styles.ts`](../../packages/edge-pages/src/license/LicenseView.styles.ts)
   - `Card`, `Title`, `Subtitle`, `Field`, `FieldLabel`, `Input`, `SubmitBtn`, `SettingsIconBtn`, `ErrorMsg`를 각각 다시 구현한다.
   - 사용 가능한 lower layer: `Surface/Card`, `Heading/Text`, `TextField`, `Button`, `IconButton`, `Alert`, `Stack/Inline`.
2. [`packages/edge-pages/src/capture/DeflectometryTuningControlsView.styles.ts`](../../packages/edge-pages/src/capture/DeflectometryTuningControlsView.styles.ts)
   - `Spinner`, `Select`, checkbox row, `Btn`, warning box, quality card를 다시 구현한다.
   - 사용 가능한 lower layer: `Spinner`, `SelectField/DropdownSelect`, `Checkbox`, `Button`, `Alert`, `Card/Surface`, `Stack/Inline/Text`.
3. [`packages/edge-pages/src/dataset-select/dataset-card.styles.ts`](../../packages/edge-pages/src/dataset-select/dataset-card.styles.ts)
   - task tag, class chip, recent badge, menu button/menu item을 직접 만든다.
   - Platform의 `DatasetTaskTag`, 공통 `Tag/Badge/ColorChip/IconButton/ContextMenuWithSubmenus`와 역할이 겹친다.
4. [`packages/edge-pages/src/connection/ConnectionTabView.styles.ts`](../../packages/edge-pages/src/connection/ConnectionTabView.styles.ts)
   - 한 파일에 native styled 정의 48개가 있고 raw dimension/color가 집중되어 있다.

수정 권고:

1. Edge 전체를 한 번에 바꾸지 말고 `Login + License`를 첫 vertical slice로 삼는다.
2. 다음 순서로 교체한다: native control → Components, flex/text/surface → Primitives, 화면 골격 → Edge domain pattern.
3. specialized capture/canvas control은 무리하게 generic component에 넣지 말고 `packages/edge-pages/src/patterns/` 같은 명시적 domain-pattern 위치를 둔다.
4. 각 slice에 component-level Storybook story와 interaction test를 먼저 추가한다.

## F-05. Pages에 raw color 19건이 있고 현재 style 검사가 전부 놓친다

- 심각도: 높음
- 영향: theme/brand/dark-light mode 불일치

production Pages에서 확인된 raw color는 19건이다.

| 파일 | 위치 | 값/역할 |
|---|---:|---|
| `edge-pages/capture/CaptureView.styles.ts` | 186, 199, 324 | white overlay 2종, black shadow |
| `edge-pages/capture/DeflectometryTuningControlsView.styles.ts` | 180, 182 | warning background/border |
| `edge-pages/capture/SetupPanelView.styles.ts` | 58, 59 | active blue border/background |
| `edge-pages/chrome/TitleBarView.styles.ts` | 65, 70 | close danger hover/border |
| `edge-pages/connection/ConnectionTabView.styles.ts` | 135 | success soft background |
| `edge-pages/dataset-select/dataset-grid.styles.ts` | 40 | blue border |
| `edge-pages/dataset-select/dot-menu.styles.ts` | 32 | shadow rgba |
| `edge-pages/images/ImagesView.styles.ts` | 29 | shadow rgba |
| `edge-pages/labeling-panel/RightPanelView.styles.ts` | 59, 60 | active blue background/border |
| `edge-pages/statics/LabelingChartsView.tsx` | 30 | box shadow rgba |
| `edge-pages/workspace/WorkspaceView.styles.ts` | 38 | danger border |
| `platform-pages/catalog/gallery/gallery-export-dialog.styles.ts` | 79 | gradient `#78d6ff` |

`src/patterns/forms/color-editor-popover.tsx`의 HSL spectrum 7개는 color picker 기능 데이터이므로 token 치환 대상이 아니라 명시적 allowlist 대상이다.

현재 [`scripts/check-style-literals.mjs:7`](../../scripts/check-style-literals.mjs)은 `src/components`와 `src/patterns`만 스캔한다. Pages를 전혀 검사하지 않으며, story/test를 제외하지 않아 `&#9650;` 같은 HTML entity를 hex color로 오탐한다. HSL, raw px/rem, numeric primitive prop도 검사하지 않는다.

수정 권고:

1. raw shadow는 shadow token/recipe로, 상태색은 semantic state token으로 치환한다.
2. 검사 범위를 `packages/*/src`까지 확장한다.
3. source-aware AST 검사로 바꾸고 story/test fixture는 별도 정책으로 분리한다.
4. color editor와 사용자 제공 색상처럼 본질적으로 동적인 색만 좁게 allowlist한다.

## F-06. 의미가 다른 token을 값이 비슷하다는 이유로 재사용한다

- 심각도: 높음
- 영향: token 변경 시 비연관 UI 동시 파손

이 문제는 raw literal보다 찾기 어렵다. 토큰을 사용했지만 semantic chain은 우회한 상태다.

확인된 대표 사례:

1. [`packages/platform-pages/src/create-project/CreateProjectView.tsx:44`](../../packages/platform-pages/src/create-project/CreateProjectView.tsx)
   - logo width에 `chartHeights.smPlus` 사용.
2. [`packages/platform-pages/src/catalog/gallery/gallery-images-table.tsx:109`](../../packages/platform-pages/src/catalog/gallery/gallery-images-table.tsx)
   - thumbnail column width에 `--ig-layout-histogram-height` 사용.
3. 같은 파일 line 134
   - `Labeled` text column width에도 `--ig-layout-histogram-height` 사용.
4. 같은 파일 line 113
   - dataset column width에 `--ig-layout-loading-panel-height` 사용.
5. [`packages/platform-pages/src/dashboard/widgets/analysis-timeline-widget.tsx:29`](../../packages/platform-pages/src/dashboard/widgets/analysis-timeline-widget.tsx)
   - font size에 `iconSizeNumbers.xs` 사용.
6. [`packages/platform-pages/src/settings-modal/project/project-member-row.tsx:28`](../../packages/platform-pages/src/settings-modal/project/project-member-row.tsx)
   - button font size에 `iconSizeNumbers.xs` 사용.

또한 popup size token이 card/grid/text max width와 scroll height에 넓게 사용되고, control-height token이 unrelated offset/column width로 사용된다. 이는 숫자 scale을 의미 token처럼 노출한 API가 소비자에게 “비슷한 값 찾기”를 유도한 결과다.

수정 권고:

1. `logoWidth`, `thumbnailSize`, `tableColumnWidth.*`처럼 소비 목적이 있는 semantic token 또는 component prop을 만든다.
2. chart/icon/popup/control token을 다른 속성 의미에 사용하는 것을 금지한다.
3. token category별 허용 CSS property를 문서화하고 정적 검사 가능한 항목부터 규칙화한다.

## F-07. Foundation에 product/domain 의미와 React component가 섞여 있다

- 심각도: 중간
- 영향: Foundation 범용성, package ownership 불명확

[`src/tokens/core/layout.ts:15`](../../src/tokens/core/layout.ts) 이후에는 다음 product feature 이름이 core token으로 들어 있다.

- `captureBar`, `captureGrid`
- `histogramWidth`, `histogramHeight`
- `datasetCardMinHeight`, `datasetCardRecentMinHeight`
- `logTimeMin`, `logDetailLeft/Top/Width`

이 값은 거의 Edge Pages에서만 사용된다. core에 올라와 있기 때문에 Pages의 hardcoded feature dimension이 Foundation 값으로 이동했을 뿐, 재사용 abstraction이 생긴 것은 아니다.

또한 [`src/brand/index.tsx`](../../src/brand/index.tsx)는 asset URL registry와 styled React `BrandMark/BrandLogo`를 한 파일에서 제공하고, 기본 size 40/width 180 같은 raw 숫자를 가진다.

수정 권고:

1. generic layout scale과 Edge feature token extension을 분리한다.
2. product preset은 Foundation registry에 둘 수 있지만, feature geometry는 owning package가 관리하도록 한다.
3. `brandAssets`는 Foundation에 유지하고 `BrandMark/BrandLogo`는 Components로 이동하거나 별도 visual brand entry로 분리한다.

## F-08. Components와 Patterns의 문서 기준, 파일 위치, 코드 주석이 일치하지 않는다

- 심각도: 중간
- 영향: 신규 코드 배치 판단, barrel API 일관성

[`src/components/README.md:15`](../../src/components/README.md)는 page-level shell, multi-pane layout, app-wide navigation structure를 Components에 두지 말라고 한다. [`src/patterns/README.md:5`](../../src/patterns/README.md)는 app shell, toolbar, sidebar shell, split layout을 Patterns로 분류한다.

하지만 다음은 Components에 있다.

- `MobileShell`
- `SidePanelLayout`
- `ResizableColumnsLayout`
- `MobileNavShell`

특히 [`src/components/navigation/mobile-nav-shell.tsx:183`](../../src/components/navigation/mobile-nav-shell.tsx)는 스스로 `SidebarShell`의 mobile counterpart이자 “same pattern”이라고 설명한다. `ResizableColumnsLayout`도 multi-column shell과 persistence behavior를 가진다.

반대로 `FilterBarLayout`은 Components, `FilterBar`는 Patterns에 있고, `form-section.tsx`는 Components 경로지만 exported unit은 `FieldRow/FormField`다. 기능상 공존 가능하더라도 이름만으로 경계를 예측하기 어렵다.

수정 권고:

1. 파일 이동부터 하지 말고 현재 정책을 다시 결정한다.
2. 권장 분류는 shell/navigation composition은 Patterns, atomic resizable behavior는 Components다.
3. `ResizableColumnsLayout`을 Components에 유지한다면 README에 “generic behavioral layout component” 예외를 명시한다.
4. `MobileNavShell/MobileShell/SidePanelLayout`은 Patterns 이동 또는 이름에서 `Shell`을 제거하는 방향 중 하나를 선택한다.

## F-09. Pages 패키지 안에 domain pattern이 있으나 물리적 계층이 표현되지 않는다

- 심각도: 중간
- 영향: Pages와 domain-pattern 경계 추적

domain extraction 계획에 따라 product-specific pattern을 `packages/platform-pages`로 옮긴 결정 자체는 타당하다. universal `src/patterns`에 제품 의미를 넣는 것보다 낫다.

다만 현재 다음 파일은 Pages 패키지 안에 있으면서 `data-ig-layer="patterns"`를 선언한다.

- `catalog/dataset-task-tag.tsx`
- `catalog/dataset-list-item.tsx`
- `catalog/dataset-list-panel.tsx`
- `catalog/gallery/gallery-toolbar.tsx`

이들은 경로만 보면 Page이고 runtime metadata로는 Pattern이다. `packages/platform-pages`가 “page만 담는 package”인지 “platform-owned UI 전체”인지 명확하지 않다.

수정 권고:

1. `packages/platform-pages/src/patterns/{catalog,...}`와 `src/pages/...`를 물리적으로 구분하거나 package README에 domain-pattern 포함 정책을 명시한다.
2. `data-ig-layer`와 폴더 규칙을 같은 vocabulary로 맞춘다.
3. 동일 구조를 Edge에도 적용해 Edge 내부의 재사용 단위를 먼저 domain pattern으로 승격한다.

## F-10. Public barrel이 계층을 숨기고 support API를 중복 노출한다

- 심각도: 중간
- 영향: 의존성 감사 난이도, import 일관성

Pages에는 root `@ingradient/ui` import declaration이 102개 있다.

- Edge: 72개
- Platform: 30개

Edge root imports의 named symbol을 실제 선언으로 해석하면 Components 68개, Foundation 47개, Patterns 8개, Primitives 6개, Support 4개다. import 문만 보고는 어느 계층을 소비하는지 알 수 없다.

또한 [`src/components/index.ts:1`](../../src/components/index.ts)은 `../hooks`를 re-export한다. `useDrawingCanvas` 같은 hook이 `@ingradient/ui/components`에서 import되어 support와 component 경계가 섞인다. package exports에는 `./hooks` entry도 없다.

수정 권고:

1. 내부 package 코드에서는 `@ingradient/ui/components`, `/patterns`, `/primitives`, `/tokens`, `/utils` subpath를 강제한다.
2. `hooks` 전용 subpath export를 추가하고 Components에서 hooks re-export를 단계적으로 제거한다.
3. root barrel은 외부 편의 API로만 유지하고 repository 내부 lint rule로 금지한다.
4. `tokens/recipes` compatibility alias는 제거 예정 version과 usage를 추적한다.

## F-11. Components 내부에서도 기존 same-layer component를 재사용하지 않는 사례가 있다

- 심각도: 중간
- 영향: disabled/focus/hover/a11y 상태 불일치

대표 사례:

| 파일 | 재구현 | 우선 검토할 기존 API |
|---|---|---|
| `components/data-display/comment-thread.tsx` | textarea, send button, layout/text | `TextareaField`, `Button`, `Stack/Inline/Text`, surface recipe |
| `components/feedback/empty-state.tsx` | action button, title/description layout | `Button`, `Text`, `Stack` |
| `components/feedback/selection-action-bar.tsx` | clear/select-all text buttons, layout | `TextButton`, `Inline`, `Text` |
| `components/inputs/filter-bar.tsx` | clear button, flex row | `TextButton`, `Inline` |
| `components/feedback/error-boundary.tsx` | fallback button/title/layout | `Button`, `Heading/Text`, `Stack` |

Component가 반드시 primitive만으로 구현되어야 하는 것은 아니다. 같은 Components 계층의 안정된 component를 조합해도 된다. 현재는 각 파일이 focus/disabled/hover 규칙을 별도로 소유해 variant drift가 생길 가능성이 높다.

수정 권고:

1. public contract와 시각을 유지한 채 내부 구현만 existing component로 바꿀 수 있는지 Storybook visual comparison으로 확인한다.
2. specialized 스타일이 필요하면 새 native button 대신 기존 Button/TextButton variant를 추가한다.

## F-12. 검사 자동화가 현재 계층 정책을 보호하지 못한다

- 심각도: 높음
- 영향: 같은 문제가 재유입됨

실행 결과:

| 검사 | 결과 | 해석 |
|---|---|---|
| `npx tsc --noEmit` | 통과 | 타입/모듈 그래프는 유효하다. |
| `npm run test:unit` | 43 files, 186 tests 통과 | 현재 테스트는 통과하지만 primitives layout/typography 계약은 커버하지 않는다. |
| `npm run lint` | error 0, warning 5 | [`eslint.config.js:14`](../../eslint.config.js)가 `src/**`만 대상으로 하므로 Pages는 lint 보호 밖이다. |
| `npm run check:style-literals` | 실패 | story/test raw fixture와 HTML entity를 잡지만 실제 Pages raw color 19건은 보지 않는다. |
| `npm run check:doc-coverage` | 실패 | 이미 이동/삭제된 Storybook seed 파일 14개를 요구하는 stale 목록이다. |

테스트/스토리 편차:

- Primitives unit test: 0
- Edge Pages unit test: 0
- Edge package-level story: 0
- Platform Pages unit test: 3
- Platform package-level story: 69

수정 권고:

1. guardrail을 고친 후 UI 리팩터링을 시작한다. 그렇지 않으면 수정 완료를 자동으로 증명할 수 없다.
2. ESLint files에 `packages/*/src/**/*.{ts,tsx}`를 포함한다.
3. layer import rule, raw style rule, semantic typography prop rule을 CI에 추가한다.
4. doc coverage 목록은 현재 구조에서 자동 발견한 public export/story mapping으로 생성한다.
5. primitives의 spacing/heading/text 테스트를 최우선으로 추가한다.

## 4. 수정 우선순위와 작업 순서

코드를 바꿀 때는 아래 순서를 권장한다. Pages부터 치환하면 primitives의 현재 오류를 더 넓게 퍼뜨릴 수 있다.

### Phase 0 — 계약 고정과 회귀 테스트

대상:

- `src/primitives/shared.ts`
- `src/primitives/typography/heading.tsx`
- `src/primitives/typography/text.tsx`
- 신규 primitive unit tests

완료 조건:

1. numeric spacing의 의미가 문서/코드/test에서 하나로 일치한다.
2. H1~H4가 실제 h1~h4로 렌더된다.
3. Text 기본 weight가 Foundation token을 사용한다.
4. token alias와 raw value escape hatch가 명확히 분리된다.

### Phase 1 — guardrail 복구

대상:

- `scripts/check-style-literals.mjs`
- `eslint.config.js`
- `scripts/check-doc-coverage.mjs`
- layer boundary 검사 신규 추가

완료 조건:

1. Components, Patterns, 모든 Pages package가 같은 검사를 받는다.
2. story/test fixture와 production violation이 구분된다.
3. raw color 19건과 production numeric gap/weight가 CI에서 탐지된다.
4. 현재 문서/Storybook 구조 기준으로 coverage check가 통과한다.

### Phase 2 — Edge Pages vertical slice

권장 순서:

1. `login` + `license`
2. `dataset-select`
3. `capture/DeflectometryTuningControls`
4. `connection`
5. `chrome`, `images`, `statics`, `labeling`

각 slice 완료 조건:

1. native form control/button을 Components로 치환한다.
2. layout/text/surface를 Primitives로 치환한다.
3. product composition은 Edge domain pattern으로 묶는다.
4. raw color/dimension을 제거한다.
5. package-level story와 interaction/unit test를 추가한다.

### Phase 3 — Platform Pages semantic cleanup

대상:

- 숫자 `Text.weight` 55건
- raw `letterSpacing` 20건
- chart/icon/histogram/popup token 의미 오용
- simple native table/empty-state 중 기존 component로 치환 가능한 항목

복잡한 permission matrix, heatmap, multi-row header table은 generic `Table`에 억지로 맞추지 말고 specialized domain pattern으로 유지한다.

### Phase 4 — 물리적 계층/공개 API 정리

대상:

- Components의 shell/multi-pane 분류
- Platform/Edge domain-pattern 폴더
- `hooks` subpath와 root barrel 정책
- `tokens/recipes` compatibility alias 종료
- Foundation의 product feature token 및 brand visual component 분리

## 5. 파일별 수정 후보 목록

### 즉시 수정 후보

| 우선순위 | 파일 | 수정 목적 |
|---:|---|---|
| 1 | `src/primitives/typography/heading.tsx` | semantic tag off-by-one 수정 + 테스트 |
| 1 | `src/primitives/typography/text.tsx` | default weight token fallback 복구 |
| 1 | `src/primitives/shared.ts` | numeric spacing 계약 명확화 |
| 1 | `scripts/check-style-literals.mjs` | Pages 포함, AST 기반 오탐/누락 제거 |
| 1 | `eslint.config.js` | packages source 검사 포함 |
| 2 | `packages/edge-pages/src/login/*` | lower layer 조합으로 전환 |
| 2 | `packages/edge-pages/src/license/*` | Login과 공통 Edge auth pattern 추출 |
| 2 | `packages/edge-pages/src/capture/DeflectometryTuningControlsView*` | native controls/state UI 제거 |
| 2 | `packages/edge-pages/src/dataset-select/*` | Tag/Chip/Button/Menu 재사용 |
| 2 | `packages/edge-pages/src/connection/ConnectionTabView.styles.ts` | 48개 styled 정의 분해/치환 |
| 3 | `packages/platform-pages/src/catalog/gallery/gallery-images-table.tsx` | semantic token 오용 제거 |
| 3 | `packages/platform-pages/src/settings-modal/**/*.tsx` | Text weight/letter spacing alias 사용 |
| 4 | `src/components/navigation/mobile-nav-shell.tsx` | Patterns 재분류 또는 정책 예외 문서화 |
| 4 | `src/components/data-display/{mobile-shell,side-panel-layout,resizable-columns-layout}.tsx` | shell/layout 경계 재결정 |
| 4 | `src/tokens/core/layout.ts` | generic core와 product feature geometry 분리 |
| 4 | `src/brand/index.tsx` | asset Foundation과 React component 분리 |

### 기존 component 재사용 후보

| 현재 구현 | 기존/권장 재사용 단위 |
|---|---|
| Edge `styled.button` 일반 action | `Button`, `IconButton`, `TextButton` |
| Edge native input/select/checkbox | `TextField`, `SelectField/DropdownSelect`, `Checkbox/Switch` |
| Edge custom spinner/warning/error | `Spinner`, `Alert`, `StateChip/Badge` |
| Edge custom card/panel/text/layout | `Surface/Card`, `Stack/Inline/Grid`, `Text/Heading` |
| Edge dot menu | `ContextMenuWithSubmenus`, `MenuItem`, `IconButton` |
| Edge task/class tag | `Tag`, `Badge`, `ColorChip`, shared domain `DatasetTaskTag` |
| Page custom empty/loading text | `EmptyState`, `Spinner`, state recipes |
| simple page table | `Table` |

## 6. 예외로 유지할 항목

다음은 native 또는 dynamic 값이라는 이유만으로 제거하면 안 된다.

1. canvas/SVG coordinate, bounding box, virtualized row 위치처럼 runtime geometry인 값.
2. 사용자가 선택한 class color처럼 domain data로 전달되는 색.
3. color editor의 HSL spectrum.
4. complex permission matrix, heatmap처럼 generic Table contract가 구조를 손상시키는 UI.
5. Electron titlebar window controls처럼 표준 Button과 interaction contract가 다른 control.

단, 예외는 파일 전체가 아니라 해당 값/element 단위로 좁게 기록해야 한다. 예외 주변의 일반 button/text/layout까지 함께 custom 구현할 근거는 되지 않는다.

## 7. 최종 판단

현재 저장소는 “상위 계층을 아래 계층이 import하는” 전형적인 dependency inversion 문제는 거의 없다. 그러나 다음 세 가지 때문에 원하는 재사용 체인이 완성됐다고 볼 수 없다.

1. Primitives의 spacing/heading/text 계약 자체가 Foundation token 및 문서와 어긋난다.
2. Edge Pages가 Components/Primitives를 통과하지 않고 자체 UI 체계를 크게 유지한다.
3. 검사 도구가 Pages를 보지 않아 이 편차가 자동으로 차단되지 않는다.

가장 안전한 전략은 `Primitives 계약 수정 → guardrail 복구 → Edge vertical slice → Platform semantic cleanup → 물리적 계층/API 정리` 순서다. 이 순서를 지키면 대규모 파일 이동보다 작은 단위로 시각 회귀와 API 파손을 통제할 수 있다.

## 부록 A. 재현에 사용한 검사

```bash
npx tsc --noEmit
npm run lint
npm run test:unit
npm run check:style-literals
npm run check:doc-coverage
```

추가 정적 분석은 TypeScript AST로 production import graph, `styled.*`, native JSX, inline style, raw color, numeric primitive props를 집계했다. generated `lib/`, `node_modules/`, story/test fixture는 production 집계에서 제외했다.
