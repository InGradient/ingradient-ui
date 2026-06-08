# ingradient-ui 설계 시 주의사항

## 1. 계층별 책임을 명확히 나눌 것

현재 구조가 `primitive / components / patterns / pages`라면 각 계층의 역할을 섞지 않아야 한다.

* `primitive`: 가장 작은 기본 UI 요소
* `components`: primitive를 조합한 재사용 UI
* `patterns`: 반복되는 화면 구성이나 사용 흐름
* `pages`: 실제 페이지가 아니라 예제, 템플릿, 검수용 화면

핵심은 **작은 단위는 도메인을 몰라야 하고, 큰 단위로 갈수록 조합만 담당해야 한다**는 점이다.

---

## 2. 의존성 방향을 지킬 것

의존성은 항상 아래 방향으로만 흐르게 해야 한다.

```text
primitive → components → patterns → pages
```

반대로 `primitive`가 `patterns`나 `pages`를 참조하면 안 된다.
하위 계층은 상위 계층의 존재를 몰라야 한다.

---

## 3. primitive에는 비즈니스 로직을 넣지 말 것

`Button`, `Input`, `Dialog`, `Select` 같은 primitive는 어디서든 쓸 수 있어야 한다.

primitive에서 하지 말아야 할 것:

* API 호출
* DB 접근
* global store 접근
* 도메인 타입 의존
* 앱 전용 문구 하드코딩
* 특정 페이지 전용 동작

primitive는 **기능의 의미가 아니라 UI의 형태와 기본 동작만 담당**해야 한다.

---

## 4. components는 데이터 표시와 기본 상호작용까지만 담당할 것

components는 primitive를 조합해서 조금 더 큰 UI를 만든다.

예:

* SearchInput
* DataTable
* EmptyState
* Pagination
* FileDropzone
* FilterChip

주의할 점은 components가 직접 데이터를 가져오거나 저장하면 안 된다는 것이다.
데이터는 props로 받고, 변경은 event callback으로 밖에 알려야 한다.

---

## 5. patterns는 반복되는 UI 흐름만 담당할 것

patterns는 여러 components를 묶어 자주 쓰는 화면 흐름을 제공한다.

예:

* FilterBar
* SortPanel
* UploadPanel
* PageHeader
* AnnotationToolbar
* DatasetSelector

patterns는 UI 흐름을 담당할 수 있지만, 실제 저장, API 호출, 서비스 정책 판단은 외부에서 처리해야 한다.

---

## 6. pages는 실제 서비스 로직이 아니라 예제여야 한다

UI library 안의 `pages`는 실제 제품 페이지가 아니라 다음 목적이어야 한다.

* 컴포넌트 조합 예시
* Storybook 검수용 화면
* 화면 템플릿
* 상태별 샘플 페이지

실제 API 호출, 인증, DB 연결, 제품 정책은 pages 안에 넣지 않는 것이 좋다.
가능하면 `pages`보다 `templates` 또는 `examples`라는 이름이 더 명확할 수 있다.

---

## 7. API, DB, global store에 직접 의존하지 말 것

UI framework library는 앱의 내부 상태나 서버 구조에 묶이면 안 된다.

피해야 할 것:

* Zustand/Redux store 직접 사용
* API endpoint 직접 호출
* DB model 직접 import
* 앱 전용 SDK 직접 의존

좋은 방식은 필요한 값은 props로 받고, 사용자의 행동은 callback으로 전달하는 것이다.

---

## 8. 디자인 토큰을 기준으로 스타일을 관리할 것

색상, spacing, radius, font size 같은 값은 직접 쓰지 말고 token을 기준으로 관리해야 한다.

피해야 할 방식:

```text
#333
13px
7px
```

권장 방식:

```text
color.foreground
spacing.3
radius.md
font.size.sm
```

디자인 값이 여러 곳에 흩어지면 UI 일관성이 깨지기 쉽다.

---

## 9. props 이름과 variant 체계를 일관되게 유지할 것

컴포넌트마다 props 이름이 다르면 사용하는 사람이 헷갈린다.

공통적으로 맞춰야 할 이름:

* variant
* size
* disabled
* loading
* error
* value
* defaultValue
* onChange
* className
* children

예를 들어 Button은 `typeStyle`, Input은 `inputSize`처럼 제각각 이름을 쓰지 않는 것이 좋다.

---

