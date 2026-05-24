# Components Vs Patterns

이 문서는 `@ingradient/ui`에서 `components/`와 `patterns/`를 어디서 나누는지 새 기준으로 설명한다.

핵심은 하나다.

`조합되었다`는 사실만으로 `pattern`이 되지는 않는다.

판단 기준은 `재사용 추상화 레벨`이다.

## Current Policy

1회 audit 이 끝났다. 결과는 [Components Pattern Audit](./components-pattern-audit.md) 에 고정돼 있다.

이제 다음 단계로 넘어간다.

- 명백한 항목은 `src/components/` → `src/patterns/` 로 이동한다
- 옮기는 김에 generic 부분이 있으면 base component 로 따로 뽑는다
- 보류 항목은 새 사용처가 등장할 때 다시 본다

판단 기준 자체는 아래와 동일하다. 정책 본문은 기준 정의로만 둔다.

## Quick Rule

- `component`
  - 일반-purpose UI building block
  - 제품 맥락 없이 다른 화면에서도 바로 재사용 가능
  - 하나의 contract로 설명된다
- `pattern`
  - 여러 component를 묶어 화면 구조나 UX rhythm을 재사용한다
  - 개별 control보다 composition이 핵심이다

## Decision Test

아래 질문으로 먼저 줄인다.

1. 이 단위는 다른 구조 안에 들어가는 generic unit인가?
2. 아니면 다른 component들을 담아 화면 구조를 재사용하는가?

- 1이면 보통 `component`
- 2이면 보통 `pattern`

## Component 기준

다음 성질이 강하면 `component`다.

- 도메인 의미가 약하다
- props contract가 핵심이다
- size, tone, state, variant가 주된 public surface다
- 여러 pattern/page 안에 반복 삽입된다

예:

- `Button`
- `IconButton`
- `Checkbox`
- `EmptyState`
- `DatasetTaskTag`
- `SelectableListItem`
- `ChartLegend` — `{ items: { label, color }[] }` generic contract
- `ChartTooltipContent` — recharts `Tooltip content` slot 용 generic adapter
- `DialogShell` — `{ title, description, children, actions, onClose }` generic dialog
- `ConfirmDialog` — DialogShell + Button 조합이지만 contract 자체는 generic

## Pattern 기준

다음 성질이 강하면 `pattern`이다.

- 여러 component를 묶어 UX 구조를 만든다
- spacing rhythm, slot 관계, pane 구조가 중요하다
- caller가 그 안을 채워 화면을 완성한다
- single control보다 조합 자체가 재사용 가치다

예:

- `PagePrimaryHeader`
- `GalleryToolbar`
- `CatalogShell`
- `DatasetListItem`
- `DatasetListPanel`
- `BarChartCard` / `LineChartCard` / `PieChartCard` — chart card composition
- `ChartContainer` — title + description + legend + frame card shell
- `ImageGrid` / `ImageGridCell` — gallery composition
- `DrawingLayer` / `AnnotationOverlay` — annotation 도메인 composition
- `SettingsDialog` — Sidebar + MainPanel 고정 구조

## Important Clarification

내부적으로 여러 element/component를 썼다고 해서 자동으로 `pattern`으로 올리지 않는다.

예를 들어:

- `EmptyState`
  - title + description + action을 조합하지만 여전히 `component`
  - 이유: generic feedback contract
- `SelectableListItem`
  - styled row + selection state를 조합하지만 여전히 `component`
  - 이유: generic reusable row contract
- `ChartLegend`
  - swatch + label list 를 조합하지만 여전히 `component`
  - 이유: contract 가 `{ items: { label, color }[] }` 로 도메인 의존 없음
- `DatasetListItem`
  - checkbox + name + tag + menu button을 조합한다
  - `pattern`
  - 이유: dataset browsing 맥락의 row composition

## Recommended Split

애매할 때는 generic base와 domain wrapper를 나눈다.

- base reusable unit -> `component`
- screen/domain wrapper -> `pattern`

예:

- `IconButton` -> component
- `DatasetTaskTag` -> component
- `SelectableListItem` -> component
- `DatasetListItem` -> pattern
- `DatasetListPanel` -> pattern

## Classification Workflow

현재 코드를 분류할 때는 아래 순서로 본다.

1. 이름을 본다
2. public props contract를 본다
3. 이 단위가 다른 구조 안에 들어가는지, 아니면 다른 단위를 담는지 본다
4. Storybook에서 단일 state review가 핵심인지, composition review가 핵심인지 본다
5. 그래도 애매하면 당장 이동하지 말고 후보 목록에 남긴다

중요한 점:

- 애매하다고 바로 새 레이어를 만들지 않는다
- 애매하다고 바로 파일을 옮기지 않는다
- 먼저 같은 기준으로 여러 항목을 일관되게 분류해 본다

## What To Do With Borderline Cases

경계가 애매한 항목은 당장 refactor하지 않는다.

먼저 아래처럼 기록한다.

- current location: `components` 또는 `patterns`
- provisional classification: `component` 또는 `pattern`
- why: generic contract인지, composition structure인지
- follow-up: 유지 / 이동 검토 / split 검토

이 과정을 몇 번 반복한 뒤에도 같은 종류의 애매함이 계속 쌓이면, 그때 중간 개념이나 구조 확장을 검토한다.

## Rule Of Thumb

이 질문으로 최종 판단한다.

`이 단위의 가치가 부품인가, 조립 구조인가?`

- 부품이면 `component`
- 조립 구조면 `pattern`
