# Ingradient UI Docs

이 폴더는 `ingradient-ui` 운영 기준 문서 저장소다. 루트 `README.md`보다 깊은 구조, 경계, 규칙, 워크플로우는 여기서 관리한다.

## Reading Order

1. [PHILOSOPHY.md](./PHILOSOPHY.md)
2. [BOUNDARIES.md](./BOUNDARIES.md)
3. [CHANGE_GUIDE.md](./CHANGE_GUIDE.md)
4. [ARCHITECTURE.md](./ARCHITECTURE.md)
5. [FILE_RULES.md](./FILE_RULES.md)
6. [WORKFLOW.md](./WORKFLOW.md)

## Document Map

- [PHILOSOPHY.md](./PHILOSOPHY.md)
  - 저장소 존재 이유
  - 공용 UI와 제품 UI 분리 이유
  - 역할 분담 원칙

- [BOUNDARIES.md](./BOUNDARIES.md)
  - core vs app 판단 기준
  - token vs recipe vs variant 판단 기준

- [CHANGE_GUIDE.md](./CHANGE_GUIDE.md)
  - 수정 전에 꼭 읽어야 하는 문서 순서
  - 수정 중 지켜야 하는 규칙
  - 수정 후 최소 검증 항목

- [ARCHITECTURE.md](./ARCHITECTURE.md)
  - 루트 패키지 구조
  - `src/` 내부 레이어 구조
  - `lib/` 빌드 산출물 원칙
  - TS token source와 generated `tokens.css`

- [FILE_RULES.md](./FILE_RULES.md)
  - 파일 길이 규칙
  - naming/export 규칙
  - raw literal 금지 규칙

- [WORKFLOW.md](./WORKFLOW.md)
  - 디자인 변경 흐름
  - docs 동기화 규칙
  - local link와 release versioning