## 10. 접근성을 기본 규칙으로 포함할 것

UI library는 접근성을 나중에 추가하기 어렵다.
처음부터 기본 규칙에 포함해야 한다.

확인해야 할 항목:

* 키보드 조작
* focus 상태
* disabled 상태
* loading 상태
* error 상태
* aria-label
* role
* screen reader 대응

특히 Dialog, Select, Dropdown, Tabs, Checkbox, Tooltip 같은 컴포넌트는 접근성이 중요하다.

---

## 11. Storybook으로 상태를 문서화할 것

UI framework library는 Storybook을 기준 문서처럼 사용해야 한다.

각 컴포넌트는 최소한 다음 상태를 보여줘야 한다.

* default
* hover
* disabled
* loading
* error
* empty
* long text
* responsive
* dark mode

Storybook은 단순 예제가 아니라 디자인 검수와 회귀 확인 기준이 되어야 한다.

---

## 핵심 정리

ingradient-ui에서 가장 주의해야 할 점은 다음과 같다.

* 계층별 책임을 섞지 않는다.
* 의존성은 `primitive → components → patterns → pages` 방향으로만 흐르게 한다.
* UI library 안에서 API, DB, global store에 직접 의존하지 않는다.
* primitive는 도메인을 몰라야 한다.
* components와 patterns는 데이터를 직접 처리하지 않고 props와 callback으로 연결한다.
* 디자인 값은 token으로 관리한다.
* props 이름과 variant 규칙을 일관되게 유지한다.
* 접근성과 Storybook 문서화를 기본 규칙으로 포함한다.

결국 ingradient-ui는 실제 화면 로직을 담는 곳이 아니라, 여러 화면이 일관된 방식으로 만들어지도록 UI 부품과 규칙을 제공하는 곳이어야 한다.

---

## 문서 기반 작업 원칙

UI 작업은 문서 없이 바로 구현에 들어가면 아래가 자주 빠진다.

* 현재 컴포넌트 계층과 책임 경계
* 실제 사용자 동선
* 재사용 범위와 비재사용 범위
* 디자인 시스템 계약
* 상태별 화면 정의
* 반응형 / 접근성 / Storybook 검증 기준

그래서 권장 순서는 아래다.

1. 메인 기획 문서를 먼저 작성한다.
2. 그 다음 phase 문서를 단계별로 작성한다.
3. 문서가 고정된 뒤에 구현한다.
4. 구현 후 문서 대비 누락과 규칙 위반이 남아 있는지 self-review 한다.

즉, `보고 -> 구현`보다 `기획 문서 -> phase 문서 -> 구현` 순서가 더 안전하다.

---

## 메인 기획 문서에 반드시 들어가야 하는 것

UI 메인 기획 문서는 최소한 아래를 포함해야 한다.

1. 목적
2. 현재 문제
3. 현재 화면 구조와 계층
4. 변경 목표 구조
5. 유지해야 하는 UX 계약
6. 유지해야 하는 디자인 시스템 계약
7. 비목표
8. 구현 순서
9. 공통 acceptance criteria
10. 공통 테스트 기준
11. 남은 리스크 / 오픈 포인트

좋은 메인 기획 문서는 구현자가 추가 결정을 하지 않아도 되도록 `decision complete` 해야 한다.

---

## Phase 문서에 반드시 들어가야 하는 것

UI phase 문서는 최소한 아래를 포함해야 한다.

1. 이 단계의 목표
2. 이 단계에서 해결할 현재 문제
3. 수정 대상 책임 경계
4. 유지해야 하는 UX / 디자인 계약
5. 이 단계에서 하지 않을 것
6. 구현 순서
7. 완료 조건
8. 테스트 항목
9. Storybook 또는 예제 화면 검증 항목
10. 다음 phase 로 넘기는 전제
11. 남은 리스크

좋은 phase 문서는 그 문서만 보고도 바로 구현할 수 있어야 한다.

---

## 구현 요청 템플릿

### 1. 메인 기획 문서 요청 템플릿

