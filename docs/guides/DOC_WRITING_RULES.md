# Doc Writing Rules

이 문서는 `@ingradient/ui` 사용자 문서를 쓸 때 지켜야 하는 최소 규칙을 정의한다.

## Required Sections

각 showcase 상세 페이지는 아래 순서를 유지한다.

1. What it is
2. When to use
3. Import
4. Live examples
5. Variants / states
6. Props / parameters
7. Related components
8. Do / Don’t
9. Notes

## Required Metadata

모든 `DocEntry`는 최소 아래를 채운다.

- `id`
- `section`
- `title`
- `summary`
- `whenToUse`
- `importPath`
- `examples`
- `states`
- `props`
- `variants`
- `related`
- `notes`
- `dos`
- `donts`
- `status`

## Writing Style

- 한국어 우선
- API 이름과 코드 예시는 영어 그대로 유지
- 한 문장은 짧고 바로 판단 가능해야 함
- 구현 세부보다 사용 판단을 먼저 설명

좋은 예:
- `목록, 비교 표, 간단한 metadata table에 사용한다.`

나쁜 예:
- `이 컴포넌트는 다양한 상황에서 사용할 수 있으며 경우에 따라 매우 유용하다.`

## Example Rules

- 대표 예제는 최소 1개
- key component는 2개 이상이면 더 좋다
- 예제 제목은 무엇을 보여주는지 바로 드러나야 한다
- 예제 설명은 1문장 안에서 끝낸다

## Props Rules

- 구현 파일의 모든 HTML prop을 나열하지 않는다
- 사용자가 실제로 판단에 필요한 핵심 prop만 쓴다
- `required`, `defaultValue`, `description`을 같이 적는다

좋은 prop 문서:
- `variant`: 행동의 강조 단계를 정한다

나쁜 prop 문서:
- `className`: standard HTML prop

## Variant Rules

- variant는 “무엇을 바꾸는가”가 보여야 한다
- 값 목록만 쓰지 말고 언제 그 variant를 쓰는지 설명한다

## Related Rules

- 같은 화면에서 자주 같이 쓰는 것
- 대체 관계에 있는 것
- 상위 pattern / 하위 primitive 관계가 있는 것

이 중 최소 하나는 포함한다.

## Do / Don’t Rules

- `Do`는 사용 권장 패턴을 쓴다
- `Don't`는 실제로 자주 생길 수 있는 오용을 쓴다
- 추상적 금지보다 구체적 오용 사례를 선호한다

## Sync Rules

다음 변경은 반드시 문서 동기화가 필요하다.

- 새 public export 추가
- 기존 component의 variant 추가/제거
- prop contract 변경
- import path 변경
- visual behavior가 바뀌는 animation/interaction 변경

동기화 대상:

- `apps/design-showcase/src/docs/*.ts(x)`
- 필요한 경우 `docs/reference/**`

## Review Checklist

문서 추가/수정 후 최소한 아래를 확인한다.

- 코드 안 보고도 사용 판단이 가능한가
- import path가 실제 export와 일치하는가
- examples가 현재 구현과 맞는가
- related가 실제로 도움이 되는가
- do / don't가 너무 추상적이지 않은가
