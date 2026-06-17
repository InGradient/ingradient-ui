# Workspace Blocks

## Import

```ts
import {
  StatCard,
  MetricCard,
  AssignmentRow,
  PreviewCard,
  HoverCard,
  SectionPanel,
  ActionBar,
  ProgressBlock,
} from '@ingradient/ui/components'
```

## What It Is

dense operational screen을 빠르게 조립하기 위한 block 묶음이다.

## When To Use

- dashboard summary
- models/training/settings
- preview + metadata card
- assignment-like row

## Included

- `StatCard`
- `MetricCard`
- `AssignmentRow`
- `PreviewCard`
- `SectionPanel`
- `ActionBar`
- `ProgressBlock`

## Do

- dense screen도 block 조합으로 시작한다
- card shell을 feature마다 다시 만들지 않는다

## Don’t

- business-specific workflow를 block 내부에 고정하지 않는다
