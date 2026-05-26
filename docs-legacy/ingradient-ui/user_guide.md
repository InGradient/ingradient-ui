# ingradient-ui User Guide

## 대상 사용자

- consuming app 개발자
- 디자인 시스템 유지보수자

## 시작하기

1. package를 설치하거나 local file dependency로 연결한다
2. `IngradientThemeProvider`와 `IngradientGlobalStyle`를 적용한다
3. `patterns`로 shell을 만든다
4. `components`와 `primitives`로 내부를 채운다

## 권장 사용 순서

1. `patterns`
2. `components`
3. `primitives`
4. raw style은 정말 필요한 예외에만

## 중요한 사용 원칙

- public export만 import한다
- 제품 의미가 없는 것은 먼저 `@ingradient/ui`에서 해결 가능한지 본다
- business logic는 앱에 남긴다
- 디자인 변경은 UI package 쪽에서 먼저 처리한다
- UI 개발 규칙은 `ui_development_guide.md`를 따른다

## 자주 묻는 문제

- theme / global style를 빼먹음
- internal path import 사용
- `tokens.css` 또는 generated output 혼동
- layout contract를 app에서 임의로 깨뜨림

## 관련 링크

- `/home/june/workspace/projects/ingradient-ui/docs/reference/getting-started.md`
- `/home/june/workspace/projects/ingradient-ui/docs/concepts/BOUNDARIES.md`
- `/home/june/workspace/projects/ingradient-ui/docs/guides/WORKFLOW.md`

