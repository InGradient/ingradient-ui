# UI 작업 문서와 요청 템플릿

UI 변경을 계획하고 phase별 구현 범위를 고정하는 절차다. 핵심 layer/package 규칙은 [`ui-refactoring-rule.md`](../../ui-refactoring-rule.md)를 따른다.

## 언제 문서가 필요한가

다음 중 하나에 해당하면 구현 전에 main plan 또는 phase 문서를 작성한다.

- package/layer ownership이 바뀐다.
- public props, story ID, fixture, probe, visual target가 함께 이동한다.
- 여러 화면이나 제품 영역에 영향을 준다.
- 디자인/접근성 의사결정이 아직 열려 있다.
- 다음 세션이나 다른 작업자가 이어서 수행해야 한다.

작고 국소적인 수정은 짧은 계획과 검증 목록이면 충분하다. 문서 자체가 구현보다 커지지 않도록 범위에 맞춘다.

## 권장 순서

1. 현재 코드와 문서를 읽고 검증된 사실을 기록한다.
2. 결정이 필요한 사항을 사실과 분리한다.
3. main plan에서 전체 boundary와 acceptance criteria를 고정한다.
4. 독립 검증 가능한 단위로 phase를 나눈다.
5. 승인된 phase만 구현한다.
6. 구현 후 문서, public exports, Storybook, probes를 함께 갱신한다.
7. 실행한 검증과 남은 리스크를 기록한다.

## Main plan 필수 항목

1. 목적과 현재 문제
2. 검증된 현재 구조
3. 목표 ownership/layer 구조
4. 유지해야 할 UX, visual, accessibility, props 계약
5. 비목표
6. 구현 순서와 phase 경계
7. 공통 acceptance criteria
8. 검증 방법
9. migration/downstream 영향
10. 열린 결정과 리스크

## Phase 문서 필수 항목

1. 이 phase의 목표
2. 수정할 책임 경계와 파일 영역
3. 유지할 계약
4. 하지 않을 것
5. 구현 순서
6. 완료 조건
7. unit/Storybook/probe/visual 검증
8. 다음 phase 전제와 남은 리스크

파일 목록만 나열하지 말고 동작, ownership, contract 단위로 설명한다.

## Main plan 요청 템플릿

```md
바로 구현하지 말고 먼저 main plan을 작성해줘.

목표:
- [무엇을 왜 바꾸는지]

반드시 포함:
- 검증된 현재 구조와 문제
- 목표 package/layer ownership
- 유지할 UX/visual/a11y/public props 계약
- 비목표와 migration 영향
- phase 구분, acceptance criteria, 검증 방법
- 열린 결정과 리스크

추정과 검증된 사실을 구분하고, 구현자가 추가 결정을 하지 않아도 될 수준으로 작성해줘.
```

## Phase 구현 요청 템플릿

```md
승인된 main plan의 [Phase 이름]만 구현해줘.

규칙:
- phase 범위를 넘지 않는다.
- 문서에 없는 UX/visual/public API 변경은 먼저 질문한다.
- package view는 API/router/store/persistence를 소유하지 않는다.
- story ID 변경은 Controls, Actions, workflows, probes, visual targets, 문서를 함께 이동한다.

완료 보고:
- 반영한 계약
- 실행한 검증과 결과
- 문서 대비 미완료 항목
- 남은 리스크
```

## 작업 유형별 추가 확인

### Layer refactor

- dependency 방향과 public barrel
- generic component/pattern과 product page composition의 경계
- consumer import migration
- story/fixture가 production package로 역류하지 않는지

### 화면·상태 refactor

- server state, UI state, draft state의 구분
- controlled value/callback과 effect 책임
- loading, error, empty, permission, responsive 상태
- callback payload와 interaction test

### Design system

- token/recipe/variant 우선순위
- hardcoded value와 새 token 필요 여부
- focus/hover/disabled/loading state precedence
- icon glyph/container, typography, spacing, border, shadow

### Accessibility·documentation

- keyboard, focus, role, name, description, landmark
- default/error/empty/long-content/responsive Storybook 상태
- named workflow와 blocking accessibility
- canonical review ID와 visual baseline 정책
