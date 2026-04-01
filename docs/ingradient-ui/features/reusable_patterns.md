# Reusable Patterns

## 목적

`ingradient-ui`의 pattern 레이어는 단일 button이나 input보다 큰 화면 골격을 공용화하는 층이다. 소비 앱은 이 layer를 써서 shell, split layout, settings shell 같은 반복 구조를 조합한다.

## 포함 범위

- app shell
- sidebar shell
- toolbar
- layouts
- split layout
- settings shell
- dashboard grid
- list-detail
- forms / form section

## 경계 규칙

판단 기준은 하나다.

`새 프로젝트에서 제품 의미 없이 바로 쓸 수 있는가?`

- 예면 `@ingradient/ui`
- 아니면 앱 저장소

## pattern에 두면 안 되는 것

- dataset export 의미
- annotation workflow
- camera recovery flow
- project/member role 의미
- training/model 비즈니스 액션

## 품질 기준

- layout ownership이 모호하면 소비 앱마다 겹침 문제가 반복된다.
- overlay, sidebar, split layout은 dense layout에서도 안전해야 한다.
- docs showcase에서만 예쁘고 실제 앱에서 깨지는 패턴은 공용 패턴으로 보기 어렵다.

## 관련 문서

- `../operations.md`
- `/home/june/workspace/projects/ingradient-ui/docs/reference/patterns/README.md`
- `/home/june/workspace/projects/ingradient-ui/docs/concepts/BOUNDARIES.md`
- `/home/june/workspace/projects/ingradient-ui/docs/plan/component-extraction.md`
