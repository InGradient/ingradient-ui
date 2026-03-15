import { useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { PortalGlobalStyle } from '@ingradient/design-tokens'
import {
  PortalPageContent,
  PortalPageHeader,
  PortalPageHeaderRow,
  PortalPageShell,
  PortalPageSubtitle,
  PortalPageTitle,
  PortalPageTitleBlock,
  PortalPanel,
  PortalPanelHeader,
  PortalPanelHint,
  PortalPanelTitle,
  PortalSectionTitle,
} from '@ingradient/portal-patterns'
import {
  PortalButton,
  PortalCompactModalCard,
  PortalDropdownSelect,
  PortalEmptyState,
  PortalInput,
  PortalLoadingState,
  PortalModalActions,
  PortalModalBackdrop,
  PortalModalTitle,
  PortalStatusPill,
  PortalTextarea,
  ThemeProvider,
  portalAccentButton,
  portalGhostButton,
} from '@ingradient/ui'
import { SelectionBar, UploadDropzone, VirtualizedImageGrid, type ImageItem, type UploadFileState } from '@ingradient/gallery-ui'

const Page = styled(PortalPageShell)`
  min-height: 100%;
`

const Header = styled(PortalPageHeader)``
const HeaderRow = styled(PortalPageHeaderRow)``
const TitleBlock = styled(PortalPageTitleBlock)``
const Title = styled(PortalPageTitle)``
const Subtitle = styled(PortalPageSubtitle)`
  max-width: 760px;
`

const Content = styled(PortalPageContent)`
  overflow: auto;
`

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 18px;
`

const Section = styled(PortalPanel)`
  min-height: 0;
`

const SectionHeader = styled(PortalPanelHeader)``
const SectionTitle = styled(PortalPanelTitle)``
const SectionHint = styled(PortalPanelHint)``

const Body = styled.div`
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const TokenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
`

const TokenCard = styled.div`
  border-radius: 16px;
  border: 1px solid var(--portal-border);
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;
`

const TokenSwatch = styled.div<{ $background: string }>`
  height: 72px;
  background: ${(p) => p.$background};
`

const TokenMeta = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const TokenName = styled.span`
  font-size: 12px;
  color: var(--portal-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const TokenValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--portal-text-primary);
`

const PrimitiveStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
`

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const Toolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) auto;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--portal-border);
  background: rgba(8, 12, 18, 0.84);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

const ToolbarActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
  min-width: 0;

  @media (max-width: 760px) {
    justify-content: flex-start;
  }
`

const GhostToolbarButton = styled.button`
  ${portalGhostButton}
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
`

const AccentToolbarButton = styled.button`
  ${portalAccentButton}
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
`

const SplitPreview = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 250px) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  min-width: 0;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const SidebarPreview = styled.div`
  border-radius: 20px;
  border: 1px solid var(--portal-border);
  background: rgba(255, 255, 255, 0.03);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`

const SidebarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 900px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
`

const SidebarItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid ${(p) => (p.$active ? 'rgba(91, 144, 255, 0.42)' : 'transparent')};
  background: ${(p) => (p.$active ? 'rgba(77, 136, 255, 0.14)' : 'rgba(255, 255, 255, 0.02)')};
  color: var(--portal-text-primary);
  text-align: left;
`

const templateCard = css`
  border-radius: 18px;
  border: 1px solid var(--portal-border);
  background: rgba(255, 255, 255, 0.03);
`

const TemplateShell = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 14px;
  min-width: 0;
`

const PatternHero = styled.div`
  ${templateCard}
  padding: 18px;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 14px;
  align-items: stretch;
  min-width: 0;

  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
  }
`

const PatternHeroMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
`

const PatternHeroEyebrow = styled.span`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--portal-accent-soft);
  overflow-wrap: anywhere;
`

const PatternHeroTitle = styled.h4`
  margin: 0;
  font-size: 22px;
  line-height: 1.1;
  letter-spacing: -0.03em;
  overflow-wrap: anywhere;
`

const PatternHeroSummary = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--portal-text-secondary);
`

const PatternMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  min-width: 0;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

