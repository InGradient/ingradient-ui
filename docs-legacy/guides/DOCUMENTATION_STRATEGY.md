# Documentation Strategy

`ingradient-ui` 문서는 한 곳에 몰아넣지 않는다. 사용자-facing 문서의 중심은 Storybook이다.

## Why Hybrid

- 사용자 문서는 `코드를 읽지 않고도` `무엇이 있고`, `언제 쓰고`, `어떤 props와 variants가 있는지` 이해할 수 있어야 한다.
- 유지보수 문서는 `왜 이런 경계를 두는지`, `어디를 수정해야 하는지`, `무엇을 금지하는지`를 빠르게 판단할 수 있어야 한다.
- 타입 자동 추출만으로는 `언제 쓰는지`, `언제 쓰면 안 되는지`, `관련 컴포넌트가 무엇인지`를 설명할 수 없다.

그래서 문서 체계는 다음 두 층으로 고정한다.

## User Docs

위치:
- Storybook
- `docs/reference`

역할:
- public API 카탈로그
- live example
- states
- props / variants
- related components
- do / don't
- 공유 가능한 Markdown snapshot

원칙:
- 사용자-facing 실행 문서의 기본 source of truth는 Storybook stories와 MDX다.
- `docs/reference`는 Storybook을 따라가는 shareable companion이다.
- props 설명과 사용 의도는 코드 옆 JSDoc를 우선한다.
- 새 public export는 Storybook entry 없이 추가하지 않는다.
- retired showcase app은 새 기준 문서로 취급하지 않는다.

## Coverage Matrix

문서 coverage는 아래 3단계로 관리한다.

- `storybook documented`
- `markdown reference documented`
- `recipe documented`

이 기준은 `docs/reference/coverage-matrix.md`에서 추적한다.

## Maintainer Docs

위치:
- `docs/`

역할:
- 철학
- 구조
- 파일 규칙
- 경계
- 워크플로우
- 문서 작성 규칙

원칙:
- 운영 기준은 `docs/`에서 관리한다.
- 사용자 문서 구조를 바꾸면 `docs/guides/WORKFLOW.md`와 이 문서도 같이 갱신한다.

## Where To Write What

- 사용자가 `어떻게 쓰는지` 궁금한 내용
  - Storybook stories / MDX
  - `docs/reference/**`
- 사용자가 `어떻게 조합하는지` 궁금한 내용
  - Storybook `Patterns`, `Pages`
  - `docs/reference/recipes/**`
- 기여자가 `왜 이렇게 구성되어 있는지` 궁금한 내용
  - `docs/*.md`
- 특정 레이어 책임을 설명하는 짧은 안내
  - `src/components/README.md`
  - `src/patterns/README.md`
  - `src/tokens/README.md`
  - `src/legacy/README.md`

## Why Not README In Every Folder

- 폴더마다 README를 두면 구조 설명이 중복되고 금방 어긋난다.
- 사용자 입장에서는 폴더 README보다 Storybook 페이지가 훨씬 유용하다.
- contributor 입장에서도 모든 하위 폴더에 설명이 필요하지 않다.

그래서 README는 상위 레이어 몇 곳에만 둔다.

## Documentation Source Model

- 실제 API 계약의 source는 TypeScript source다.
- props 설명과 사용 의도의 source는 JSDoc다.
- public API의 실행 가능한 문서 source는 Storybook story와 MDX다.
- `docs/reference/**`는 Storybook을 따라가는 Markdown companion이다.
- 이유:
  - 타입만으로는 사용 맥락을 설명할 수 없다.
  - story가 실제 상태와 조합을 가장 정확하게 보여준다.
  - do / don't, related, notes는 사람이 명시해야 정확하다.

## Storybook Role

Storybook은 아래 역할을 동시에 맡는다.

- 공식 컴포넌트 카탈로그
- 공식 live example 대체제
- 디자이너 검토용 interactive sandbox
- story 기반 테스트 entrypoint

따라서 Storybook은 문서이면서 검증 수단이다.

## Source Priority

우선순위는 아래와 같다.

1. TypeScript source
2. JSDoc
3. Storybook stories
4. Storybook MDX
5. `docs/reference/**`

규칙:

- 타입/계약은 source를 따른다
- 설명과 사용 판단은 JSDoc + Storybook을 따른다
- 공유용 Markdown은 Storybook과 동기화한다

## Non-Negotiables

- public export를 추가하면 Storybook story도 같이 추가한다.
- Storybook에 없는 public export는 사실상 미완성 API로 취급한다.
- 자주 쓰는 surface는 `docs/reference/**`도 같이 유지한다.
- 유지보수 규칙을 바꾸면 `docs/`를 같이 수정한다.
