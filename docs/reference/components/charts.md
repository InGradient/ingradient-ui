# Charts

## Import

```ts
import {
  ChartContainer,
  LineChartCard,
  BarChartCard,
  PieChartCard,
} from '@ingradient/ui/components'
```

## What It Is

metric, trend, distribution을 공통 chart skin으로 보여주는 wrapper 묶음이다.

## When To Use

- dashboard summary
- monitoring metrics
- operational analytics

## Main Props

- `title?`
- `description?`
- `data`
- `series`
- `height?`

## Choose The Right Chart

- `LineChartCard`
  - 시간 흐름, 추세
- `BarChartCard`
  - 항목 간 비교
- `PieChartCard`
  - 분포 비율
  - 기본 slice 간격은 `0`이라 조각 사이가 배경색으로 벌어지지 않는다
  - 기본 `separator="subtle"`은 `--ig-color-chart-separator`로 비슷한 색의 slice 경계를 구분한다
  - 분리된 조각 표현이 필요할 때만 `paddingAngle`을 명시한다
  - separator가 필요 없는 chart는 `separator="none"`을 명시한다

## Do

- 같은 metric family는 같은 chart type과 tone을 유지한다
- chart wrapper를 먼저 고르고 데이터만 주입한다

## Don’t

- feature마다 새로운 chart skin을 만들지 않는다
- product 의미를 chart wrapper 자체에 박아 넣지 않는다