const MetricCard = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(255, 255, 255, 0.03);
  padding: 16px;
  display: grid;
  gap: 6px;
  min-width: 0;
`

const MetricValue = styled.strong`
  font-size: 24px;
  letter-spacing: -0.03em;
`

const MetricLabel = styled.span`
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--portal-text-soft);
`

const PatternRules = styled.div`
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: linear-gradient(180deg, rgba(16, 21, 30, 0.96) 0%, rgba(10, 14, 20, 0.96) 100%);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
`

const PatternRulesTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--portal-text-soft);
  overflow-wrap: anywhere;
`

const PatternRuleList = styled.div`
  display: grid;
  gap: 10px;
`

const PatternRule = styled.div`
  padding-left: 14px;
  position: relative;
  font-size: 13px;
  line-height: 1.55;
  color: var(--portal-text-secondary);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.55em;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--portal-accent);
    box-shadow: 0 0 0 4px rgba(77, 136, 255, 0.12);
  }
`

const GalleryPreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const GalleryFrame = styled.div`
  padding: 14px;
  border-radius: 20px;
  border: 1px solid var(--portal-border);
  background: rgba(7, 10, 15, 0.86);
`

const GalleryToolbarInput = styled(PortalInput)`
  max-width: 260px;
`

const Note = styled.p`
  margin: 0;
  font-size: 13px;
  color: var(--portal-text-muted);
`

const SummaryCard = styled.div`
  ${templateCard}
  padding: 18px;
  display: grid;
  gap: 8px;
`

const SummaryValue = styled.strong`
  font-size: 28px;
  letter-spacing: -0.03em;
`

