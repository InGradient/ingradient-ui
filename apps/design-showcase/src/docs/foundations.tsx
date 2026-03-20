import { BrandLogo, BrandMark } from '@ingradient/ui/brand'
import { Box, Container, Grid, Heading, Inline, Stack, Surface, Text } from '@ingradient/ui/primitives'
import {
  BackgroundsDemo,
  BrandDemo,
  ColorDemo,
  FoundationsOverviewDemo,
  SpacingDemo,
  ThemingDemo,
  TypographyDemo,
} from '../showcaseRegistry'
import type { DocEntry } from './types'

function LayoutPrimitivesDemo() {
  return (
    <Stack gap={16}>
      <Surface elevation="panel" style={{ padding: 18, borderRadius: 22 }}>
        <Stack gap={12}>
          <Text size="12px" tone="soft">
            Stack + Inline + Box
          </Text>
          <Stack gap={10}>
            <Box style={{ padding: 12, borderRadius: 14, background: 'rgba(77,136,255,0.12)' }}>Box</Box>
            <Inline gap={10}>
              <Box style={{ padding: 12, borderRadius: 14, background: 'rgba(53,198,167,0.12)' }}>Inline A</Box>
              <Box style={{ padding: 12, borderRadius: 14, background: 'rgba(251,146,60,0.14)' }}>Inline B</Box>
            </Inline>
          </Stack>
        </Stack>
      </Surface>
      <Grid minItemWidth={220} gap={14}>
        <Surface elevation="panel" style={{ padding: 18, borderRadius: 22 }}>
          <Text tone="secondary">Grid는 반복 카드, metrics, gallery-like list에 쓴다.</Text>
        </Surface>
        <Surface elevation="panel" style={{ padding: 18, borderRadius: 22 }}>
          <Text tone="secondary">Container는 page max-width와 outer padding을 고정한다.</Text>
        </Surface>
      </Grid>
      <Container maxWidth={700} padding={0}>
        <Surface elevation="raised" style={{ padding: 18, borderRadius: 22 }}>
          <Text tone="secondary">Container example: centered content width for docs or settings pages.</Text>
        </Surface>
      </Container>
    </Stack>
  )
}

function TypographyPrimitivesDemo() {
  return (
    <Surface elevation="panel" style={{ padding: 22, borderRadius: 24 }}>
      <Stack gap={12}>
        <Heading level={1}>Heading Level 1</Heading>
        <Heading level={2}>Heading Level 2</Heading>
        <Heading level={3}>Heading Level 3</Heading>
        <Text size="16px" tone="secondary" style={{ display: 'block' }}>
          Text는 body, helper, metadata copy에 쓰고, Heading은 페이지 위계와 섹션 강조에 쓴다.
        </Text>
        <Inline gap={10}>
          <Text tone="soft">Soft label</Text>
          <Text tone="muted">Muted metadata</Text>
          <Text tone="accent">Accent action text</Text>
        </Inline>
      </Stack>
    </Surface>
  )
}

function SurfacePrimitivesDemo() {
  return (
    <Grid minItemWidth={220} gap={14}>
      <Surface elevation="panel" style={{ padding: 18, borderRadius: 22 }}>
        <Text weight={700}>Panel</Text>
        <Text tone="secondary" style={{ display: 'block', marginTop: 8 }}>
          기본 데이터 화면 surface.
        </Text>
      </Surface>
      <Surface elevation="raised" style={{ padding: 18, borderRadius: 22 }}>
        <Text weight={700}>Raised</Text>
        <Text tone="secondary" style={{ display: 'block', marginTop: 8 }}>
          dialog, menu, floating block용 surface.
        </Text>
      </Surface>
      <Surface elevation="card" style={{ padding: 18, borderRadius: 22 }}>
        <Text weight={700}>Card</Text>
        <Text tone="secondary" style={{ display: 'block', marginTop: 8 }}>
          강조 카드와 hero block용 surface.
        </Text>
      </Surface>
      <Surface elevation="panel" style={{ padding: 18, borderRadius: 22 }}>
        <Stack gap={10}>
          <BrandMark size={28} />
          <BrandLogo width={140} />
        </Stack>
      </Surface>
    </Grid>
  )
}

