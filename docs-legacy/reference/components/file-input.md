# FileInput

## Import

```ts
import { FileInput } from '@ingradient/ui/components'
```

## What It Is

system file picker를 여는 최소 업로드 버튼이다.

## When To Use

- drag-and-drop 없이 기본 파일 선택만 필요할 때
- 작은 attachment/import 버튼이 필요할 때
- `UploadDropzone`이 과한 경우

## Main Props

- `onFiles(files: File[])` — 선택 완료 후 전달되는 파일 배열
- `accept?: string` — 허용 MIME / extension 필터
- `multiple?: boolean` — 다중 선택 여부
- `label?: ReactNode` — 버튼 라벨

## Do

- 간단한 picker flow에는 `FileInput`을 우선 쓴다
- 업로드 상태, validation, preview는 consumer가 별도로 관리한다

## Don’t

- drag/drop, large preview, queue UI까지 이 컴포넌트에 기대지 않는다
- 복잡한 업로드 workflow를 이 버튼 하나로 감추지 않는다

## Related Docs

- [text-field.md](./text-field.md)
- [../recipes/form-layout.md](../recipes/form-layout.md)
