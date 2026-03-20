# File Rules

## Core Rule

구현 파일은 기본적으로 `200줄 미만`을 유지한다.

이 기준은 giant file 방지와 책임 분리를 위한 운영 규칙이다.

## Allowed Exceptions

- `index.ts` 배럴 파일
- `types.ts`
- token map, icon registry 같은 데이터 파일
- 외부 chart wrapper처럼 구조상 불가피한 일부 파일

그래도 가능하면 `250줄`을 넘기지 않는다.

## Naming Rules

- JSX가 없으면 `.ts`
- JSX가 있으면 `.tsx`
- public export 배럴은 `index.ts`
- 빌드 산출물은 `lib/`에만 생성

## Export Rules

- named export only
- default export 금지
- public API는 layer index에서만 연다

## Responsibility Rules

- 한 파일은 하나의 public unit만 소유한다.
- unrelated component를 한 파일에 섞지 않는다.
- legacy alias와 새 public API 구현을 한 파일에 섞지 않는다.

## Raw Literal Rule

`components/`와 `patterns/`에서 아래를 직접 하드코딩하지 않는다.

- raw hex color
- raw rgba color
- 임의 spacing/radius literal
- variant 의미가 있는 tone map

이런 값은 아래 중 하나로 올린다.

- `tokens/foundations`
- `tokens/semantic`
- `tokens/recipes`
- `tokens/variants`

## Generated Output Rule

- `lib/`는 사람이 수정하지 않는다.
- `lib/`에 source file을 두지 않는다.
- package exports는 `lib/`만 가리킨다.
- build 산출물 디렉터리(`lib/`, app `dist/`)는 git 관리 대상이 아니다.