```md
이 작업은 바로 구현하지 말고, 먼저 UI 메인 기획 문서부터 작성해줘.

목표:
- [무엇을 바꾸려는지]
- [왜 바꾸려는지]

중요 규칙:
- ui-refactoring-rule.md 기준을 반드시 따른다.
- 기존 UX, 디자인 시스템 계약, props 계약은 함부로 바꾸지 않는다.
- 애매한 내용은 추정하지 말고, 현재 코드 기준으로 확인한 사실과 필요한 결정을 분리한다.

문서 작성 요구사항:
- 메인 기획 문서 1개를 작성한다.
- 문서에는 반드시 아래 내용을 포함한다.
  1. 목적
  2. 현재 문제
  3. 현재 화면 구조와 계층
  4. 변경 목표 구조
  5. 유지해야 하는 UX 계약
  6. 유지해야 하는 디자인 시스템 계약
  7. 비목표
  8. 구현 순서
  9. 공통 acceptance criteria
  10. 공통 테스트 기준
  11. 남은 리스크 / 오픈 포인트

추가 지시:
- 문서는 구현 가능한 수준으로 decision complete 하게 작성한다.
- 문서 기준으로 phase 를 어떻게 나눌지도 같이 제안한다.
- 문서 작성 후, 현재 코드와 문서 사이의 불일치가 있다면 문서 안에 명시한다.
```

### 2. Phase 문서 요청 템플릿

```md
이제 메인 기획 문서를 기준으로 UI Phase 문서를 작성해줘.

대상 phase:
- [Phase 1 이름]

문서 작성 요구사항:
- 이 phase 전용 문서 1개를 작성한다.
- 문서에는 반드시 아래 내용을 포함한다.
  1. 이 단계의 목표
  2. 이 단계에서 해결할 현재 문제
  3. 수정 대상 책임 경계
  4. 유지해야 하는 UX / 디자인 계약
  5. 이 단계에서 하지 않을 것
  6. 구현 순서
  7. 완료 조건
  8. 테스트 항목
  9. Storybook 또는 예제 화면 검증 항목
  10. 다음 phase 로 넘기는 전제
  11. 남은 리스크

중요:
- 이 phase 만 보고도 바로 구현할 수 있게 작성한다.
- 구현자가 추가 결정을 하지 않아도 되도록 decision complete 하게 작성한다.
- 파일 나열보다 책임 단위 / 화면 동작 단위로 설명한다.
- 현재 코드와 안 맞는 점이 있으면 문서에 먼저 드러낸다.
```

### 3. 구현 시작 전 요청 템플릿

```md
아직 구현하지 말고, 아래 순서로 진행해줘.

1. UI 메인 기획 문서 작성
2. Phase 1 문서 작성
3. 내가 확인하면 다음 phase 문서 작성
4. 모든 phase 문서가 고정되면 그때 구현 시작

중요:
- 문서 작성 단계에서는 현재 코드와의 gap 을 반드시 반영한다.
- 각 문서는 acceptance criteria 와 테스트 기준이 있어야 한다.
- ui-refactoring-rule.md 위반 가능성이 남는 구조는 문서에서 먼저 지적한다.
```

### 4. 구현 요청 템플릿

```md
이제 문서가 고정됐으니 구현해줘.

구현 범위:
- [Phase 1 문서 링크 또는 이름]

구현 규칙:
- 메인 문서와 phase 문서 기준만 따른다.
- 범위를 넘는 수정은 하지 않는다.
- UX 계약, 디자인 시스템 계약, props 계약은 문서에 명시된 경우만 변경한다.
- 구현 후에는 반드시 self-review 를 해서 문서 대비 누락과 규칙 위반 잔여 여부를 점검한다.

최종 보고 형식:
- 반영된 것
- 문서 대비 아직 안 된 것
- 남은 리스크
- 실행한 테스트
```

---

## 특화된 요청 템플릿

### 1. 컴포넌트 계층 리팩터용

```md
이 작업은 UI 컴포넌트 계층 리팩터다. 바로 구현하지 말고 먼저 문서부터 작성해줘.

특히 아래를 반드시 문서에 포함해줘.

- 현재 `primitive / components / patterns / pages` 역할 구분
- 어떤 계층이 어떤 책임을 침범하고 있는지
- 의존성 방향 위반이 있는지
- 어떤 컴포넌트를 어느 계층으로 내려야/올려야 하는지
- 유지해야 하는 props 계약

중요:
- 하위 계층은 상위 계층을 몰라야 한다.
- primitive 에 도메인 로직, store, API 호출을 넣지 않는다.
- 공통화는 같은 이유로 함께 바뀌는 컴포넌트만 한다.
```

### 2. 화면 / 훅 / 상태 리팩터용

