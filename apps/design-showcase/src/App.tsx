import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { BrandLogo, BrandMark } from '@ingradient/ui/brand'
import { IngradientGlobalStyle, IngradientThemeProvider } from '@ingradient/ui/tokens'
import { Badge, Button, Chip } from '@ingradient/ui/components'
import { Container, Grid, Heading, Inline, Stack, Surface, Text } from '@ingradient/ui/primitives'
import {
  docEntries,
  findEntry,
  getEntriesBySection,
  getEntryMap,
  getEntryPath,
  getGroupsBySection,
  groupLabels,
  sectionLabels,
  sectionOrder,
  type DocEntry,
} from './docs'

const AppFrame = styled.div`
  min-height: 100%;
  background:
    radial-gradient(circle at top left, rgba(77, 136, 255, 0.16), transparent 24%),
    radial-gradient(circle at 80% 12%, rgba(53, 198, 167, 0.12), transparent 22%),
    linear-gradient(180deg, rgba(10, 14, 20, 0.98) 0%, rgba(8, 11, 16, 1) 100%);
`

const Layout = styled.div`
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  min-height: 100vh;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`

const Sidebar = styled.aside`
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: auto;
  padding: 28px 22px 28px 28px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  background:
    linear-gradient(180deg, rgba(9, 12, 18, 0.98) 0%, rgba(8, 11, 16, 0.96) 100%);

  @media (max-width: 980px) {
    position: static;
    height: auto;
    border-right: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
`

const SidebarBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 28px;
`

const SidebarCopy = styled.p`
  margin: 0;
  font-size: 13px;
  color: var(--ig-color-text-muted);
  line-height: 1.55;
`

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  &:not(:last-child) {
    margin-bottom: 22px;
  }
`

const NavHeading = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: var(--ig-color-text-soft);
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const NavGroupLabel = styled.div`
  margin-top: 4px;
  font-size: 11px;
  color: var(--ig-color-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  color: var(--ig-color-text-muted);
  text-decoration: none;
  transition:
    background-color 0.16s ease,
    color 0.16s ease,
    border-color 0.16s ease;
  border: 1px solid transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: var(--ig-color-text-primary);
  }

  &.active {
    background: rgba(77, 136, 255, 0.14);
    border-color: rgba(77, 136, 255, 0.28);
    color: var(--ig-color-text-primary);
  }
`

const Main = styled.main`
  min-width: 0;
  padding: 32px;

  @media (max-width: 980px) {
    padding: 22px 16px 28px;
  }
`

const Hero = styled.div`
  padding: 24px 0 18px;
`

const HeroLead = styled.p`
  max-width: 840px;
  margin: 12px 0 0;
  color: var(--ig-color-text-secondary);
  line-height: 1.7;
`

const ContentCard = styled(Surface)`
  padding: 24px;
  border-radius: 28px;
`

const SectionCardLink = styled(Link)`
  display: block;
  text-decoration: none;
`

const ExampleCard = styled(Surface)`
  padding: 22px;
  border-radius: 24px;
`

const MetaLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: var(--ig-color-text-soft);
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const CodeBlock = styled.pre`
  margin: 0;
  padding: 16px 18px;
  border-radius: 18px;
  overflow: auto;
  border: 1px solid var(--ig-color-border-subtle);
  background: rgba(3, 6, 10, 0.56);
  color: var(--ig-color-text-primary);
  font-size: 13px;
  line-height: 1.6;
`

const DocTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    text-align: left;
    vertical-align: top;
    padding: 12px 14px;
    border-bottom: 1px solid var(--ig-color-border-subtle);
  }

  th {
    font-size: 12px;
    color: var(--ig-color-text-soft);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
`

const ColumnList = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: var(--ig-color-text-secondary);
  line-height: 1.65;
`

const EmptyDocState = styled.div`
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px dashed var(--ig-color-border-subtle);
  color: var(--ig-color-text-muted);
  background: rgba(255, 255, 255, 0.02);
`

function OverviewPage() {
  const recentEntries = docEntries.slice(-6)
  return (
    <Stack gap={24}>
      <Hero>
        <Inline gap={10}>
          <BrandMark size={28} />
          <Badge $tone="accent">Ingradient UI</Badge>
          <Chip>MUI-style docs</Chip>
          <Chip>Registry driven</Chip>
        </Inline>
        <Heading level={1} style={{ marginTop: 14 }}>
          Generic UI system for Ingradient products
        </Heading>
        <HeroLead>
          `@ingradient/ui` owns reusable tokens, primitives, components, and patterns. Product apps consume those
          building blocks, and this docs app catalogs the public API only.
        </HeroLead>
      </Hero>

      <Grid minItemWidth={220} gap={16}>
        {sectionOrder.map((section) => {
          const firstEntry = getEntriesBySection(section)[0]
          return (
            <SectionCardLink key={section} to={firstEntry ? getEntryPath(firstEntry) : '/'}>
              <ContentCard elevation="card">
                <Stack gap={10}>
                  <Text size="12px" tone="soft" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {sectionLabels[section]}
                  </Text>
                  <Heading level={3}>{getEntriesBySection(section).length}</Heading>
                  <Text tone="secondary" style={{ display: 'block' }}>
                    {section === 'foundations'
                      ? 'Tokens, typography, spacing, and theming.'
                      : section === 'components'
                        ? 'Categorized inputs, data display, feedback, surfaces, navigation, and overlays.'
                        : 'Reusable layout and composition patterns.'}
                  </Text>
                </Stack>
              </ContentCard>
            </SectionCardLink>
          )
        })}
      </Grid>

      <ContentCard elevation="panel">
        <Stack gap={16}>
          <Inline gap={10} justify="space-between" align="center">
            <Heading level={3}>Recently Added</Heading>
            <Link to={getEntryPath(docEntries[0])} style={{ textDecoration: 'none' }}>
              <Button type="button" variant="secondary">
                Start with Foundations
              </Button>
            </Link>
          </Inline>
          <Grid minItemWidth={220} gap={14}>
            {recentEntries.map((entry) => (
              <SectionCardLink key={entry.id} to={getEntryPath(entry)}>
                <Surface elevation="panel" style={{ padding: 18, borderRadius: 22 }}>
                  <Stack gap={8}>
                    <Text size="12px" tone="soft" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {sectionLabels[entry.section]}
                    </Text>
                    <Text size="16px" weight={700}>
                      {entry.title}
                    </Text>
                    <Text tone="secondary" style={{ display: 'block' }}>
                      {entry.summary}
                    </Text>
                  </Stack>
                </Surface>
              </SectionCardLink>
            ))}
          </Grid>
        </Stack>
      </ContentCard>
    </Stack>
  )
}

function EntryPage({ entry }: { entry: DocEntry }) {
  const relatedMap = getEntryMap()
  return (
    <Stack gap={20}>
      <Hero>
        <Inline gap={10}>
          <Badge $tone="accent">{sectionLabels[entry.section]}</Badge>
          {entry.group ? <Chip>{groupLabels[entry.group] ?? entry.group}</Chip> : null}
          <Chip>{entry.status}</Chip>
        </Inline>
        <Heading level={1} style={{ marginTop: 14 }}>
          {entry.title}
        </Heading>
        <HeroLead>{entry.summary}</HeroLead>
      </Hero>

      <ContentCard elevation="raised">
        <Stack gap={18}>
          <MetaLabel>What it is</MetaLabel>
          <Text tone="secondary" style={{ display: 'block' }}>
            {entry.summary}
          </Text>
        </Stack>
      </ContentCard>

      <Grid minItemWidth={320} gap={16}>
        <ContentCard elevation="panel">
          <Stack gap={12}>
            <MetaLabel>When to use</MetaLabel>
            <Text tone="secondary" style={{ display: 'block' }}>
              {entry.whenToUse}
            </Text>
          </Stack>
        </ContentCard>
        <ContentCard elevation="panel">
          <Stack gap={12}>
            <MetaLabel>When not to use</MetaLabel>
            <Text tone="secondary" style={{ display: 'block' }}>
              {entry.whenNotToUse ?? '이 페이지의 기본 컴포넌트가 표현 계층을 넘어 business workflow를 직접 소유하게 만들지 않는다.'}
            </Text>
          </Stack>
        </ContentCard>
      </Grid>

      <ContentCard elevation="panel">
        <Stack gap={12}>
          <MetaLabel>Import</MetaLabel>
          <CodeBlock>
            <code>{entry.importPath}</code>
          </CodeBlock>
        </Stack>
      </ContentCard>

      <Stack gap={16}>
        <MetaLabel>Live examples</MetaLabel>
        {entry.examples.map((example) => {
          const Example = example.component
          return (
            <ExampleCard key={example.title} elevation="raised">
              <Stack gap={16}>
                <Stack gap={6}>
                  <Heading level={3}>{example.title}</Heading>
                  {example.description ? (
                    <Text tone="secondary" style={{ display: 'block' }}>
                      {example.description}
                    </Text>
                  ) : null}
                </Stack>
                <Example />
              </Stack>
            </ExampleCard>
          )
        })}
      </Stack>

      <Grid minItemWidth={280} gap={16}>
        <ContentCard elevation="panel">
          <Stack gap={12}>
            <MetaLabel>Variants</MetaLabel>
            {entry.variants.length > 0 ? (
              <DocTable>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Values</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.variants.map((variant) => (
                    <tr key={variant.name}>
                      <td>
                        <Text weight={700}>{variant.name}</Text>
                      </td>
                      <td>
                        <Text tone="secondary" style={{ display: 'block' }}>
                          {variant.values.join(', ')}
                        </Text>
                      </td>
                      <td>
                        <Text tone="secondary" style={{ display: 'block' }}>
                          {variant.description}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DocTable>
            ) : (
              <EmptyDocState>No documented variants yet.</EmptyDocState>
            )}
          </Stack>
        </ContentCard>

        <ContentCard elevation="panel">
          <Stack gap={12}>
            <MetaLabel>States</MetaLabel>
            <Inline gap={10} wrap="wrap">
              {entry.states.map((state) => (
                <Badge key={state} $tone="neutral">
                  {state}
                </Badge>
              ))}
            </Inline>
          </Stack>
        </ContentCard>
      </Grid>

      <ContentCard elevation="panel">
        <Stack gap={12}>
          <MetaLabel>Props / parameters</MetaLabel>
          {entry.props.length > 0 ? (
            <DocTable>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {entry.props.map((prop) => (
                  <tr key={prop.name}>
                    <td>
                      <Text weight={700}>{prop.name}</Text>
                    </td>
                    <td>
                      <Text tone="secondary" style={{ display: 'block' }}>
                        {prop.type}
                      </Text>
                    </td>
                    <td>
                      <Text tone={prop.required ? 'accent' : 'muted'} style={{ display: 'block' }}>
                        {prop.required ? 'Yes' : 'No'}
                      </Text>
                    </td>
                    <td>
                      <Text tone="secondary" style={{ display: 'block' }}>
                        {prop.defaultValue ?? '—'}
                      </Text>
                    </td>
                    <td>
                      <Text tone="secondary" style={{ display: 'block' }}>
                        {prop.description}
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DocTable>
          ) : (
            <EmptyDocState>No documented props yet.</EmptyDocState>
          )}
        </Stack>
      </ContentCard>

      <Grid minItemWidth={280} gap={16}>
        <ContentCard elevation="panel">
          <Stack gap={12}>
            <MetaLabel>Related components</MetaLabel>
            <Stack gap={8}>
              {entry.related.map((relatedId) => {
                const relatedEntry = relatedMap.get(relatedId)
                return relatedEntry ? (
                  <Link key={relatedId} to={getEntryPath(relatedEntry)} style={{ textDecoration: 'none' }}>
                    <Text tone="accent" style={{ display: 'block' }}>
                      {relatedEntry.title}
                    </Text>
                  </Link>
                ) : null
              })}
            </Stack>
          </Stack>
        </ContentCard>
        <ContentCard elevation="panel">
          <Stack gap={12}>
            <MetaLabel>Notes</MetaLabel>
            <ColumnList>
              {entry.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ColumnList>
          </Stack>
        </ContentCard>
      </Grid>

      <Grid minItemWidth={320} gap={16}>
        <ContentCard elevation="panel">
          <Stack gap={12}>
            <MetaLabel>Do</MetaLabel>
            <ColumnList>
              {entry.dos.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ColumnList>
          </Stack>
        </ContentCard>
        <ContentCard elevation="panel">
          <Stack gap={12}>
            <MetaLabel>Don’t</MetaLabel>
            <ColumnList>
              {entry.donts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ColumnList>
          </Stack>
        </ContentCard>
      </Grid>
    </Stack>
  )
}

function FoundationsRoute() {
  const { topic } = useParams<{ topic: string }>()
  const entry = topic ? findEntry('foundations', topic) : null
  return entry ? <EntryPage entry={entry} /> : <Navigate to="/" replace />
}

function ComponentsRoute() {
  const { group, componentId } = useParams<{ group: string; componentId: string }>()
  const entry = group && componentId ? findEntry('components', componentId, group as DocEntry['group']) : null
  return entry ? <EntryPage entry={entry} /> : <Navigate to="/" replace />
}

function PatternsRoute() {
  const { patternId } = useParams<{ patternId: string }>()
  const entry = patternId ? findEntry('patterns', patternId) : null
  return entry ? <EntryPage entry={entry} /> : <Navigate to="/" replace />
}

function DocsSidebar() {
  const foundationEntries = getEntriesBySection('foundations')
  const patternEntries = getEntriesBySection('patterns')
  const foundationGroups = getGroupsBySection('foundations')
  const componentGroups = getGroupsBySection('components')
  const patternGroups = getGroupsBySection('patterns')

  return (
    <Sidebar>
      <SidebarBrand>
        <Inline gap={12} align="center">
          <BrandMark size={28} />
          <Badge $tone="accent">Ingradient UI Docs</Badge>
        </Inline>
        <BrandLogo width={172} />
        <SidebarCopy>MUI-style documentation structure for the `@ingradient/ui` public API only.</SidebarCopy>
      </SidebarBrand>

      <NavSection>
        <NavItem to="/" end>
          <span>Overview</span>
        </NavItem>
      </NavSection>

      <NavSection>
        <NavHeading>Foundations</NavHeading>
        {foundationGroups.map((group) => (
          <Stack key={group} gap={6}>
            <NavGroupLabel>{groupLabels[group] ?? group}</NavGroupLabel>
            {foundationEntries
              .filter((entry) => entry.group === group)
              .map((entry) => (
                <NavItem key={entry.id} to={getEntryPath(entry)}>
                  <span>{entry.title}</span>
                </NavItem>
              ))}
          </Stack>
        ))}
      </NavSection>

      <NavSection>
        <NavHeading>Components</NavHeading>
        {componentGroups.map((group) => (
          <Stack key={group} gap={6}>
            <NavGroupLabel>{groupLabels[group] ?? group}</NavGroupLabel>
            {getEntriesBySection('components')
              .filter((entry) => entry.group === group)
              .map((entry) => (
                <NavItem key={entry.id} to={getEntryPath(entry)}>
                  <span>{entry.title}</span>
                </NavItem>
              ))}
          </Stack>
        ))}
      </NavSection>

      <NavSection>
        <NavHeading>Patterns</NavHeading>
        {patternGroups.map((group) => (
          <Stack key={group} gap={6}>
            <NavGroupLabel>{groupLabels[group] ?? group}</NavGroupLabel>
            {patternEntries
              .filter((entry) => entry.group === group)
              .map((entry) => (
                <NavItem key={entry.id} to={getEntryPath(entry)}>
                  <span>{entry.title}</span>
                </NavItem>
              ))}
          </Stack>
        ))}
      </NavSection>
    </Sidebar>
  )
}

function DocsApp() {
  return (
    <AppFrame>
      <Layout>
        <DocsSidebar />
        <Main>
          <Container maxWidth={1240} padding={0}>
            <Routes>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/foundations/:topic" element={<FoundationsRoute />} />
              <Route path="/components/:group/:componentId" element={<ComponentsRoute />} />
              <Route path="/patterns/:patternId" element={<PatternsRoute />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </Main>
      </Layout>
    </AppFrame>
  )
}

export function App() {
  return (
    <IngradientThemeProvider>
      <IngradientGlobalStyle />
      <BrowserRouter>
        <DocsApp />
      </BrowserRouter>
    </IngradientThemeProvider>
  )
}
