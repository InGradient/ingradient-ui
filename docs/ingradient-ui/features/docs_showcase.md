# Docs Showcase

## 목적

`apps/design-showcase`는 과거에 `@ingradient/ui`의 사용자용 API 문서 앱 역할을 맡았던 historical docs app이다.
현재 앱 자체는 제거되었고, 공식 실행 문서 source of truth는 Storybook이다.

## 역할

- 과거 live example 출처 설명
- migration tracker의 historical source inventory 보조
- Storybook 전환의 역사적 문맥 유지

## 역사적 metadata 구조

제거 전에는 문서 메타를 아래 파일에서 나눠 관리했다.

- `foundations.tsx`
- `components.tsx`
- `patterns.tsx`
- `types.ts`

## 현재 운영 원칙

1. 새 public export는 Storybook story를 먼저 추가한다.
2. removed docs app을 기준 문서처럼 복원하거나 재도입하지 않는다.
3. 관련 maintainer 문서와 `docs/reference/**`는 Storybook 기준으로 갱신한다.
4. `npm run check:doc-coverage`는 Storybook seed 기준으로 본다.

## 유지보수 문서와의 경계

- Storybook
  - 소비자용
  - public API 사용법
  - interactive review
- removed showcase
  - historical note only
  - source inventory
- `docs/`
  - 기여자/유지보수자용
  - 구조, 규칙, 워크플로우

## 운영상 주의

- 제거된 앱을 새 기준 문서처럼 다루지 않는다.
- 내부 helper나 low-level alias를 무조건 1:1 페이지로 노출하지는 않는다.
- release note와 Storybook migration tracker를 함께 본다.

## 관련 문서

- `./generic_components.md`
- `/home/june/workspace/projects/ingradient-ui/docs/README.md`
- `/home/june/workspace/projects/ingradient-ui/docs/guides/WORKFLOW.md`
- `/home/june/workspace/projects/ingradient-ui/docs/reference/getting-started.md`
