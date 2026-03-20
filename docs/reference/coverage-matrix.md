# Coverage Matrix

이 문서는 public surface가 어디에서 문서화되는지 추적하는 기준표다.

## Coverage Levels

- `showcase documented`
- `markdown reference documented`
- `recipe documented`

## Core Surface

| Surface | Showcase | Reference | Recipe |
| --- | --- | --- | --- |
| tokens / theming | yes | yes | n/a |
| primitives | yes | yes | yes |
| brand | yes | yes | yes |
| inputs | yes | yes | yes |
| navigation | yes | yes | yes |
| data display | yes | yes | yes |
| overlays | yes | yes | yes |
| charts | yes | yes | yes |
| patterns | yes | yes | yes |
| button destructive tone | yes | yes | yes |
| field label/group helpers | yes | yes | yes |

## Rule

- showcase가 없는 public surface는 불완전한 API로 본다
- 자주 쓰는 surface는 markdown reference도 있어야 한다
- 실제 페이지 조립에 자주 쓰는 조합은 recipe 문서도 있어야 한다