```md
이 작업은 UI 화면 로직 / hook / 상태 리팩터다. 바로 구현하지 말고 먼저 문서부터 작성해줘.

특히 아래를 반드시 문서에 포함해줘.

- 현재 hook 이 맡고 있는 책임 목록
- 서버 상태 / UI 상태 / 편집 중 임시 상태의 경계
- 사용자 동선
- 어떤 effect / hook 을 어떤 기준으로 분리할지
- 테스트해야 하는 interaction

중요:
- 한 effect 가 polling + logging + 저장 + 탭 전환을 동시에 하지 않게 한다.
- UI wiring 과 data shaping 을 분리한다.
- 상태 shape 변경이 있으면 외부 영향 범위를 먼저 문서화한다.
```

### 3. 디자인 시스템 정리용

```md
이 작업은 디자인 시스템 정리다. 바로 구현하지 말고 먼저 문서부터 작성해줘.

특히 아래를 반드시 문서에 포함해줘.

- 현재 token 체계
- 직접 하드코딩된 디자인 값이 어디에 있는지
- variant / size / state naming 규칙
- 공통 스타일 기준과 예외 기준
- 유지해야 하는 시각적 계약

중요:
- 색상, spacing, radius, font 값은 token 기준으로 정리한다.
- naming 규칙은 컴포넌트 전반에서 일관되게 맞춘다.
- 비슷해 보여도 변경 이유가 다르면 섣불리 공통화하지 않는다.
```

### 4. 접근성 / 문서화 보강용

```md
이 작업은 접근성과 문서화 보강이다. 바로 구현하지 말고 먼저 문서부터 작성해줘.

특히 아래를 반드시 문서에 포함해줘.

- 어떤 컴포넌트가 접근성 위험이 큰지
- 키보드 조작 / focus / aria / role 기준
- Storybook 에 어떤 상태를 반드시 보여줘야 하는지
- 회귀 확인에 어떤 story 를 사용할지

중요:
- 접근성은 부가 기능이 아니라 기본 계약으로 본다.
- Storybook 은 예제가 아니라 검수 기준으로 설계한다.
- default / hover / disabled / loading / error / empty / responsive 상태를 문서화한다.
```

### 5. UI 성능 최적화용

```md
이 작업은 UI 성능 최적화다. 바로 구현하지 말고 먼저 문서부터 작성해줘.

특히 아래를 반드시 문서에 포함해줘.

- 현재 병목 지점
- 측정 기준
- 렌더링 병목 / 네트워크 병목 / 상태 병목 구분
- 유지해야 하는 UX 품질 기준
- 최적화 후 검증 방법

중요:
- 추정만으로 최적화하지 말고 현재 코드 기준 병목을 먼저 명시한다.
- 성능 최적화 때문에 UX 계약이나 접근성이 깨지지 않게 한다.
- 공통화나 memoization 도 변경 이유가 분명한 경우에만 적용한다.
```

---

## UI 규칙 검토 방법

UI 코드의 규칙 위반을 grep 만으로 잡으면 패턴마다 query 가 한정적이어서 매번 새 잔여가 발견된다.
실제로 잔여를 모두 잡으려면 아래 3가지 방법을 조합하는 것이 안전하다.

### 1. Lint — 자동화 가능한 영역

본 문서 11개 규칙 중 lint 로 catch 가능한 영역은 평균 70%. 한 번 설정해두면 이후 작업에서 자동 차단.

**규칙별 lint 커버리지**:

| 규칙 | 도구 | 커버리지 |
|---|---|---|
| 2. 의존성 방향 (primitive → components → patterns → pages) | `eslint-plugin-import/no-restricted-paths` | 100% |
| 3. primitive 도메인 / store / API 미사용 | `no-restricted-imports` + custom rule | 100% |
| 7. API/DB/global store 직접 의존 금지 | `no-restricted-imports` | 100% |
| 8. 디자인 토큰 강제 (raw px / hex / rgba) | stylelint + AST custom rule | 100% |
| 9. props 이름 일관성 (`typeStyle/inputSize` 등 차단) | `no-restricted-syntax` | 100% (사전 명시) |
| 10. 접근성 (aria/role/alt 누락) | `eslint-plugin-jsx-a11y` | 70% |
| 11. Storybook 상태 문서화 | Chromatic visual regression | 10% (수동 QA) |

