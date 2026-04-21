# Ingradient UI Docs

이 폴더는 `ingradient-ui` 운영 기준 문서 저장소다. 루트 `README.md`보다 깊은 구조, 경계, 규칙, 워크플로우는 여기서 관리한다.

사용자-facing 실행 문서는 Storybook이 담당한다. 이 폴더는 기여자와 유지보수자를 위한 기준 문서와 shareable Markdown companion을 관리한다.

## Reading Order

1. [concepts/PHILOSOPHY.md](./concepts/PHILOSOPHY.md)
2. [concepts/BOUNDARIES.md](./concepts/BOUNDARIES.md)
3. [guides/DOCUMENTATION_STRATEGY.md](./guides/DOCUMENTATION_STRATEGY.md)
4. [guides/DOC_WRITING_RULES.md](./guides/DOC_WRITING_RULES.md)
5. [guides/CHANGE_GUIDE.md](./guides/CHANGE_GUIDE.md)
6. [guides/STORYBOOK_GUIDE.md](./guides/STORYBOOK_GUIDE.md)
7. [concepts/ARCHITECTURE.md](./concepts/ARCHITECTURE.md)
8. [rules/FILE_RULES.md](./rules/FILE_RULES.md)
9. [guides/WORKFLOW.md](./guides/WORKFLOW.md)
10. [releases/README.md](./releases/README.md)

## Structure

- `concepts/`
  - 저장소 철학, 경계, 구조
- `guides/`
  - 수정 절차, 문서 전략, 작성 규칙, 운영 가이드
- `rules/`
  - 강하게 지켜야 하는 규칙
- `reference/`
  - 공유 가능한 Markdown API reference
- `reference/recipes/`
  - 실제 화면 조립 예제
- `releases/`
  - 버전별 릴리즈 노트

## Document Map

- [concepts/PHILOSOPHY.md](./concepts/PHILOSOPHY.md)
  - 저장소 존재 이유
  - 공용 UI와 제품 UI 분리 이유
  - 역할 분담 원칙

- [concepts/BOUNDARIES.md](./concepts/BOUNDARIES.md)
  - core vs app 판단 기준
  - token vs recipe vs variant 판단 기준

- [concepts/ARCHITECTURE.md](./concepts/ARCHITECTURE.md)
  - 루트 패키지 구조
  - `src/` 내부 레이어 구조
  - `lib/` 빌드 산출물 원칙
  - TS token source와 generated `tokens.css`

- [guides/CHANGE_GUIDE.md](./guides/CHANGE_GUIDE.md)
  - 수정 전에 꼭 읽어야 하는 문서 순서
  - 수정 중 지켜야 하는 규칙
  - 수정 후 최소 검증 항목

- [guides/DOCUMENTATION_STRATEGY.md](./guides/DOCUMENTATION_STRATEGY.md)
  - 사용자 문서와 유지보수 문서의 경계
  - Storybook과 `docs/reference`의 역할 분리
  - 폴더별 README를 제한적으로만 두는 이유

- [guides/DOC_WRITING_RULES.md](./guides/DOC_WRITING_RULES.md)
  - 사용자 문서 페이지의 필수 섹션
  - props / variants / examples 작성 규칙
  - 코드 변경 시 문서 동기화 기준

- [guides/STORYBOOK_GUIDE.md](./guides/STORYBOOK_GUIDE.md)
  - Storybook을 누가 어떻게 쓰는지
  - story 유형과 global controls 기준
  - review/scenario/page story의 역할

- [plan/storybook-migration-tracker.md](./plan/storybook-migration-tracker.md)
  - `design-showcase`에서 Storybook으로의 이관 현황
  - done / partial / pending inventory
  - 남은 migration 우선순위

- [rules/FILE_RULES.md](./rules/FILE_RULES.md)
  - 파일 길이 규칙
  - naming/export 규칙
  - raw literal 금지 규칙

- [guides/WORKFLOW.md](./guides/WORKFLOW.md)
  - 디자인 변경 흐름
  - docs 동기화 규칙
  - local link와 release versioning

- [reference/README.md](./reference/README.md)
  - Storybook을 보조하는 공유용 Markdown reference
  - 핵심 public API 사용 요약
- [reference/getting-started.md](./reference/getting-started.md)
  - 처음 보는 사람을 위한 빠른 시작
  - theme 적용, page shell, table 조립 순서

- [reference/troubleshooting.md](./reference/troubleshooting.md)
  - 설치/peer dependency/theme/tokens.css/legacy 관련 실전 문제 해결

- [reference/coverage-matrix.md](./reference/coverage-matrix.md)
  - public surface 문서 coverage 추적

- [releases/README.md](./releases/README.md)
  - 버전별 릴리즈 노트 인덱스
  - 현재 공개된 버전 목록
