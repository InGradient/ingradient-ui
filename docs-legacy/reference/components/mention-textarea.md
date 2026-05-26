# MentionTextarea

@트리거로 멘션 자동완성을 지원하는 textarea.

## Import

```tsx
import { MentionTextarea } from '@ingradient/ui/components'
```

## Props

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `value` | `string` | — | 텍스트 |
| `onChange` | `(value: string) => void` | — | 텍스트 변경 |
| `candidates` | `MentionCandidate[]` | — | 멘션 후보 |
| `onSubmit` | `(text, mentionIds) => void` | — | Ctrl+Enter 제출 |
| `triggerChar` | `string` | `'@'` | 트리거 문자 |
| `placeholder` | `string` | — | placeholder |
| `maxLength` | `number` | — | 최대 길이 |

## MentionCandidate

```tsx
{ id: string; name: string; secondary?: string }
```

## Typography

- textarea 폰트: `--ig-font-size-xs` (12px) — 코멘트 영역에서 밀집된 UI에 적합
- 후보 드롭다운 이름: `--ig-font-size-sm`, 보조 정보: `--ig-font-size-xs`

## When to use

- 코멘트 입력에서 사용자 멘션이 필요할 때
- `secondary` 필드로 이메일 등 보조 정보 표시
