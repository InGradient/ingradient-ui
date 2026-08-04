# CLAUDE.md

## 구현 워크플로우
- 구현 전 릴리즈 분석: /analyze-release
- 기능 구현 시 Phase별로 진행한다 (Phase: UI → API → Backend → 연동 → 검증)
- 각 Phase 시작 시 해당 스킬을 호출한다: /0-plan-feature, /1-implement-ui, /2-implement-api, /3-implement-backend, /4-implement-connect, /5-verify-wireframe
- Plan에 참고 문서의 핵심 내용을 직접 포함한다. "문서를 참고한다"로 끝내지 않는다
- feature 하나씩 순서대로 구현한다. 여러 feature를 동시에 구현하지 않는다

## 코드 규칙
- 범용 UI는 `@ingradient/ui`를 사용한다
- Platform/Edge 제품 composition은 각각 `@ingradient/platform-pages`, `@ingradient/edge-pages`의 controlled view를 사용한다
- page package와 Storybook은 API, router, global store를 직접 소유하지 않고 props/callback으로 앱과 연결한다
- operational page story는 package-owned view를 렌더하고 fixture/runtime만 조정한다
- 파일 하나는 200줄 미만
- 하드코딩 금지 — 상수 또는 환경변수 사용
- 기존 코드 패턴을 따른다. 새 패턴을 도입하지 않는다
- 요청받은 것만 구현한다. 요청하지 않은 기능, 추상화, "향후 확장성"을 미리 넣지 않는다

## Storybook 검증
- Platform `0.0.1`의 현재 계약은 `stories/pages/platform/0.0.1/README.md`와 `MIGRATION.md`를 따른다
- UI 변경은 해당 story의 Controls, Actions, named workflow, blocking accessibility를 함께 유지한다
- canonical story ID를 바꾸면 probe, visual target, handoff, 문서를 같은 변경에서 이동한다
- package build, unit, focused Storybook MCP, static probe를 통과한 뒤 완료로 기록한다

## UI 작업 문서
- 핵심 계층 규칙은 `ui-refactoring-rule.md`를 따른다
- 기획/Phase/구현 요청 템플릿은 `docs/guides/ui-workflow.md`를 사용한다
- lint/source/Storybook 감사 절차는 `docs/guides/ui-audit.md`를 사용한다

## 커밋
- 커밋 메시지는 한국어로 작성한다
- feat/fix/refactor 접두사를 사용한다
