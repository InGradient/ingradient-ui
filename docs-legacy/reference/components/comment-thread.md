# CommentThread

코멘트 목록 + 입력.

## Import

```tsx
import { CommentThread, CommentItem, CommentInput } from '@ingradient/ui/components'
```

## CommentItem Props

| Prop | Type | 설명 |
|------|------|------|
| `author` | `string` | 작성자 이름 |
| `timestamp` | `string` | 시간 표시 |
| `body` | `string` | 본문 (pre-wrap) |
| `actions` | `ReactNode` | 수정/삭제 버튼 슬롯 |

## CommentInput Props

| Prop | Type | 설명 |
|------|------|------|
| `value` | `string` | 입력 텍스트 |
| `onChange` | `(value: string) => void` | 변경 |
| `onSubmit` | `() => void` | 전송 (Ctrl+Enter도 지원) |
| `submitLabel` | `string` | 전송 버튼 텍스트 (default: "Send") |

## Typography

- CommentItem body: `--ig-font-size-xs` (12px)
- CommentItem meta (작성자, 시간): `--ig-font-size-2xs` (10px)
- CommentInput textarea: `--ig-font-size-xs` (12px)
- 코멘트 영역은 밀집된 UI이므로 본문/입력 모두 소형 폰트를 사용한다
