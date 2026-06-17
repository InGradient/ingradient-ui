# Ingradient UI Philosophy

## One Sentence

`ingradient-ui`는 범용 UI의 소스 오브 트루스이고, 제품 앱은 그것을 조립하는 소비자다.

## Why This Exists

이 저장소의 목적은 컴포넌트를 모아두는 것 자체가 아니다.

- 디자인 변경을 제품별로 반복하지 않기 위해
- 디자이너와 디자인-프론트 중간 역할자가 공용 UI를 운영할 수 있게 하기 위해
- 핵심 프론트엔드 개발자가 제품 로직과 조립에 집중하게 하기 위해
- 새로운 프로젝트에서도 같은 공용 UI를 바로 재사용할 수 있게 하기 위해

즉, 이 저장소는 특정 제품 화면 저장소가 아니라 여러 제품이 공유하는 범용 표현 계층 저장소다.

## Source Of Truth

가장 중요한 기준은 하나다.

`새 프로젝트에서 제품 의미 없이 바로 쓸 수 있는가?`

- `예`이면 `@ingradient/ui`에 둔다.
- `아니오`이면 앱 저장소에 둔다.

이 원칙을 깨기 시작하면 공용 UI 저장소가 다시 제품 UI 저장소가 된다.

## Why Core Only

범용 UI와 제품 UI를 같은 저장소에 섞으면 다음 문제가 생긴다.

- 저장소 경계가 흐려진다.
- 새 프로젝트 재사용 가능성이 떨어진다.
- 제품별 요구사항이 공용 패키지 구조를 오염시킨다.
- docs가 범용 API 문서가 아니라 제품 샘플 모음으로 변한다.

그래서 `ingradient-ui`는 범용 UI만 소유한다.

## Roles

### 디자이너 / 디자인-프론트 중간 역할자

- token과 theme를 관리한다.
- variant와 visual rule을 관리한다.
- 브랜드 자산과 공용 패턴을 관리한다.
- docs를 기준 화면으로 사용한다.

### 핵심 프론트엔드 개발자

- 제품 데이터 흐름과 상태를 관리한다.
- API, query, mutation, routing을 구현한다.
- 공용 UI를 조립해 제품 화면을 만든다.

### 제품 앱 저장소

- `ingradient-platform`
- `ingradient-edge`

제품 앱은 공용 UI의 소비자다. 공용 UI의 본진이 아니다.

## What Good Looks Like

- 디자이너가 token이나 variant를 바꾸면 여러 제품이 같이 바뀐다.
- 신규 프로젝트는 `@ingradient/ui`만 가져와도 기본 auth/settings/data-view를 조립할 수 있다.
- `platform`과 `edge`에는 제품 의미와 business logic만 남는다.
- `ingradient-ui`는 범용 UI만 설명하는 작고 명확한 저장소로 유지된다.
