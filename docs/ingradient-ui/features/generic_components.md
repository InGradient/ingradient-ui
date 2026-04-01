# Generic Components

## 목적

`ingradient-ui`의 component layer는 제품 의미 없이 여러 앱에서 바로 쓸 수 있는 입력, 피드백, data display, overlay를 제공하는 층이다. 이 문서는 component 추출 기준과 현재 핵심 범위를 정리한다.

## 기본 원칙

- 새 프로젝트에서 제품 의미 없이 바로 쓸 수 있어야 한다.
- business logic는 앱에 남긴다.
- component는 tokens와 primitives 위에 쌓는다.
- public export는 `@ingradient/ui/components`에서 연다.

## 현재 추출/확장 대상 예시

- `SearchField`
- `NumberField`
- `MentionTextarea`
- `ConfirmDialog`
- `SelectionActionBar`
- `EmptyState`
- `ColorSwatch`
- `CommentThread`
- `TagList`
- `TagListPanel`
- `ImageViewer`
- `DrawingLayer`
- `UploadDropzone`

## 추출할 때 함께 해야 하는 것

1. `src/components/**` 구현
2. `src/components/index.ts` re-export
3. 루트 export 연결
4. showcase metadata 추가
5. 예제와 docs coverage 확인

## 두면 안 되는 것

- dataset export 의미
- annotation workflow 의미
- camera/device recovery 의미
- training/model business action 의미

## 품질 기준

- raw hex/rgba, 임의 spacing/radius 직접 하드코딩 금지
- unrelated component를 한 파일에 섞지 않음
- docs showcase만 통과하고 실제 앱에서 깨지는 contract 금지

## 관련 문서

- `./reusable_patterns.md`
- `/home/june/workspace/projects/ingradient-ui/docs/plan/component-extraction.md`
- `/home/june/workspace/projects/ingradient-ui/docs/concepts/BOUNDARIES.md`
