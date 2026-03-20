# Getting Started

이 문서는 `@ingradient/ui`를 처음 쓰는 사람이 가장 빠르게 화면 하나를 만드는 흐름을 설명한다.

## Step 1. Install

```bash
npm install @ingradient/ui react react-dom styled-components
```

## Step 2. Add Theme And Global Style

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { IngradientThemeProvider, IngradientGlobalStyle } from '@ingradient/ui/tokens'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <IngradientThemeProvider>
    <IngradientGlobalStyle />
    <App />
  </IngradientThemeProvider>
)
```

## Step 3. Build A Simple Page Shell

```tsx
import {
  AppShell,
  PageHeader,
  PageHeaderRow,
  PageTitleBlock,
  PageTitle,
  PageSubtitle,
  PageContent,
} from '@ingradient/ui/patterns'
import { Button } from '@ingradient/ui/components'

export function App() {
  return (
    <AppShell>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <PageTitle>Templates</PageTitle>
            <PageSubtitle>Reusable assets for your team</PageSubtitle>
          </PageTitleBlock>
          <Button>New Template</Button>
        </PageHeaderRow>
      </PageHeader>
      <PageContent>{/* page content */}</PageContent>
    </AppShell>
  )
}
```

## Step 4. Add Data View

```tsx
import { Table } from '@ingradient/ui/components'

const columns = [
  { key: 'name', header: 'Name', render: (row: Row) => row.name },
  { key: 'owner', header: 'Owner', render: (row: Row) => row.owner },
]

const rows = [
  { id: 1, name: 'Warehouse Labels', owner: 'Ops Team' },
  { id: 2, name: 'Camera QA Set', owner: 'Vision Team' },
]

<Table columns={columns} rows={rows} />
```

## Step 5. Add Interaction

다음 순서로 붙이는 것이 가장 안전하다.

1. `patterns`로 화면 골격 만든다
2. `components`로 입력, 표, overlay를 채운다
3. `primitives`로 작은 레이아웃만 보완한다
4. raw styled-components는 정말 필요한 예외에만 쓴다

## Typical Imports

### Tokens

```ts
import { IngradientThemeProvider, IngradientGlobalStyle } from '@ingradient/ui/tokens'
```

### Primitives

```ts
import { Stack, Inline, Grid, Surface, Text, Heading } from '@ingradient/ui/primitives'
```

### Components

```ts
import { Button, TextField, SelectField, Tabs, Table, DialogShell } from '@ingradient/ui/components'
```

### Patterns

```ts
import { AppShell, Toolbar, SplitLayout, FormSection } from '@ingradient/ui/patterns'
```

## Which Docs To Read Next

- foundations 이해가 먼저 필요하면 [foundations.md](./foundations.md)
- form 중심 화면이면 [components/README.md](./components/README.md)
- page shell과 multi-pane 구조가 필요하면 [patterns/README.md](./patterns/README.md)

## Do

- 먼저 shell을 만들고 그 안을 채운다
- 이미 있는 component와 pattern 조합으로 해결한다
- semantics 없는 새 스타일을 바로 만들지 않는다

## Don’t

- 처음부터 feature 전용 styled layer를 크게 만들지 않는다
- raw color, radius, gap 값을 바로 화면 코드에 넣지 않는다
