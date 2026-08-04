# ingradient-ui 설계 시 주의사항

## 현재 package 모델

```text
@ingradient/ui tokens → primitives → components → patterns
  → @ingradient/platform-pages / @ingradient/edge-pages
  → consumer application router, services, and state
```

- 범용 visual contract는 `@ingradient/ui`에 둔다.
- 제품 용어와 domain composition을 알지만 props/callback으로 제어되는 view는 해당 page package에 둔다.
- API, router, global store, permission, persistence는 소비 앱에 둔다.
- `stories/pages/**`는 page package를 fixture/runtime으로 실행하고 검증하는 문서 surface다.

## 0. 작업 위치 우선순위

새 기능을 추가하거나 기존 기능을 수정할 때는 다음 우선순위로 위치를 결정한다.

1. **Primitive 나 Components 를 최우선 순위로 수정**
2. **Primitive 나 Components 에 없으면 새롭게 추가하는 것도 고려**
3. **그래도 없고 generic composition이면 Patterns에 생성**
4. **제품 의미를 가진 controlled composition이면 Platform/Edge Pages package에 생성**

낮은 계층 (primitive, components) 일수록 재사용성이 높고 영향 범위가 넓으므로, 가능한 한 그 계층에서 해결한다. 상위 계층 (patterns, page packages) 에 새 컴포넌트를 만들기 전에 하위 계층에서 처리할 수 있는지 먼저 검토한다.

---

## 1. 계층별 책임을 명확히 나눌 것

현재 구조인 `tokens / primitives / components / patterns / page packages / consumer apps`에서 각 계층의 역할을 섞지 않아야 한다.

* `primitive`: 가장 작은 기본 UI 요소
* `components`: primitive를 조합한 재사용 UI
* `patterns`: 반복되는 화면 구성이나 사용 흐름
* `page packages`: 제품 의미를 가진 controlled view와 domain composition
* `stories/pages`: fixture, runtime, 검수, 문서화 surface

핵심은 **작은 단위는 도메인을 몰라야 하고, 큰 단위로 갈수록 조합만 담당해야 한다**는 점이다.

---

## 2. 의존성 방향을 지킬 것

의존성은 항상 아래 방향으로만 흐르게 해야 한다.

```text
tokens → primitives → components → patterns → page packages → consumer apps
```

반대로 `primitive`가 `patterns`나 page packages를 참조하면 안 된다.
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

## 6. page package와 Storybook page의 책임을 분리할 것

`@ingradient/platform-pages`와 `@ingradient/edge-pages`는 실제 제품 의미를 가진 view composition을 소유할 수 있다.

- package view는 controlled props와 callback만 받는다.
- 제품 row, dialog, shell, responsive composition은 page package에 둘 수 있다.
- API 호출, router, global store, permission 판정은 넣지 않는다.

`stories/pages/**`는 package-owned view를 다시 구현하지 않는다. fixture와 deterministic runtime을 통해 상태를 공급하고 Controls, Actions, Interactions, accessibility, probe, visual review를 문서화한다.

---

## 7. API, DB, global store에 직접 의존하지 말 것

UI package와 page package는 앱의 내부 상태나 서버 구조에 묶이면 안 된다.

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

Platform operational stories는 추가로 다음 계약을 함께 유지한다.

* purpose-grouped story structure
* scoped Controls
* explicit Action callbacks
* named interaction workflows
* blocking accessibility
* static production probe
* canonical visual ID와 migration mapping

---

## 핵심 정리

ingradient-ui에서 가장 주의해야 할 점은 다음과 같다.

* 계층별 책임을 섞지 않는다.
* 의존성은 `tokens → primitives → components → patterns → page packages → consumer apps` 방향으로만 흐르게 한다.
* UI library 안에서 API, DB, global store에 직접 의존하지 않는다.
* primitive는 도메인을 몰라야 한다.
* components, patterns, page views는 데이터를 직접 가져오지 않고 props와 callback으로 연결한다.
* 디자인 값은 token으로 관리한다.
* props 이름과 variant 규칙을 일관되게 유지한다.
* 접근성과 Storybook 문서화를 기본 규칙으로 포함한다.

결국 ingradient-ui는 범용 UI 부품과 규칙, 그리고 service/state에서 분리된 controlled product view를 제공한다. 실제 router, API, permission, persistence 로직은 소비 앱에 남아야 한다.

---

---

## Related guides

- [UI 작업 문서와 요청 템플릿](./docs/guides/ui-workflow.md)
- [UI 규칙 검토 가이드](./docs/guides/ui-audit.md)
