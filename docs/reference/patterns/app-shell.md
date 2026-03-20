# App Shell

## Import

```ts
import {
  AppShell,
  PageHeader,
  PageHeaderRow,
  PageTitleBlock,
  PageTitle,
  PageSubtitle,
  PageContent,
} from '@ingradient/ui/patterns'
```

## What It Is

top bar, page header, content region을 한 화면 프레임으로 묶는 공용 shell이다.

## When To Use

- 새 product page
- settings page
- dashboard page
- operational workspace의 바깥 프레임

## Main Building Blocks

- `AppShell`
  - 전체 페이지 바깥 프레임
- `PageHeader`
  - 제목과 상단 action 영역
- `PageHeaderRow`
  - 제목과 우측 action row 정렬
- `PageTitleBlock`
  - title + subtitle 묶음
- `PageContent`
  - 본문 영역

## Do

- 새 페이지는 AppShell 조합부터 시작한다
- outer spacing과 page chrome은 공용 shell에 맡긴다

## Don’t

- 페이지마다 header shell과 content outer padding을 새로 만들지 않는다
