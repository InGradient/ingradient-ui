# Components Vs Patterns

이 문서는 `@ingradient/ui`에서 `components/`와 `patterns/`를 어디서 나누는지 설명한다.

가장 중요한 원칙은 이것이다.

`조합되었다`는 사실만으로 `pattern`이 되지는 않는다.

판단 기준은 `재사용 추상화 레벨`이다.

## Quick Rule

- `component`
  - 일반-purpose UI building block
  - 제품 맥락 없이 다른 화면에서도 바로 재사용 가능
  - 책임이 한 덩어리로 설명된다
- `pattern`
  - 여러 component를 묶어 화면 구조나 UX 흐름을 재사용한다
  - list shell, page shell, toolbar composition 같은 조립 레벨이다
  - caller가 “이 패턴 안에 어떤 component를 채울지”를 생각하게 만든다

## Decision Test

아래 질문을 순서대로 본다.

1. 이 UI를 제품 맥락 없이 다른 화면에 바로 가져다 쓸 수 있는가?
2. 책임을 한 문장으로 설명할 때 `button`, `field`, `list row`, `table`, `tag`, `empty state` 같은 일반 UI 단위인가?
3. 이 UI의 주된 가치가 `개별 control/display contract`인가, 아니면 `화면 구조와 composition rhythm`인가?
4. consumer가 이 UI를 쓸 때 내부에 다른 component를 채우거나 조합해 화면 뼈대를 완성하는가?

대체로:

- 1, 2가 `예`이면 `component`
- 3, 4가 `예`이면 `pattern`

## What Usually Goes In Components

- button, icon button, checkbox, switch, radio
- empty state, alert, badge, avatar, tooltip
- tabs, breadcrumbs, pagination
- table, image grid, stat card, tag
- generic selectable row, generic overlay, generic viewer shell

공통점:

- 도메인 의미가 약하다
- props contract가 핵심이다
- 다른 조합 안에 들어가는 “부품” 역할이다

## What Usually Goes In Patterns

- app shell, page header, split layout, sidebar shell
- filter toolbar, dashboard grid, settings section
- gallery/detail shell, list-detail shell
- dataset list panel, image inspector sidebar 같은 화면 조립 단위

공통점:

- component 여러 개를 묶어서 UX 구조를 만든다
- spacing rhythm, layout slots, pane 관계가 핵심이다
- 개별 control보다 “어떻게 조합되는가”가 더 중요하다

## Important Clarification

`내부적으로 여러 element/component를 썼다`는 이유만으로 `pattern`으로 올리지 않는다.

예를 들어:

- `EmptyState`
  - title + description + action button을 조합하지만 여전히 `component`
  - 이유: generic feedback block이고 contract가 명확하다
- `SelectableListItem`
  - styled button wrapper + selected/dragOver state를 조합하지만 여전히 `component`
  - 이유: generic selectable row primitive에 가까운 reusable block이다
- `DatasetListItem`
  - checkbox + name + task tag + menu button을 묶는다
  - `pattern`
  - 이유: dataset browsing 맥락의 row composition이다

즉:

- `generic composite`는 `component`일 수 있다
- `screen-specific composition`은 `pattern`이다

## Heuristics

아래 성질이 강할수록 `pattern` 쪽으로 기운다.

- 특정 화면 정보 구조를 전제한다
- left/right/top/bottom slot 관계가 중요하다
- 내부 child들의 배치 규칙 자체가 재사용 가치다
- story를 보여줄 때 single state보다 composition example이 더 중요하다
- 이름이 `Shell`, `Panel`, `Section`, `Layout`, `Toolbar`, `Sidebar`에 가깝다

아래 성질이 강할수록 `component` 쪽으로 기운다.

- 하나의 명확한 contract를 갖는다
- variants, size, tone, state가 핵심이다
- 여러 pattern/page 안에 반복 삽입된다
- 이름이 `Button`, `Field`, `Tag`, `Table`, `Badge`, `Tabs`, `EmptyState`에 가깝다

## Borderline Cases

애매한 경우는 아래 기준으로 정리한다.

### Case 1. Composite But Generic

`SelectableListItem`처럼 내부 구현은 조합이지만, 바깥에서 볼 때 generic reusable row contract면 `component`다.

### Case 2. Generic Base + Domain Wrapper

- base: `SelectableListItem` -> `component`
- wrapper: `DatasetListItem` -> `pattern`

이 구조를 우선 선호한다.

### Case 3. Component That Keeps Growing

처음엔 `component`였더라도 아래가 늘어나면 `pattern` 재분류를 검토한다.

- fixed layout slots가 많아진다
- 특정 workflow action이 붙는다
- domain semantics가 이름/props에 들어온다
- single-purpose display/control보다 화면 조립 책임이 커진다

## Recommended Split

새 UI를 만들 때는 가능하면 이렇게 나눈다.

1. 먼저 generic piece가 있는지 찾는다
2. 있으면 `component`로 유지한다
3. 그 위에 화면 맥락 wrapper를 `pattern`으로 올린다

예:

- `IconButton` -> component
- `DatasetTaskTag` -> component
- `SelectableListItem` -> component
- `DatasetListItem` -> pattern
- `DatasetListPanel` -> pattern
- `CatalogView` -> page

## Naming Guide

- `component`
  - object noun 위주
  - `Button`, `Tabs`, `Table`, `EmptyState`, `SelectableListItem`
- `pattern`
  - composition noun 위주
  - `CatalogShell`, `DatasetListPanel`, `SettingsSection`, `GalleryToolbar`

이름에 이미 product workflow가 강하게 들어가면 `pattern` 또는 app code일 가능성이 높다.

## Review Checklist

새 파일을 추가할 때 아래를 체크한다.

- 이 이름이 generic UI noun인가?
- props가 generic contract인가?
- 다른 화면에서도 같은 의미로 쓸 수 있는가?
- 이 파일의 가치가 “부품”인가 “조립 구조”인가?
- 내부 구현이 아니라 외부 사용 방식으로 봤을 때 component인가 pattern인가?

## Current Examples

### Components

- `Button`
- `IconButton`
- `Checkbox`
- `EmptyState`
- `DatasetTaskTag`
- `SelectableListItem`

### Patterns

- `PagePrimaryHeader`
- `GalleryToolbar`
- `CatalogShell`
- `DatasetListItem`
- `DatasetListPanel`

### Pages

- `CatalogView`
- `WorkspaceShell`
- `WorkspaceLabelingShell`

## If Still Unsure

이 질문으로 줄인다.

`이 단위는 다른 component들을 담아 화면 구조를 재사용하는가, 아니면 다른 구조 안에 들어가는 generic unit인가?`

- 전자면 `pattern`
- 후자면 `component`