**ESLint config 추가 예시** (`eslint.config.mjs`):

```js
import importPlugin from 'eslint-plugin-import'
import a11y from 'eslint-plugin-jsx-a11y'

export default [
  // ... 기존 config

  // 의존성 방향 강제 (UI 계층)
  {
    files: ['src/primitives/**/*.{ts,tsx}'],
    rules: {
      'import/no-restricted-paths': ['error', {
        zones: [
          { target: 'src/primitives', from: 'src/components', message: 'primitive → components 역방향 import 금지' },
          { target: 'src/primitives', from: 'src/patterns', message: 'primitive → patterns 역방향 import 금지' },
          { target: 'src/components', from: 'src/patterns', message: 'components → patterns 역방향 import 금지' },
        ],
      }],
    },
  },

  // UI library 안 API/DB/store 직접 의존 금지
  {
    files: ['src/primitives/**', 'src/components/**', 'src/patterns/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['axios', '@reduxjs/*', 'zustand', '*api/*', '*sdk/*'], message: 'UI library 안에서 API/store/SDK 직접 import 금지' },
        ],
      }],
    },
  },

  // 비표준 props 이름 차단 (typeStyle/inputSize/btnType 같은 비일관)
  {
    files: ['src/**/*.tsx'],
    rules: {
      'no-restricted-syntax': ['error', {
        selector: 'TSPropertySignature[key.name=/^(typeStyle|inputSize|btnType|btnSize|btnVariant)$/]',
        message: '비표준 props 이름. variant/size/disabled 같은 공통 이름 사용',
      }],
    },
  },

  // 접근성 (jsx-a11y)
  {
    files: ['src/**/*.tsx'],
    plugins: { 'jsx-a11y': a11y },
    rules: {
      ...a11y.configs.recommended.rules,
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
    },
  },
]
```

**Stylelint 설정** (styled-components 안 CSS 토큰 강제 — 규칙 8):

```bash
npm install -D stylelint stylelint-config-standard postcss-styled-syntax
```

```json
// .stylelintrc.json
{
  "customSyntax": "postcss-styled-syntax",
  "extends": ["stylelint-config-standard"],
  "rules": {
    "declaration-property-value-allowed-list": {
      "/^(width|height|padding|margin|gap|font-size|border-radius|color|background)$/": [
        "/^var\\(--ig-/",
        "0",
        "auto",
        "/^[0-9]+%$/",
        "currentColor",
        "transparent"
      ]
    },
    "color-no-hex": [true, { "ignore": ["named"] }]
  }
}
```

**실행**:

```bash
# 전체 점검
npx eslint 'src/**/*.{ts,tsx}'
npx stylelint 'src/**/*.{ts,tsx}'

# 자동 수정 가능한 것
npx eslint 'src/**/*.{ts,tsx}' --fix
```

**한계 — lint 만으로 못 잡는 30%**:
- 의미적 판단 ("이 component 가 도메인을 너무 알고 있나?", "primitive 라기엔 너무 크지 않나?")
- 시각 / UX 검증 (focus visible, hover state, dark mode 일관성)
- Runtime 동작 (keyboard nav flow, screen reader 경험)
- Storybook 상태 coverage (default/hover/disabled/loading/error/empty/long text/responsive)

### 2. Explore agent 병렬 — UI 디렉터리 단위 파일 read

lint 가 못 잡는 의미적 판단 / 시각 패턴 미스 영역. Claude Code 의 Explore agent 가 사람보다 빠르고 일관성 있게 파일을 read 한다.

**Claude Code 에 그대로 던질 수 있는 명령어 예시**:

```md
src/ 안 4개 UI 디렉터리를 4 Explore agent 로 병렬 검토해줘.

각 agent 가 자기 디렉터리 안 모든 .tsx/.ts 파일을 직접 read (grep 아닌 Read) 하면서,
ui-refactoring-rule.md 의 11 규칙 위반을 찾아줘.

특히 다음 패턴은 grep 로 놓치기 쉬우니 사람처럼 읽으면서 찾기:
- styled-components template literal 안 ${(p) => `${p.$w}px`} 같은 dynamic interpolation
- function default param ({ size = 280 }) => ... 같은 default
- .attrs({ width: 280 }) 같은 attrs
- 큰 styled object 안 한 줄 raw
- "이 컴포넌트가 도메인 token (image-card-*, sync-chip-* 등) 사용 중인지"
- "Dialog 가 role/aria 가지는지", "키보드 nav 처리되는지"

agent 분담:
- Agent 1: src/primitives/
- Agent 2: src/components/data-display/ + src/components/inputs/
- Agent 3: src/components/overlays/ + src/components/feedback/
- Agent 4: src/patterns/

각 agent 결과:
- 파일 path + line
- 위반 규칙 번호
- 위반 강도 (default prop 같은 강 / inline 같은 약)
- 권장 처리 (token 매핑 / 분할 / aria 추가 / 의도 raw)

받은 후 본인이 종합.
```

