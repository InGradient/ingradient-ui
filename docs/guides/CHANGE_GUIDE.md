# Change Guide

이 문서는 `ingradient-ui` 코드를 수정할 때 반드시 확인해야 하는 최소 운영 체크리스트다.

목표는 두 가지다.

- 공용 UI 저장소가 제품 UI 저장소로 다시 오염되지 않게 막기
- 수정자가 같은 실수를 반복하지 않게 기준 문서를 먼저 보게 하기

## Read These First

코드를 수정하기 전에 아래 문서를 먼저 본다.

1. [PHILOSOPHY.md](../concepts/PHILOSOPHY.md)
   - 왜 이 저장소가 존재하는지
   - 왜 범용 UI만 여기 둬야 하는지
2. [BOUNDARIES.md](../concepts/BOUNDARIES.md)
   - 지금 수정하려는 것이 core인지 app/domain인지
   - token, recipe, variant 중 어디에 둬야 하는지
3. [DOCUMENTATION_STRATEGY.md](./DOCUMENTATION_STRATEGY.md)
   - 사용자 문서는 어디에 쓰는지
   - 유지보수 문서는 어디에 쓰는지
   - showcase metadata를 왜 source of truth로 두는지
4. [DOC_WRITING_RULES.md](./DOC_WRITING_RULES.md)
   - 사용자 문서 페이지의 필수 섹션
   - props / variants / examples 작성 규칙
5. [ARCHITECTURE.md](../concepts/ARCHITECTURE.md)
   - 현재 루트 패키지 구조
   - `src/`와 `lib/`의 역할
   - token source와 generated CSS 관계
6. [FILE_RULES.md](../rules/FILE_RULES.md)
   - 파일 길이
   - export 규칙
   - raw literal 금지 규칙
7. [WORKFLOW.md](./WORKFLOW.md)
   - 수정 순서
   - `tokens.css` 생성 흐름
   - docs 동기화 규칙

## Before You Change Code

- 이 변경이 정말 `새 프로젝트에서도 제품 의미 없이 쓸 수 있는지` 먼저 판단한다.
- 공용 UI가 아니라면 `ingradient-ui`가 아니라 앱 저장소에서 처리한다.
- 값을 직접 하드코딩할지 먼저 고민하지 말고, `foundations`, `semantic`, `recipes`, `variants` 중 어디에 속하는지 먼저 결정한다.
- 기존 public API를 깨는지 먼저 확인한다.
- 내부 구현 경로 import를 추가하지 않는다.
- legacy alias가 필요한 경우에도 먼저 범용 이름으로 해결 가능한지 확인한다.

## What You Must Keep

- `src/`만 수정한다.
- `lib/`는 generated output으로만 취급한다.
- named export만 사용한다.
- 한 파일에는 하나의 public unit만 둔다.
- `components/`와 `patterns/`에서는 raw color, raw spacing, raw radius를 직접 넣지 않는다.
- 새 public export를 추가하면 docs도 같이 추가한다.
- showcase metadata 없는 public export를 만들지 않는다.
- 공유가 필요한 핵심 API는 `docs/reference/**`도 같이 갱신한다.

## What You Must Not Do

- 제품 의미가 있는 UI를 `ingradient-ui`에 넣지 않는다.
- `dataset`, `annotation`, `camera`, `device`, `project permission` 같은 흐름을 core에 올리지 않는다.
- `Portal*` 같은 legacy alias를 새 코드의 기본 API처럼 확장하지 않는다.
- 호환성이 꼭 필요할 때만 `@ingradient/ui/legacy`를 사용한다.
- `lib/` 파일을 직접 편집하지 않는다.
- 단순히 빨리 끝내려고 `components/index.tsx` 같은 mega-file 구조로 되돌리지 않는다.
- public export에 없는 내부 파일 경로를 앱에서 직접 import하게 만들지 않는다.

## When Changing Tokens

- foundation raw value를 바꾸는지
- semantic meaning mapping을 바꾸는지
- recipe 조합을 바꾸는지
- variant 선택지를 바꾸는지

이 네 가지를 먼저 구분한다.

그리고 아래 순서로 본다.

1. `src/tokens/**` 수정
2. docs app에서 시각 확인
3. `npm run build`
4. `lib/tokens.css`가 기대한 값으로 생성됐는지 확인
5. 관련 문서 갱신

## When Adding A Component

- 먼저 기존 `primitives`, `components`, `patterns` 안에 같은 책임이 있는지 본다.
- 새 컴포넌트가 필요한 이유를 설명할 수 있어야 한다.
- 아래를 같이 정해야 한다.
  - 어떤 token을 쓰는지
  - 어떤 recipe를 쓰는지
  - 어떤 variant surface를 노출하는지
  - 어떤 public export로 열지
  - docs showcase에 어떻게 보여줄지

## When Updating Docs

아래 변화는 반드시 문서와 같이 간다.

- 구조 변경 -> [ARCHITECTURE.md](../concepts/ARCHITECTURE.md)
- 파일 규칙 변경 -> [FILE_RULES.md](../rules/FILE_RULES.md)
- 경계 판단 기준 변경 -> [BOUNDARIES.md](../concepts/BOUNDARIES.md)
- 운영 순서 변경 -> [WORKFLOW.md](./WORKFLOW.md)
- 사용자 문서 구조 변경 -> [DOCUMENTATION_STRATEGY.md](./DOCUMENTATION_STRATEGY.md), [DOC_WRITING_RULES.md](./DOC_WRITING_RULES.md)
- 저장소 목적이나 역할 분담 변경 -> [PHILOSOPHY.md](../concepts/PHILOSOPHY.md), [../../README.md](../../README.md)

## Minimum Verification

수정 후 최소한 아래는 확인한다.

- `npm run build`
- `npm run check:style-literals`

필요하면 추가로 확인한다.

- docs 화면 시각 확인
- 새 export가 docs에 노출되는지 확인
- generated `lib/tokens.css` 확인

## Decision Shortcut

판단이 애매하면 이 질문 하나로 줄인다.

`이 변경은 Ingradient 제품 맥락을 몰라도 다른 프로젝트에서 바로 쓸 수 있는가?`

- `예`이면 `ingradient-ui`에서 진행한다.
- `아니오`이면 앱 저장소로 돌린다.
