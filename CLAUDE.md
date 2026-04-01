# CLAUDE.md

## 구현 워크플로우
- 구현 전 릴리즈 분석: /analyze-release
- 기능 구현 시 Phase별로 진행한다 (Phase: UI → API → Backend → 연동 → 검증)
- 각 Phase 시작 시 해당 스킬을 호출한다: /0-plan-feature, /1-implement-ui, /2-implement-api, /3-implement-backend, /4-implement-connect, /5-verify-wireframe
- Plan에 참고 문서의 핵심 내용을 직접 포함한다. "문서를 참고한다"로 끝내지 않는다
- feature 하나씩 순서대로 구현한다. 여러 feature를 동시에 구현하지 않는다

## 코드 규칙
- UI는 @ingradient/ui를 사용한다
- 파일 하나는 200줄 미만
- 하드코딩 금지 — 상수 또는 환경변수 사용
- 기존 코드 패턴을 따른다. 새 패턴을 도입하지 않는다
- 요청받은 것만 구현한다. 요청하지 않은 기능, 추상화, "향후 확장성"을 미리 넣지 않는다

## 커밋
- 커밋 메시지는 한국어로 작성한다
- feat/fix/refactor 접두사를 사용한다
