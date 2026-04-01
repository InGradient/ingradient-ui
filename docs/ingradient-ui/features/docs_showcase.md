# Docs Showcase

## 목적

`apps/design-showcase`는 단순 demo 앱이 아니라 `@ingradient/ui`의 사용자용 API 문서 앱이다. 유지보수 문서와 역할이 다르며, public API metadata의 source of truth 역할을 가진다.

## 역할

- public API를 사용자 관점으로 문서화
- live example 제공
- props, variants, do/don't, related notes 정리
- 새 export 추가 시 문서 누락을 빨리 발견

## metadata 구조

문서 메타는 아래 파일에서 나눠 관리한다.

- `foundations.tsx`
- `components.tsx`
- `patterns.tsx`
- `types.ts`

## public export 변경 시 함께 수정할 것

1. `apps/design-showcase/src/docs/*.ts(x)` metadata
2. showcase 상세 페이지 예제
3. 관련 maintainer 문서
4. `docs/reference/**`
5. `npm run check:doc-coverage`

## 유지보수 문서와의 경계

- showcase
  - 소비자용
  - public API 사용법
- `docs/`
  - 기여자/유지보수자용
  - 구조, 규칙, 워크플로우

## 운영상 주의

- 문서 메타는 수동 관리이므로 export surface 변경 시 누락이 생기기 쉽다.
- 내부 helper나 low-level alias를 무조건 1:1 페이지로 노출하지는 않는다.
- release note와 public export 변경 기록을 함께 봐야 한다.

## 관련 문서

- `./generic_components.md`
- `/home/june/workspace/projects/ingradient-ui/docs/README.md`
- `/home/june/workspace/projects/ingradient-ui/docs/guides/WORKFLOW.md`
- `/home/june/workspace/projects/ingradient-ui/docs/reference/getting-started.md`