const SummaryLabel = styled.span`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--portal-text-soft);
`

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  min-width: 0;
`

const TOKENS = [
  { name: 'Accent', value: '#4d88ff', background: 'linear-gradient(135deg, #4d88ff 0%, #2962d9 100%)' },
  { name: 'Surface', value: 'rgba(12, 15, 20, 0.8)', background: 'rgba(12, 15, 20, 0.8)' },
  { name: 'Elevated', value: '#10151d', background: '#10151d' },
  { name: 'Success', value: '#35c6a7', background: '#35c6a7' },
  { name: 'Warning', value: '#ffd179', background: '#ffd179' },
  { name: 'Danger', value: '#ff9a9a', background: '#ff9a9a' },
]

function makeImageSvg(label: string, fillA: string, fillB: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${fillA}" />
          <stop offset="100%" stop-color="${fillB}" />
        </linearGradient>
      </defs>
      <rect width="640" height="640" rx="48" fill="url(#g)" />
      <circle cx="176" cy="190" r="74" fill="rgba(255,255,255,0.18)" />
      <path d="M86 470 246 286l102 116 68-82 138 150H86Z" fill="rgba(8,10,14,0.32)" />
      <text x="50%" y="83%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="IBM Plex Sans, Segoe UI, sans-serif" font-size="44" font-weight="700">${label}</text>
    </svg>`
  )}`
}

const MOCK_ITEMS: ImageItem[] = [
  ['A-001', 'Representative', '#2a63d7', '#6da9ff'],
  ['A-002', 'Detail left', '#1f7665', '#49c6a1'],
  ['A-003', 'Detail right', '#7943d5', '#bf90ff'],
  ['B-001', 'Panel macro', '#8f3b34', '#f08a7b'],
  ['B-002', 'Panel edge', '#8d6d24', '#ffd87b'],
  ['C-001', 'Module front', '#224f86', '#76d5f3'],
  ['C-002', 'Module back', '#2b394f', '#788ca6'],
  ['D-001', 'Template shot', '#4f3c69', '#d3a5ff'],
].map(([id, name, fillA, fillB]) => ({
  id,
  name,
  thumb_url: makeImageSvg(name, fillA, fillB),
  preview_url: makeImageSvg(name, fillA, fillB),
  original_url: makeImageSvg(name, fillA, fillB),
  width: 640,
  height: 640,
}))

const GROUP_COUNTS: Record<string, number> = {
  'A-001': 5,
  'B-001': 3,
  'C-001': 4,
}

export function App() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['A-001']))
  const [showModal, setShowModal] = useState(false)
  const [selectedPrimitiveTask, setSelectedPrimitiveTask] = useState('classification')
  const lastSelectedIndexRef = useRef<number | null>(0)
  const uploads = useMemo<UploadFileState[]>(
    () => [
      { file: new File(['demo'], 'catalog_sheet.png', { type: 'image/png' }), done: true, progress: 100 },
      { file: new File(['demo'], 'detail_plate.png', { type: 'image/png' }), done: true, progress: 100 },
      { file: new File(['demo'], 'desktop.ini', { type: 'text/plain' }), error: 'Skipped non-image file' },
    ],
    []
  )

  return (
    <ThemeProvider>
      <PortalGlobalStyle />
      <Page>
        <Header>
          <HeaderRow>
            <TitleBlock>
              <Title>Portal Design System Showcase</Title>
              <Subtitle>
                Tokens, primitives, portal patterns, and gallery surfaces rendered from reusable packages only.
              </Subtitle>
            </TitleBlock>
            <ButtonRow>
              <PortalButton type="button" onClick={() => setShowModal(true)}>
                Open Modal
              </PortalButton>
              <PortalButton type="button" $variant="ghost">
                Documentation
              </PortalButton>
            </ButtonRow>
          </HeaderRow>
        </Header>
        <Content>
          <SectionGrid>
            <Section>
              <SectionHeader>
                <SectionTitle>Tokens</SectionTitle>
                <SectionHint>Shared color, surface, and motion language.</SectionHint>
              </SectionHeader>
              <Body>
                <TokenGrid>
                  {TOKENS.map((token) => (
                    <TokenCard key={token.name}>
                      <TokenSwatch $background={token.background} />
                      <TokenMeta>
                        <TokenName>{token.name}</TokenName>
                        <TokenValue>{token.value}</TokenValue>
                      </TokenMeta>
                    </TokenCard>
                  ))}
                </TokenGrid>
                <SummaryGrid>
                  <SummaryCard>
                    <SummaryLabel>Typography</SummaryLabel>
                    <SummaryValue>IBM Plex Sans</SummaryValue>
                    <Note>Default body typeface from the global design-token layer.</Note>
                  </SummaryCard>
                  <SummaryCard>
                    <SummaryLabel>Elevation</SummaryLabel>
                    <SummaryValue>20px / 60px</SummaryValue>
                    <Note>Shared panel shadow and modal depth align with the portal shell.</Note>
                  </SummaryCard>
                </SummaryGrid>
              </Body>
            </Section>

            <Section>
              <SectionHeader>
                <SectionTitle>Primitives</SectionTitle>
                <SectionHint>Buttons, fields, pills, loading, and empty states.</SectionHint>
              </SectionHeader>
              <Body>
                <PrimitiveStack>
                  <PortalSectionTitle>Buttons</PortalSectionTitle>
                  <ButtonRow>
                    <PortalButton type="button">Primary</PortalButton>
                    <PortalButton type="button" $variant="ghost">
                      Ghost
                    </PortalButton>
                    <PortalButton type="button" $variant="accent">
                      Accent
                    </PortalButton>
                  </ButtonRow>
                </PrimitiveStack>
                <PrimitiveStack>
                  <PortalSectionTitle>Inputs</PortalSectionTitle>
                  <FormGrid>
                    <PortalInput placeholder="Search images" />
                    <PortalDropdownSelect
                      value={selectedPrimitiveTask}
                      onChange={setSelectedPrimitiveTask}
                      options={[
                        {
                          value: 'classification',
                          label: 'Classification',
                          description: 'Single-label image recognition pipeline.',
                        },
                        {
                          value: 'detection',
                          label: 'Object detection',
                          description: 'Bounding-box based labeling and inference.',
                        },
                      ]}
                    />
                    <PortalTextarea rows={3} placeholder="Design system notes" />
                  </FormGrid>
                </PrimitiveStack>
                <PrimitiveStack>
                  <PortalSectionTitle>Status</PortalSectionTitle>
                  <BadgeRow>
                    <PortalStatusPill $tone="running">Running</PortalStatusPill>
                    <PortalStatusPill $tone="completed">Completed</PortalStatusPill>
                    <PortalStatusPill $tone="queued">Queued</PortalStatusPill>
                    <PortalStatusPill $tone="warning">Warning</PortalStatusPill>
                    <PortalStatusPill $tone="failed">Failed</PortalStatusPill>
                  </BadgeRow>
                </PrimitiveStack>
                <PrimitiveStack>
                  <PortalSectionTitle>Feedback</PortalSectionTitle>
                  <PortalLoadingState>Loading surface for package consumers.</PortalLoadingState>
                  <PortalEmptyState>No results. Filters and data hooks stay outside the package.</PortalEmptyState>
                </PrimitiveStack>
              </Body>
            </Section>

            <Section>
              <SectionHeader>
                <SectionTitle>Patterns</SectionTitle>
                <SectionHint>Page shell, toolbar, panel, and split layouts.</SectionHint>
              </SectionHeader>
              <Body>
                <Toolbar>
                  <GalleryToolbarInput placeholder="Search catalog..." />
                  <ToolbarActions>
                    <GhostToolbarButton type="button">Filter</GhostToolbarButton>
                    <GhostToolbarButton type="button">Sort</GhostToolbarButton>
                    <AccentToolbarButton type="button">New Dataset</AccentToolbarButton>
                  </ToolbarActions>
                </Toolbar>
                <SplitPreview>
                  <SidebarPreview>
                    <PortalSectionTitle>Datasets</PortalSectionTitle>
                    <SidebarList>
                      <SidebarItem $active>
                        <span>Assembly v2</span>
                        <PortalStatusPill $tone="completed">256</PortalStatusPill>
                      </SidebarItem>
                      <SidebarItem>
                        <span>Reference Parts</span>
                        <PortalStatusPill $tone="queued">84</PortalStatusPill>
                      </SidebarItem>
                      <SidebarItem>
                        <span>Incoming QC</span>
                        <PortalStatusPill $tone="warning">13</PortalStatusPill>
                      </SidebarItem>
                    </SidebarList>
                  </SidebarPreview>
                  <TemplateShell>
                    <PatternHero>
                      <PatternHeroMain>
                        <PatternHeroEyebrow>Catalog Shell</PatternHeroEyebrow>
                        <PatternHeroTitle>Toolbar, sidebar, metrics, and content need a stable reading order.</PatternHeroTitle>
                        <PatternHeroSummary>
                          This preview now prioritizes the main workspace first, then supporting metrics, while the dataset rail collapses cleanly below on narrower widths.
                        </PatternHeroSummary>
                        <SummaryGrid>
                          <SummaryCard>
                            <SummaryLabel>Groups</SummaryLabel>
                            <SummaryValue>256</SummaryValue>
                            <Note>Summary tiles stay readable and keep the same surface language as real portal panels.</Note>
                          </SummaryCard>
                          <SummaryCard>
                            <SummaryLabel>Images</SummaryLabel>
                            <SummaryValue>1,022</SummaryValue>
                            <Note>Dense counts remain separate from structural navigation instead of fighting for the same row.</Note>
                          </SummaryCard>
                        </SummaryGrid>
                      </PatternHeroMain>
                      <PatternRules>
                        <PatternRulesTitle>Reflow Rules</PatternRulesTitle>
                        <PatternRuleList>
                          <PatternRule>The action toolbar collapses into two rows before controls start clipping.</PatternRule>
                          <PatternRule>Dataset navigation becomes a responsive card grid once the left rail no longer has enough width.</PatternRule>
                          <PatternRule>Metrics stay attached to the main content block so the reading order remains obvious on tablet and mobile.</PatternRule>
                        </PatternRuleList>
                      </PatternRules>
                    </PatternHero>
                    <Section>
                      <SectionHeader>
                        <SectionTitle>Catalog Template</SectionTitle>
                        <SectionHint>Composable slots only. Data logic stays in apps.</SectionHint>
                      </SectionHeader>
                      <Body>
                        <PatternMetrics>
                          <MetricCard>
                            <MetricLabel>Primary Canvas</MetricLabel>
                            <MetricValue>1.2fr</MetricValue>
                            <Note>Main content gets priority width before supporting rails.</Note>
                          </MetricCard>
                          <MetricCard>
                            <MetricLabel>Rail Width</MetricLabel>
                            <MetricValue>220-260px</MetricValue>
                            <Note>Sidebar stays compact on desktop and drops into the document flow on narrower screens.</Note>
                          </MetricCard>
                        </PatternMetrics>
                        <Note>
                          `@ingradient/portal-patterns` owns the shell, panels, and spacing. This showcase layout is now arranged to demonstrate how those pieces reflow instead of just sitting side by side.
                        </Note>
                      </Body>
                    </Section>
                  </TemplateShell>
                </SplitPreview>
              </Body>
            </Section>

            <Section>
              <SectionHeader>
                <SectionTitle>Templates</SectionTitle>
                <SectionHint>`gallery-ui` consuming the same token and primitive layer.</SectionHint>
              </SectionHeader>
              <Body>
                <GalleryPreview>
                  <GalleryFrame>
                    <SelectionBar
                      selectedCount={selectedIds.size}
                      totalCount={MOCK_ITEMS.length}
                      loadedCount={MOCK_ITEMS.length}
                      itemLabel="images"
                      onClearSelection={() => setSelectedIds(new Set())}
                      onDelete={() => setSelectedIds(new Set())}
                      onSelectAll={() => setSelectedIds(new Set(MOCK_ITEMS.map((item) => item.id)))}
                      onUploadClick={() => undefined}
                      leftOfCount={<PortalSectionTitle style={{ margin: 0 }}>Gallery UI</PortalSectionTitle>}
                    />
                  </GalleryFrame>
                  <GalleryFrame>
                    <UploadDropzone onFiles={() => undefined} uploads={uploads} onRetry={() => undefined} />
                  </GalleryFrame>
                  <GalleryFrame>
                    <VirtualizedImageGrid
                      items={MOCK_ITEMS}
                      selectedIds={selectedIds}
                      highlightedImageId="B-001"
                      onSelectionChange={(action, id, rangeStartId) => {
                        const next = new Set(selectedIds)
                        if (action === 'single') {
                          next.clear()
                          next.add(id)
                        } else if (action === 'toggle') {
                          if (next.has(id)) next.delete(id)
                          else next.add(id)
                        } else {
                          const startIndex = MOCK_ITEMS.findIndex((item) => item.id === (rangeStartId ?? id))
                          const endIndex = MOCK_ITEMS.findIndex((item) => item.id === id)
                          next.clear()
                          const [from, to] = startIndex <= endIndex ? [startIndex, endIndex] : [endIndex, startIndex]
                          MOCK_ITEMS.slice(from, to + 1).forEach((item) => next.add(item.id))
                        }
                        setSelectedIds(next)
                      }}
                      onLoadMore={() => undefined}
                      hasMore={false}
                      isLoading={false}
                      lastSelectedIndexRef={lastSelectedIndexRef}
                      showFilenameBelow
                      groupCount={(item) => GROUP_COUNTS[item.id] ?? 1}
                    />
                  </GalleryFrame>
                </GalleryPreview>
              </Body>
            </Section>
          </SectionGrid>
        </Content>
      </Page>
      {showModal && (
        <PortalModalBackdrop onClick={() => setShowModal(false)}>
          <PortalCompactModalCard onClick={(e) => e.stopPropagation()}>
            <PortalModalTitle>Portal Modal Primitive</PortalModalTitle>
            <Note>This surface now comes from `@ingradient/ui`, so every project can reuse the same confirmation/dialog styling.</Note>
            <PortalModalActions>
              <PortalButton type="button" $variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </PortalButton>
              <PortalButton type="button" onClick={() => setShowModal(false)}>
                Confirm
              </PortalButton>
            </PortalModalActions>
          </PortalCompactModalCard>
        </PortalModalBackdrop>
      )}
    </ThemeProvider>
  )
}
