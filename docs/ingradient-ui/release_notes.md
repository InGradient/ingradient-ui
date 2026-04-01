# ingradient-ui Release Notes

## Version 0.0.1

Release date: 2026-03-20

### Summary

`0.0.1`은 `ingradient-ui`의 첫 기준 버전이다. 루트 패키지 구조, token source 전략, docs showcase, public export surface를 한 번에 고정한 초기 release다.

### Included

- repo 루트가 곧 `@ingradient/ui` 패키지인 구조
- `src/` source of truth, `lib/` generated output 구조
- `tokens -> primitives -> components -> patterns -> brand` 공용 UI 레이어
- TypeScript token source와 generated `lib/tokens.css` 계약
- `@ingradient/ui/legacy` 호환 subpath
- `apps/design-showcase` 기반 사용자용 docs app

### Not Included

- dataset, annotation, export workflow
- camera, device, capture workflow
- project/member/class/training/model business logic
- 앱별 router, API, permission logic

### Operational Impact

- token rename, public export 변경, visual breaking change는 반드시 릴리즈 노트에 기록한다.
- `lib/tokens.css`는 generated artifact이므로 source 변경은 항상 `src/tokens/**`에서 시작해야 한다.

## Source Documents

- `/home/june/workspace/projects/ingradient-ui/docs/releases/0.0.1.md`