**ROI 비교**:

| 방법 | 정확도 | 시간 | 비용 |
|---|---|---|---|
| grep | 80% | 빠름 | 낮음 (반복 시 비효율) |
| Explore agent 병렬 | 95% | 중간 | 중간 |
| 사람 직접 file-by-file | 99% | 매우 느림 | 매우 높음 |

### 3. Storybook 시각 검증 — 규칙 10/11 의 핵심

lint 가 catch 못하는 UX / 시각 영역은 Storybook 기반 visual / a11y 검증이 필요.

**필수 도구**:
- **Chromatic** — Storybook 상태별 시각 회귀 (각 story 의 스크린샷 자동 비교). default/hover/disabled/dark mode 변경 감지.
- **`@storybook/addon-a11y`** — Storybook 안에서 runtime axe-core 실행. aria/contrast/keyboard 위반 표시.
- **`@storybook/test-runner` + Playwright** — Storybook 의 모든 story 가 렌더링 시 a11y violation 없는지 CI 에서 자동 검증.

**`.storybook/preview.tsx` 설정**:

```ts
import { withA11y } from '@storybook/addon-a11y'

export const decorators = [withA11y]

export const parameters = {
  a11y: {
    config: {
      rules: [
        { id: 'color-contrast', enabled: true },
        { id: 'aria-required-attr', enabled: true },
      ],
    },
  },
}
```

**규칙 11 강제 — story coverage 자동 검증**:

```bash
# 모든 component 가 default/disabled/loading story 가지고 있는지 CI 검증
npx storybook test-runner --coverage
```

**Storybook 검수 체크리스트** (각 컴포넌트):
- [ ] default
- [ ] hover
- [ ] focus-visible
- [ ] disabled
- [ ] loading
- [ ] error
- [ ] empty
- [ ] long text overflow
- [ ] responsive (mobile / tablet / desktop)
- [ ] dark mode + light mode 양쪽

### 4. UI 검토 Hybrid 워크플로우

다음 순서로 진행하면 한 번에 95%+ catch:

```md
[1] PR 시작 시점
   - ESLint + Stylelint + jsx-a11y CI 통과 강제 → 자동 catch 80%

[2] 신규 컴포넌트 추가 / 큰 refactor 직후
   - Explore agent 4개 병렬 (primitives/components-A/components-B/patterns) → 의미 패턴 +10%
   - 발견된 패턴은 ESLint custom rule 로 추가 → 다음부터 자동

[3] 릴리즈 직전
   - Chromatic visual diff 검토 → 시각 회귀
   - Storybook a11y addon 결과 review → runtime 접근성
   - Storybook 안 모든 컴포넌트 키보드 nav 직접 테스트 → 키보드/focus

[4] 발견 → 처리 → ESLint rule 추가
   - 한 번 catch 된 패턴은 다음에 자동 차단되도록 rule 추가
   - 점진적으로 grep / 사람 의존 줄임
```

핵심: **자동화 가능한 패턴은 발견할 때마다 rule 로 추가**. 그래야 같은 잔여가 다음 sprint 에서 또 발견되지 않는다.

---

## 추천 운영 방식

가장 안전한 운영 방식은 아래다.

1. 메인 문서 1개 작성
2. Phase 문서 1개씩 순차 작성
3. 각 phase 문서 확인 후 구현
4. 구현 후 self-review
5. Storybook / 예제 화면 / 회귀 검증

즉, 좋은 요청은 `이 문서를 구현해줘`가 아니라 아래에 가깝다.

* UI 메인 문서를 먼저 작성해줘.
* phase 문서를 단계별로 작성해줘.
* 문서가 고정되면 그 문서 기준으로만 구현해줘.
* 구현 후 문서 대비 누락과 규칙 위반이 남았는지 다시 점검해줘.