const foundationImports = {
  overview: "import { IngradientThemeProvider, IngradientGlobalStyle } from '@ingradient/ui/tokens'",
  tokens: "import { colors, spacingScale, radiusScale, ingradientTheme } from '@ingradient/ui/tokens'",
  primitives: "import { Box, Stack, Inline, Grid, Container, Surface, Text, Heading } from '@ingradient/ui/primitives'",
  brand: "import { BrandMark, BrandLogo } from '@ingradient/ui/brand'",
}

export const foundationDocs: DocEntry[] = [
  {
    id: 'overview',
    section: 'foundations',
    group: 'overview',
    title: 'Overview',
    summary: '토큰, primitives, semantic theme, generated tokens.css를 한 번에 보는 시작점이다.',
    whenToUse: '처음 `@ingradient/ui`를 도입할 때 전체 구조와 토큰 흐름을 이해하는 출발점으로 사용한다.',
    whenNotToUse: '개별 컴포넌트 prop을 찾는 페이지로 쓰지 않는다. 그런 경우에는 각 component 문서를 본다.',
    importPath: foundationImports.overview,
    examples: [{ title: 'Foundations at a glance', description: 'Theme, font, radius, motion, base color tokens.', component: FoundationsOverviewDemo }],
    states: ['default', 'portalDark', 'generated CSS'],
    props: [
      { name: 'IngradientThemeProvider', type: 'React provider', required: true, description: 'semantic theme와 styled-components theme를 앱 전체에 공급한다.' },
      { name: 'IngradientGlobalStyle', type: 'Global style component', required: true, description: 'semantic CSS variables와 base reset을 주입한다.' },
    ],
    variants: [
      { name: 'theme preset', values: ['portalDark'], description: '현재 기본 preset이다. 향후 preset이 늘어나도 semantic token contract는 유지한다.' },
    ],
    related: ['colors', 'spacing', 'theming', 'layout-primitives'],
    notes: ['토큰의 source of truth는 TypeScript이며 빌드 시 `lib/tokens.css`가 자동 생성된다.', '사용자 문서는 showcase에서 보고, 운영 규칙은 `docs/`에서 본다.'],
    dos: ['앱 시작점에서 provider와 global style을 함께 적용한다.', '새 프로젝트는 foundations overview부터 읽고 들어간다.'],
    donts: ['raw hex와 raw spacing literal로 바로 화면을 만들지 않는다.', 'product-specific workflow를 foundations로 올리지 않는다.'],
    status: 'ready',
  },
  {
    id: 'colors',
    section: 'foundations',
    group: 'color',
    title: 'Color',
    summary: 'canvas, surface, border, text, accent, semantic feedback tone을 정의하는 색상 계층이다.',
    whenToUse: '배경, 경계선, text tone, 상태 색상을 정할 때 semantic token 기준으로 선택한다.',
    whenNotToUse: 'brand campaign이나 product-specific 의미를 가진 임시 색상을 직접 추가하지 않는다.',
    importPath: foundationImports.tokens,
    examples: [{ title: 'Semantic color palette', description: 'Canvas, panel, accent, success, danger tone preview.', component: ColorDemo }],
    states: ['canvas', 'panel', 'accent', 'success', 'danger'],
    props: [
      { name: 'colors', type: 'token object', required: false, description: 'foundation palette와 semantic color contract를 코드에서 조회할 때 사용한다.' },
      { name: 'tokens.css', type: 'generated stylesheet', required: false, description: 'CSS-only 환경에서 `--ig-*` 변수로 바로 사용한다.' },
    ],
    variants: [
      { name: 'semantic tone', values: ['surface', 'text', 'border', 'accent', 'success', 'warning', 'danger'], description: 'UI 의미 단위로 색을 선택한다.' },
    ],
    related: ['backgrounds', 'theming'],
    notes: ['컴포넌트 구현에서는 foundation color보다 semantic CSS variable을 우선 사용한다.'],
    dos: ['`var(--ig-color-...)` 형태로 semantic 값을 소비한다.'],
    donts: ['component 파일 안에 raw hex를 직접 쓰지 않는다.'],
    status: 'ready',
  },
  {
    id: 'typography',
    section: 'foundations',
    group: 'typography',
    title: 'Typography',
    summary: 'dense operational screen에 맞춘 heading, body, metadata scale을 설명한다.',
    whenToUse: '페이지 위계, 본문 copy, helper text, metadata tone을 정할 때 참고한다.',
    whenNotToUse: '특수 마케팅 페이지용 타이포그래피를 여기 기준으로 억지로 맞추지 않는다.',
    importPath: foundationImports.tokens,
    examples: [{ title: 'Typography scale', description: 'Heading과 body hierarchy preview.', component: TypographyDemo }],
    states: ['heading', 'body', 'metadata'],
    props: [
      { name: 'fontFamily', type: 'semantic token', required: false, description: 'global typography stack의 기준이 된다.' },
      { name: 'fontSize scale', type: 'token map', required: false, description: 'dense UI에 맞춘 size step을 제공한다.' },
    ],
    variants: [
      { name: 'tone', values: ['primary', 'secondary', 'muted', 'soft', 'accent'], description: '같은 text primitive 안에서도 semantic tone을 바꿀 수 있다.' },
    ],
    related: ['type-primitives', 'spacing'],
    notes: ['타이포그래피 값은 foundation token에서 관리하지만 실제 사용은 `Text`, `Heading` primitive를 우선한다.'],
    dos: ['위계는 primitive와 semantic tone으로 만든다.'],
    donts: ['font-size와 color를 component마다 새로 하드코딩하지 않는다.'],
    status: 'ready',
  },
  {
    id: 'spacing',
    section: 'foundations',
    group: 'spacing',
    title: 'Spacing',
    summary: 'gap, padding, shell rhythm을 위한 공통 spacing scale이다.',
    whenToUse: 'Stack, Grid, panel padding, overlay spacing을 정할 때 scale 값을 따른다.',
    whenNotToUse: '픽셀 단위 간격을 화면마다 새로 정의하지 않는다.',
    importPath: foundationImports.tokens,
    examples: [{ title: 'Spacing rhythm', description: 'Common 8, 12, 16, 24px rhythm preview.', component: SpacingDemo }],
    states: ['compact', 'default', 'comfortable'],
    props: [
      { name: 'spacingScale', type: 'token map', required: false, description: '공통 spacing unit 목록이다.' },
    ],
    variants: [
      { name: 'density', values: ['compact', 'default', 'comfortable'], description: '같은 token scale을 화면 밀도에 맞게 조합한다.' },
    ],
    related: ['layout-primitives', 'backgrounds'],
    notes: ['spacing은 foundation 값이고, 실제 조합 규칙은 recipe와 pattern에서 결정한다.'],
    dos: ['gap과 padding은 scale 안에서 선택한다.'],
    donts: ['거의 비슷한 간격 값을 여러 군데서 새로 만들지 않는다.'],
    status: 'ready',
  },
  {
    id: 'backgrounds',
    section: 'foundations',
    group: 'backgrounds',
    title: 'Backgrounds',
    summary: 'panel, raised, card 등 surface elevation과 dark-theme background 역할을 보여준다.',
    whenToUse: '페이지 shell, dialogs, cards, inspector 같은 surface 위계를 잡을 때 사용한다.',
    whenNotToUse: '단순히 진하게 보이게 하려고 임의 background를 추가하지 않는다.',
    importPath: foundationImports.tokens,
    examples: [{ title: 'Elevation surfaces', description: 'Panel, raised, card surface hierarchy.', component: BackgroundsDemo }],
    states: ['panel', 'raised', 'card'],
    props: [
      { name: 'surface.*', type: 'semantic token group', required: false, description: 'surface elevation별 background, border, shadow 값을 제공한다.' },
    ],
    variants: [
      { name: 'elevation', values: ['panel', 'raised', 'card'], description: 'surface와 component가 가장 많이 쓰는 세 가지 배경 단계다.' },
    ],
    related: ['surface-primitives', 'theming', 'colors'],
    notes: ['높은 강조가 필요하다고 무조건 card를 쓰지 말고, interaction context를 먼저 본다.'],
    dos: ['surface elevation으로 레이어 위계를 만든다.'],
    donts: ['새 surface type을 각 feature가 따로 정의하지 않는다.'],
    status: 'ready',
  },
  {
    id: 'theming',
    section: 'foundations',
    group: 'theming',
    title: 'Theming',
    summary: 'theme provider, global style, temporary migration alias, generated CSS contract를 설명한다.',
    whenToUse: '앱 부트스트랩, CSS-only 소비, migration-safe token alias를 이해할 때 사용한다.',
    whenNotToUse: 'component usage 문서 대신 여기서 prop을 찾지 않는다.',
    importPath: foundationImports.overview,
    examples: [{ title: 'Theme provider contract', description: 'Provider, global style, semantic alias, progress example.', component: ThemingDemo }],
    states: ['provider', 'global style', 'tokens.css'],
    props: [
      { name: 'ThemeProvider', type: 'provider alias', required: false, description: 'legacy consumer를 위한 alias다. 새 코드는 `IngradientThemeProvider`를 쓴다.' },
      { name: 'renderTokensCss()', type: 'utility', required: false, description: 'generated stylesheet를 만드는 내부 진입점이다.' },
    ],
    variants: [
      { name: 'consumption mode', values: ['React + styled-components', 'CSS-only via tokens.css'], description: '사용 환경에 따라 같은 semantic contract를 다른 방식으로 소비한다.' },
    ],
    related: ['overview', 'colors', 'brand'],
    notes: ['토큰 수정 후에는 package build로 `lib/tokens.css` 재생성이 필요하다.'],
    dos: ['React 환경에서는 provider와 global style을 같이 쓴다.', 'CSS-only 환경에서는 `@ingradient/ui/tokens.css`를 import한다.'],
    donts: ['generated `lib/tokens.css`를 직접 수정하지 않는다.'],
    status: 'ready',
  },
  {
    id: 'brand',
    section: 'foundations',
    group: 'brand',
    title: 'Brand',
    summary: '공식 로고, 파비콘, mark/logo usage를 하나의 공용 진입점에서 제공한다.',
    whenToUse: 'sidebar, auth, docs header, favicon, product header에 일관된 브랜드 자산이 필요할 때 사용한다.',
    whenNotToUse: '임의 이니셜 텍스트나 feature별 별도 로고를 같은 목적에 쓰지 않는다.',
    importPath: foundationImports.brand,
    examples: [{ title: 'Official brand assets', description: 'BrandMark, BrandLogo, multiple logo sizes.', component: BrandDemo }],
    states: ['mark', 'logo', 'favicon'],
    props: [
      { name: 'size', type: 'number', required: false, defaultValue: '32', description: 'BrandMark 크기를 지정한다.' },
      { name: 'width', type: 'number | string', required: false, defaultValue: '160', description: 'BrandLogo 폭을 지정한다.' },
    ],
    variants: [
      { name: 'asset type', values: ['BrandMark', 'BrandLogo'], description: '정사각형 mark와 가로형 logo를 상황에 따라 선택한다.' },
    ],
    related: ['icon-gallery', 'theming'],
    notes: ['공식 브랜드 자산은 `@ingradient/ui/brand`에서만 가져온다.'],
    dos: ['좁은 영역은 BrandMark, 헤더/intro는 BrandLogo를 쓴다.'],
    donts: ['브랜드 목적에 일반 Avatar나 텍스트 이니셜을 대체로 쓰지 않는다.'],
    status: 'ready',
  },
  {
    id: 'layout-primitives',
    section: 'foundations',
    group: 'primitives',
    title: 'Layout Primitives',
    summary: 'Box, Stack, Inline, Grid, Container처럼 화면 조립의 가장 얇은 layout 단위를 설명한다.',
    whenToUse: '새 component를 만들기 전, 순수 layout 조합으로 해결 가능한지 먼저 볼 때 사용한다.',
    whenNotToUse: '화면 의미가 강한 shell이나 workflow를 primitive로 만들지 않는다.',
    importPath: foundationImports.primitives,
    examples: [{ title: 'Core layout primitives', description: 'Box, Stack, Inline, Grid, Container composition.', component: LayoutPrimitivesDemo }],
    states: ['stacked', 'inline', 'grid'],
    props: [
      { name: 'gap', type: 'number | string', required: false, description: 'Stack, Inline, Grid spacing을 지정한다.' },
      { name: 'align / justify', type: 'layout props', required: false, description: 'flex-based primitive의 정렬을 조정한다.' },
      { name: 'minItemWidth', type: 'number', required: false, description: 'Grid의 반복 최소 폭을 지정한다.' },
    ],
    variants: [
      { name: 'layout role', values: ['single box', 'stack', 'inline row', 'responsive grid', 'page container'], description: '같은 레이아웃 문제를 가장 얇은 primitive로 푼다.' },
    ],
    related: ['spacing', 'surface-primitives', 'app-shell'],
    notes: ['primitive는 재사용 가능한 최소 표현 단위여야 한다.'],
    dos: ['가능하면 pattern보다 먼저 primitive 조합으로 설계한다.'],
    donts: ['primitive에 product-specific 의미를 넣지 않는다.'],
    status: 'ready',
  },
  {
    id: 'type-primitives',
    section: 'foundations',
    group: 'primitives',
    title: 'Typography Primitives',
    summary: 'Text와 Heading은 semantic tone을 가진 가장 얇은 타이포그래피 primitive다.',
    whenToUse: '컴포넌트 안에서 본문, label, helper, heading을 빠르게 구성할 때 사용한다.',
    whenNotToUse: 'h1/h2/body 스타일을 component마다 styled tag로 새로 만들지 않는다.',
    importPath: foundationImports.primitives,
    examples: [{ title: 'Text + Heading', description: 'Semantic typography primitives and tones.', component: TypographyPrimitivesDemo }],
    states: ['primary', 'secondary', 'muted', 'accent'],
    props: [
      { name: 'size', type: 'string', required: false, description: 'Text 크기를 조절한다.' },
      { name: 'tone', type: 'semantic tone', required: false, description: 'text 색상 역할을 semantic하게 지정한다.' },
      { name: 'level', type: '1 | 2 | 3', required: true, description: 'Heading 계층을 지정한다.' },
    ],
    variants: [
      { name: 'tone', values: ['primary', 'secondary', 'muted', 'soft', 'accent'], description: '같은 primitive에서 semantic text role을 바꾼다.' },
    ],
    related: ['typography', 'layout-primitives'],
    notes: ['타이포그래피 primitive는 token layer를 직접 노출하지 않고 semantic usage를 제공한다.'],
    dos: ['tone과 level을 이용해 위계를 만든다.'],
    donts: ['같은 역할의 텍스트 스타일을 feature마다 새로 만들지 않는다.'],
    status: 'ready',
  },
  {
    id: 'surface-primitives',
    section: 'foundations',
    group: 'primitives',
    title: 'Surface Primitives',
    summary: 'Surface는 panel, raised, card elevation을 공통 규칙으로 제공하는 기본 블록이다.',
    whenToUse: '카드, shell section, floating block, docs module의 기본 배경이 필요할 때 사용한다.',
    whenNotToUse: 'layer 의미가 강한 dialog shell 전체를 primitive 하나로 해결하려 하지 않는다.',
    importPath: foundationImports.primitives,
    examples: [{ title: 'Surface elevations', description: 'Surface primitive with panel, raised, and card elevation.', component: SurfacePrimitivesDemo }],
    states: ['panel', 'raised', 'card'],
    props: [
      { name: 'elevation', type: "'panel' | 'raised' | 'card'", required: false, defaultValue: 'panel', description: 'surface tone과 shadow 계층을 고른다.' },
      { name: 'style / className', type: 'standard props', required: false, description: 'size와 layout만 최소 범위에서 추가한다.' },
    ],
    variants: [
      { name: 'elevation', values: ['panel', 'raised', 'card'], description: 'surface 위계를 공통 단어로 통일한다.' },
    ],
    related: ['backgrounds', 'card', 'dialog'],
    notes: ['복잡한 surface recipe는 components/patterns에서 조합하고, primitive는 가장 얇게 유지한다.'],
    dos: ['surface 위계를 primitive에서 시작한다.'],
    donts: ['surface마다 다른 shadow/border literal을 component에서 반복하지 않는다.'],
    status: 'ready',
  },
]
