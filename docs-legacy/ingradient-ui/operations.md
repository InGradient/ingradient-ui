# ingradient-ui Operations

## 운영 목적

- consuming apps가 안정적으로 재사용 가능한 UI surface를 제공한다
- docs와 package contract가 어긋나지 않게 유지한다

## 핵심 메트릭과 체크

- package build success
- `tokens.css` generation success
- docs build success
- doc coverage check
- style literal check

## 운영상 중요한 원칙

- 디자인 변경은 제품 앱이 아니라 `ingradient-ui`에서 먼저 시작한다
- foundation / semantic / recipe / variant 중 어디가 바뀌는지 먼저 결정한다
- public export나 prop contract 변경 시 docs metadata와 reference 문서를 함께 본다

## 트러블슈팅 포인트

- internal path import 사용 여부
- `src`와 `lib` 산출물 불일치
- token rename 후 docs 반영 누락
- consuming app에서 local file dependency와 published version 차이

## 관련 근거 문서

- `/home/june/workspace/projects/ingradient-ui/docs/guides/WORKFLOW.md`
- `/home/june/workspace/projects/ingradient-ui/docs/guides/DOCUMENTATION_STRATEGY.md`
- `/home/june/workspace/projects/ingradient-ui/docs/reference/troubleshooting.md`

