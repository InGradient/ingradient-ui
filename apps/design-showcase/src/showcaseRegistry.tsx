import React, { useState } from 'react'
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  BarChartCard,
  Breadcrumbs,
  Button,
  Card,
  ChartContainer,
  Checkbox,
  Chip,
  CompactModalCard,
  ConfirmDialog,
  Drawer,
  DialogShell,
  DropdownSelect,
  EmptyState,
  ImageGrid,
  IconButton,
  IconGallery,
  LineChartCard,
  LoadingState,
  ModalActions,
  ModalBackdrop,
  ModalTitle,
  HoverCard,
  MenuPopover,
  MetricCard,
  Pagination,
  PieChartCard,
  PreviewCard,
  ProgressBar,
  ProgressBlock,
  SearchField,
  SectionPanel,
  SelectField,
  Skeleton,
  StatCard,
  StatusPill,
  Stepper,
  Switch,
  Table,
  Tabs,
  TextField,
  TextareaField,
  TooltipBubble,
  AssignmentRow,
  ActionBar,
} from '@ingradient/ui/components'
import { BrandLogo, BrandMark } from '@ingradient/ui/brand'
import { Grid, Heading, Inline, Stack, Surface, Text } from '@ingradient/ui/primitives'
import {
  AppShell,
  AppSidebar,
  DashboardGrid,
  FilterBar,
  FormSection,
  InspectorLayout,
  ListDetailLayout,
  MobileNavDrawer,
  PageContent,
  PageHeader,
  PageHeaderRow,
  PageSubtitle,
  PageTitle,
  PageTitleBlock,
  Panel,
  PanelHeader,
  PanelHint,
  PanelTitle,
  SectionTitle,
  SidebarNav,
  SplitLayout,
  SplitPanelShell,
  SettingsShell,
  SidebarFooter,
  SidebarSection,
  Toolbar,
  TopBar,
} from '@ingradient/ui/patterns'

export type ShowcaseSection = 'foundations' | 'components' | 'patterns'
export type ShowcaseGroup =
  | 'overview'
  | 'color'
  | 'typography'
  | 'spacing'
  | 'backgrounds'
  | 'theming'
  | 'brand'
  | 'inputs'
  | 'data-display'
  | 'charts'
  | 'feedback'
  | 'icons'
  | 'surfaces'
  | 'navigation'
  | 'overlays'

export interface ShowcaseEntry {
  id: string
  section: ShowcaseSection
  group?: ShowcaseGroup
  title: string
  description: string
  tags: string[]
  states: string[]
  related: string[]
  component: React.ComponentType
}

function DemoSurface({
  children,
  elevation = 'panel',
}: {
  children: React.ReactNode
  elevation?: 'panel' | 'raised' | 'card'
}) {
  return (
    <Surface elevation={elevation} style={{ padding: 20, borderRadius: 24 }}>
      {children}
    </Surface>
  )
}

function Swatch({ label, value }: { label: string; value: string }) {
  return (
    <Surface elevation="panel" style={{ overflow: 'hidden', borderRadius: 18 }}>
      <div style={{ height: 76, background: value }} />
      <Stack gap={6} style={{ padding: 14 }}>
        <Text size="12px" tone="soft" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </Text>
        <Text size="13px" weight={700}>
          {value}
        </Text>
      </Stack>
    </Surface>
  )
}

function MetricTile({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <Surface elevation="card" style={{ padding: 18, borderRadius: 22 }}>
      <Stack gap={6}>
        <Text size="12px" tone="soft" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </Text>
        <Heading level={2}>{value}</Heading>
        <Text tone="muted">{hint}</Text>
      </Stack>
    </Surface>
  )
}

function FoundationsOverviewDemo() {
  return (
    <Stack gap={20}>
      <Grid minItemWidth={180} gap={14}>
        <MetricTile title="Theme" value="portalDark" hint="Semantic dark theme with elevated surfaces." />
        <MetricTile title="Font" value="IBM Plex Sans" hint="Product-facing type scale with compact density." />
        <MetricTile title="Radius" value="10 / 14 / 20" hint="Consistent control, surface, and shell radii." />
        <MetricTile title="Motion" value="160ms" hint="Fast state transitions for data-heavy workflows." />
      </Grid>
      <Grid minItemWidth={140} gap={12}>
        <Swatch label="Canvas" value="var(--ig-color-bg-canvas)" />
        <Swatch label="Panel" value="var(--ig-color-surface-panel)" />
        <Swatch label="Accent" value="var(--ig-color-accent)" />
        <Swatch label="Success" value="var(--ig-color-success)" />
      </Grid>
    </Stack>
  )
}

function ColorDemo() {
  return (
    <Grid minItemWidth={140} gap={12}>
      <Swatch label="Canvas" value="#0f1115" />
      <Swatch label="Canvas Alt" value="#10151d" />
      <Swatch label="Header" value="rgba(12, 15, 20, 0.88)" />
      <Swatch label="Panel" value="rgba(12, 15, 20, 0.8)" />
      <Swatch label="Accent" value="#4d88ff" />
      <Swatch label="Accent Strong" value="#2962d9" />
      <Swatch label="Success" value="#35c6a7" />
      <Swatch label="Danger" value="#ff9a9a" />
    </Grid>
  )
}

function TypographyDemo() {
  return (
    <DemoSurface>
      <Stack gap={14}>
        <Heading level={1}>Ingradient UI Documentation</Heading>
        <Heading level={2}>Section Heading</Heading>
        <Heading level={3}>Subsection Heading</Heading>
        <Text size="16px" tone="secondary" style={{ display: 'block' }}>
          Typography is tuned for dense operational screens and long-form settings pages.
        </Text>
        <Text tone="muted" style={{ display: 'block' }}>
          Small labels, status copy, and metadata all share the same semantic token palette.
        </Text>
      </Stack>
    </DemoSurface>
  )
}

function SpacingDemo() {
  return (
    <Stack gap={14}>
      {[8, 12, 16, 24].map((gap) => (
        <Surface key={gap} elevation="panel" style={{ padding: 14, borderRadius: 18 }}>
          <Stack gap={8}>
            <Text size="13px" weight={700}>
              Gap {gap}px
            </Text>
            <Inline gap={gap}>
              <div style={{ width: 52, height: 36, borderRadius: 12, background: 'rgba(77,136,255,0.18)' }} />
              <div style={{ width: 52, height: 36, borderRadius: 12, background: 'rgba(43,181,114,0.18)' }} />
              <div style={{ width: 52, height: 36, borderRadius: 12, background: 'rgba(251,146,60,0.18)' }} />
            </Inline>
          </Stack>
        </Surface>
      ))}
    </Stack>
  )
}

function BackgroundsDemo() {
  return (
    <Grid minItemWidth={220} gap={14}>
      <Surface elevation="panel" style={{ padding: 18, borderRadius: 22 }}>
        <Stack gap={8}>
          <Text size="12px" tone="soft">
            Panel
          </Text>
          <Text tone="secondary">Default workspace surface for data-heavy views.</Text>
        </Stack>
      </Surface>
      <Surface elevation="raised" style={{ padding: 18, borderRadius: 22 }}>
        <Stack gap={8}>
          <Text size="12px" tone="soft">
            Raised
          </Text>
          <Text tone="secondary">Dialogs, floating menus, and high-emphasis overlays.</Text>
        </Stack>
      </Surface>
      <Surface elevation="card" style={{ padding: 18, borderRadius: 22 }}>
        <Stack gap={8}>
          <Text size="12px" tone="soft">
            Card
          </Text>
          <Text tone="secondary">Hero cards, onboarding blocks, and dashboard highlights.</Text>
        </Stack>
      </Surface>
    </Grid>
  )
}

function ThemingDemo() {
  return (
    <DemoSurface elevation="raised">
      <Stack gap={12}>
        <Inline gap={10}>
          <Badge $tone="accent">themes.portalDark</Badge>
          <Chip>IngradientThemeProvider</Chip>
          <Chip>IngradientGlobalStyle</Chip>
        </Inline>
        <Text tone="secondary" style={{ display: 'block' }}>
          The package exposes semantic tokens first. Components consume `--ig-*` variables, while temporary
          `--portal-*` aliases remain for migration.
        </Text>
        <ProgressBar value={72} />
      </Stack>
    </DemoSurface>
  )
}

function BrandDemo() {
  return (
    <Stack gap={18}>
      <Surface elevation="card" style={{ padding: 24, borderRadius: 24 }}>
        <Inline gap={16} align="center">
          <BrandMark size={48} />
          <Stack gap={8}>
            <BrandLogo width={180} />
            <Text tone="secondary" style={{ display: 'block' }}>
              Official logos and favicons live in `@ingradient/ui/brand` and should be reused across apps.
            </Text>
          </Stack>
        </Inline>
      </Surface>
      <Grid minItemWidth={220} gap={14}>
        <Surface elevation="panel" style={{ padding: 18, borderRadius: 22 }}>
          <Stack gap={8}>
            <Text size="12px" tone="soft">
              BrandMark
            </Text>
            <Inline gap={12} align="center">
              <BrandMark size={28} />
              <BrandMark size={40} />
              <BrandMark size={56} />
            </Inline>
          </Stack>
        </Surface>
        <Surface elevation="panel" style={{ padding: 18, borderRadius: 22 }}>
          <Stack gap={8}>
            <Text size="12px" tone="soft">
              BrandLogo
            </Text>
            <BrandLogo width={220} />
          </Stack>
        </Surface>
      </Grid>
    </Stack>
  )
}

function ButtonsDemo() {
  return (
    <Stack gap={14}>
      <Inline gap={10}>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="accent">Accent</Button>
        <IconButton variant="secondary" aria-label="Star">
          *
        </IconButton>
      </Inline>
      <Inline gap={10}>
        <Button disabled>Disabled</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
      </Inline>
    </Stack>
  )
}

function TextFieldsDemo() {
  return (
    <Grid minItemWidth={220} gap={12}>
      <TextField placeholder="Project name" />
      <SearchField placeholder="Search templates" />
      <TextareaField rows={4} placeholder="Document notes" />
    </Grid>
  )
}

function SelectsDemo() {
  const [value, setValue] = useState('gallery')
  return (
    <Grid minItemWidth={220} gap={12}>
      <SelectField defaultValue="default">
        <option value="default">Default</option>
        <option value="dense">Dense</option>
        <option value="compact">Compact</option>
      </SelectField>
      <DropdownSelect
        value={value}
        onChange={setValue}
        options={[
          { value: 'gallery', label: 'Gallery Workspace', description: 'High-density visual browsing' },
          { value: 'table', label: 'Data Table', description: 'Rows, filters, and inspector' },
          { value: 'monitoring', label: 'Monitoring', description: 'KPIs and charts' },
        ]}
      />
    </Grid>
  )
}

function BooleanControlsDemo() {
  const [checked, setChecked] = useState(true)
  return (
    <Inline gap={18} align="center">
      <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} label="Email updates" />
      <Switch checked={checked} onChange={(event) => setChecked(event.target.checked)} label="Auto refresh" />
    </Inline>
  )
}

function IdentityDemo() {
  return (
    <Inline gap={12} align="center">
      <Avatar src="/brand/favicon.png" alt="Ingradient logo" />
      <Badge $tone="accent">Preview</Badge>
      <Chip>ML Ops</Chip>
      <StatusPill $tone="running">Running</StatusPill>
    </Inline>
  )
}

function TablesDemo() {
  const rows: Array<{ id: string; name: string; kind: string; status: 'running' | 'completed' | 'queued' }> = [
    { id: '1', name: 'Auth', kind: 'Template', status: 'completed' },
    { id: '2', name: 'Data List', kind: 'Template', status: 'running' },
    { id: '3', name: 'Catalog Example', kind: 'Example', status: 'queued' },
  ]

  return (
    <Table
      columns={[
        { key: 'name', header: 'Template', render: (row: { name: string }) => row.name },
        { key: 'kind', header: 'Kind', render: (row: { kind: string }) => <Chip>{row.kind}</Chip> },
        {
          key: 'status',
          header: 'Status',
          render: (row: { status: 'running' | 'completed' | 'queued' }) => <StatusPill $tone={row.status}>{row.status}</StatusPill>,
        },
      ]}
      rows={rows}
    />
  )
}

function ImageGridDemo() {
  const items = [
    {
      id: 'img-1',
      imageUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%232963d9"/><stop offset="100%" stop-color="%2335c6a7"/></linearGradient></defs><rect width="320" height="320" rx="24" fill="url(%23a)"/><circle cx="108" cy="116" r="34" fill="rgba(255,255,255,0.22)"/><rect x="70" y="188" width="180" height="18" rx="9" fill="rgba(255,255,255,0.18)"/><rect x="70" y="216" width="128" height="14" rx="7" fill="rgba(255,255,255,0.12)"/></svg>',
      title: 'Capture 0142',
      description: 'Portal preview asset with selected annotations.',
      tag: 'Selected',
    },
    {
      id: 'img-2',
      imageUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320"><defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23111b2b"/><stop offset="100%" stop-color="%234d88ff"/></linearGradient></defs><rect width="320" height="320" rx="24" fill="url(%23b)"/><rect x="58" y="70" width="204" height="140" rx="22" fill="rgba(255,255,255,0.12)"/><rect x="84" y="228" width="152" height="16" rx="8" fill="rgba(255,255,255,0.16)"/></svg>',
      title: 'Dataset Sample',
      description: 'Reusable visual tile for gallery and media-heavy products.',
      tag: 'Review',
    },
    {
      id: 'img-3',
      imageUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320"><defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23201b3a"/><stop offset="100%" stop-color="%23c084fc"/></linearGradient></defs><rect width="320" height="320" rx="24" fill="url(%23c)"/><path d="M56 212l62-70 52 48 42-36 52 58H56z" fill="rgba(255,255,255,0.18)"/><circle cx="112" cy="108" r="28" fill="rgba(255,255,255,0.22)"/></svg>',
      title: 'Training Output',
      description: 'Generic image card with metadata and status chip slots.',
      tag: 'New',
    },
  ]

  return (
    <ImageGrid
      items={items}
      selectedIds={['img-1']}
      getImageSrc={(item) => item.imageUrl}
      getTitle={(item) => item.title}
      getDescription={(item) => item.description}
      getMeta={(item) => <Chip>{item.tag}</Chip>}
    />
  )
}

function ChartsDemo() {
  const chartData = [
    { name: 'Mon', runs: 14, success: 11 },
    { name: 'Tue', runs: 18, success: 15 },
    { name: 'Wed', runs: 12, success: 9 },
    { name: 'Thu', runs: 24, success: 21 },
    { name: 'Fri', runs: 20, success: 18 },
  ]
  const pieData = [
    { name: 'Ready', value: 18 },
    { name: 'Queued', value: 7 },
    { name: 'Error', value: 2 },
  ]

  return (
    <Grid minItemWidth={300} gap={14}>
      <LineChartCard
        title="Training Throughput"
        description="Compact line chart wrapper for dashboard cards."
        data={chartData}
        xKey="name"
        series={[
          { key: 'runs', label: 'Runs' },
          { key: 'success', label: 'Completed' },
        ]}
      />
      <BarChartCard
        title="Weekly Activity"
        description="Bar series with semantic legend and tooltip styling."
        data={chartData}
        xKey="name"
        series={[{ key: 'runs', label: 'Runs' }]}
      />
      <PieChartCard title="Queue Mix" description="Pie usage for distribution summaries." data={pieData} />
    </Grid>
  )
}

function IconsDemo() {
  return (
    <ChartContainer
      title="Icon Gallery"
      description="Named icon registry for docs and product apps."
      height={360}
      legend={<Badge $tone="accent">lucide-react wrapped</Badge>}
    >
      <div style={{ height: '100%', overflow: 'auto', paddingRight: 4 }}>
        <IconGallery />
      </div>
    </ChartContainer>
  )
}

function ProgressDemo() {
  return (
    <Stack gap={12}>
      <ProgressBar value={38} />
      <ProgressBar value={72} />
      <Grid minItemWidth={160} gap={12}>
        <Skeleton />
        <Skeleton $height="56px" />
      </Grid>
    </Stack>
  )
}

function WorkspaceBlocksDemo() {
  return (
    <Stack gap={14}>
      <Grid minItemWidth={220} gap={14}>
        <StatCard label="Jobs" value="18" hint="Queued, active, and recently completed work." meta={<Badge $tone="accent">live</Badge>} />
        <MetricCard label="Adoption" value="72%" hint="Portal surfaces moved to shared UI." />
      </Grid>
      <Grid minItemWidth={260} gap={14}>
        <ProgressBlock label="Migration Progress" value={68} hint="Shell and modal extraction is underway." />
        <AssignmentRow
          title="Default Detector"
          description="Assign a baseline model to new capture sessions."
          meta={<Chip>YOLOv8n</Chip>}
          control={<Button size="sm" variant="secondary">Change</Button>}
        />
      </Grid>
      <Grid minItemWidth={280} gap={14}>
        <PreviewCard
          title="Workspace Preview"
          description="Reusable preview surface for recent captures, reports, or visual QA states."
          imageSrc="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 400'><defs><linearGradient id='p' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%232963d9'/><stop offset='100%' stop-color='%2335c6a7'/></linearGradient></defs><rect width='640' height='400' rx='28' fill='url(%23p)'/><rect x='84' y='74' width='472' height='214' rx='24' fill='rgba(255,255,255,0.12)'/><rect x='116' y='320' width='212' height='18' rx='9' fill='rgba(255,255,255,0.14)'/></svg>"
          meta={<Badge $tone="accent">new</Badge>}
          actions={
            <ActionBar>
              <Button size="sm">Open</Button>
              <Button size="sm" variant="secondary">Share</Button>
            </ActionBar>
          }
        />
        <HoverCard>
          <Text size="13px" weight={700}>Hover Card</Text>
          <Text size="12px" tone="muted">Use for compact metadata, preview text, or dataset summaries without building a full modal.</Text>
        </HoverCard>
      </Grid>
    </Stack>
  )
}

function AlertDemo() {
  return (
    <Stack gap={10}>
      <Alert $tone="info">Use semantic surfaces instead of ad-hoc dark panels.</Alert>
      <Alert $tone="success">Theme tokens are applied globally.</Alert>
      <Alert $tone="warning">Templates are docs-only until they are proven reusable.</Alert>
    </Stack>
  )
}

function StateDemo() {
  return (
    <Grid minItemWidth={260} gap={14}>
      <EmptyState>No filtered results. Adjust the query or remove a tag.</EmptyState>
      <LoadingState>Loading component metadata and code examples.</LoadingState>
    </Grid>
  )
}

function CardDemo() {
  const [tab, setTab] = useState('overview')
  return (
    <Stack gap={14}>
      <Card style={{ padding: 20, borderRadius: 24 }}>
        <Stack gap={12}>
          <Text size="12px" tone="soft">
            Highlight Card
          </Text>
          <Heading level={3}>Design System Status</Heading>
          <Text tone="secondary" style={{ display: 'block' }}>
            Generic package surface is now separated from product-specific page code.
          </Text>
        </Stack>
      </Card>
      <Tabs
        items={[
          { value: 'overview', label: 'Overview' },
          { value: 'usage', label: 'Usage' },
          { value: 'api', label: 'API' },
        ]}
        value={tab}
        onChange={setTab}
      />
    </Stack>
  )
}

function AccordionDemo() {
  return (
    <Stack gap={12}>
      <Accordion open>
        <summary>What belongs in `@ingradient/ui`?</summary>
        <div>Reusable primitives, components, and patterns that do not depend on API or product routing.</div>
      </Accordion>
      <Accordion>
        <summary>What stays in `platform`?</summary>
        <div>Page-specific orchestration, product flows, and domain-only interactions.</div>
      </Accordion>
    </Stack>
  )
}

function NavigationDemo() {
  const [page, setPage] = useState(2)
  const [tab, setTab] = useState('work')
  return (
    <Stack gap={16}>
      <Tabs
        variant="underline"
        value={tab}
        onChange={setTab}
        items={[
          { value: 'work', label: 'Work Options' },
          { value: 'export', label: 'Export Project File' },
          { value: 'import', label: 'Import Results' },
        ]}
        style={{ width: '100%' }}
      />
      <Breadcrumbs items={[{ label: 'Components', href: '#' }, { label: 'Navigation', href: '#' }, { label: 'Pagination' }]} />
      <Pagination page={page} totalPages={5} onChange={setPage} />
      <Stepper steps={['Select', 'Configure', 'Review']} activeStep={1} />
    </Stack>
  )
}

function DialogDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Stack gap={12}>
      <Button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      {open ? (
        <ModalBackdrop onClick={() => setOpen(false)}>
          <CompactModalCard onClick={(event) => event.stopPropagation()}>
            <Stack gap={14}>
              <ModalTitle>Publish token changes</ModalTitle>
              <Text tone="secondary" style={{ display: 'block' }}>
                This is the reusable modal shell used by docs and product surfaces.
              </Text>
              <ModalActions>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => setOpen(false)}>
                  Publish
                </Button>
              </ModalActions>
            </Stack>
          </CompactModalCard>
        </ModalBackdrop>
      ) : null}
    </Stack>
  )
}

function OverlayBlocksDemo() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  return (
    <Stack gap={14}>
      <Inline gap={10}>
        <Button type="button" onClick={() => setDialogOpen(true)}>
          Open dialog shell
        </Button>
        <Button type="button" variant="secondary" onClick={() => setConfirmOpen(true)}>
          Open confirm dialog
        </Button>
      </Inline>
      <Grid minItemWidth={240} gap={14}>
        <MenuPopover>
          <Stack gap={8}>
            <Text size="12px" tone="soft">MenuPopover</Text>
            <Button size="sm" variant="secondary">Rename</Button>
            <Button size="sm" variant="secondary">Archive</Button>
            <Button size="sm" variant="accent">Promote</Button>
          </Stack>
        </MenuPopover>
        <SectionPanel>
          <Text size="12px" tone="soft">SectionPanel</Text>
          <Text tone="secondary" style={{ display: 'block' }}>
            Shared container for form sections, settings groups, and device configuration blocks.
          </Text>
        </SectionPanel>
      </Grid>
      {dialogOpen ? (
        <DialogShell
          title="Publish UI Changes"
          description="Shared shell for settings, forms, and multi-action dialogs."
          onClose={() => setDialogOpen(false)}
          actions={
            <>
              <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={() => setDialogOpen(false)}>
                Publish
              </Button>
            </>
          }
        >
          <TextField placeholder="Release note" />
        </DialogShell>
      ) : null}
      {confirmOpen ? (
        <ConfirmDialog
          title="Delete draft preset"
          description="This action removes the preset from the registry and cannot be undone."
          confirmLabel="Delete"
          confirmVariant="accent"
          onConfirm={() => setConfirmOpen(false)}
          onCancel={() => setConfirmOpen(false)}
        />
      ) : null}
    </Stack>
  )
}

function DrawerDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Stack gap={12}>
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        Toggle drawer
      </Button>
      {open ? (
        <Drawer>
          <Stack gap={14}>
            <Heading level={3}>Navigation Drawer</Heading>
            <Text tone="secondary" style={{ display: 'block' }}>
              Reusable side sheet for filters, metadata, and context tools.
            </Text>
            <Button type="button" onClick={() => setOpen(false)}>
              Close
            </Button>
          </Stack>
        </Drawer>
      ) : null}
    </Stack>
  )
}

function TooltipDemo() {
  return (
    <Inline gap={12} align="center">
      <Button type="button" variant="secondary">
        Hover target
      </Button>
      <TooltipBubble>Tooltip content, guidance, or compact metadata.</TooltipBubble>
    </Inline>
  )
}

function AppShellPatternDemo() {
  return (
    <AppShell style={{ height: 420, borderRadius: 24, overflow: 'hidden' }}>
      <TopBar>
        <Text weight={700}>Ingradient UI Docs</Text>
        <Inline gap={8}>
          <Badge $tone="accent">Docs</Badge>
          <Button size="sm">Install</Button>
        </Inline>
      </TopBar>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <PageTitle>Application Shell</PageTitle>
            <PageSubtitle>Generic product chrome that does not know about business data.</PageSubtitle>
          </PageTitleBlock>
        </PageHeaderRow>
      </PageHeader>
      <PageContent>
        <Grid minItemWidth={220}>
          <SidebarNav>
            <Button variant="secondary">Dashboard</Button>
            <Button variant="secondary">Components</Button>
            <Button variant="secondary">Templates</Button>
          </SidebarNav>
          <Panel>
            <PanelHeader>
              <PanelTitle>Main Workspace</PanelTitle>
              <PanelHint>Resizable content area</PanelHint>
            </PanelHeader>
            <div style={{ padding: 18 }}>
              <Text tone="secondary" style={{ display: 'block' }}>
                App shell, page header, and content primitives compose the docs layout.
              </Text>
            </div>
          </Panel>
        </Grid>
      </PageContent>
    </AppShell>
  )
}

function SidebarShellPatternDemo() {
  return (
    <Grid minItemWidth={320} gap={16}>
      <AppSidebar>
        <SidebarSection>
          <Badge $tone="accent">AppSidebar</Badge>
          <Button variant="secondary">Dashboard</Button>
          <Button variant="secondary">Catalog</Button>
          <Button variant="secondary">Training</Button>
        </SidebarSection>
        <SidebarFooter>
          <Button variant="secondary">Settings</Button>
          <Button variant="accent">Invite</Button>
        </SidebarFooter>
      </AppSidebar>
      <MobileNavDrawer style={{ position: 'relative', inset: 'auto', transform: 'none', width: '100%' }}>
        <Inline gap={10} align="center">
          <BrandMark size={24} />
          <Text weight={700}>MobileNavDrawer</Text>
        </Inline>
        <Button variant="secondary">Overview</Button>
        <Button variant="secondary">Components</Button>
        <Button variant="secondary">Patterns</Button>
      </MobileNavDrawer>
    </Grid>
  )
}

function ToolbarPatternDemo() {
  return (
    <Stack gap={14}>
      <Toolbar>
        <Inline gap={10}>
          <SearchField placeholder="Search templates" />
          <DropdownSelect
            value="components"
            onChange={() => undefined}
            options={[
              { value: 'components', label: 'Components' },
              { value: 'patterns', label: 'Patterns' },
            ]}
          />
        </Inline>
        <Inline gap={10}>
          <Button variant="secondary">Reset</Button>
          <Button>Apply</Button>
        </Inline>
      </Toolbar>
      <FilterBar>
        <TextField placeholder="Filter by tag" />
        <Inline gap={10}>
          <Chip>Stable</Chip>
          <Chip>Docs</Chip>
        </Inline>
      </FilterBar>
    </Stack>
  )
}

function SplitLayoutPatternDemo() {
  return (
    <SplitLayout
      sidebar={
        <Surface elevation="panel" style={{ padding: 18, borderRadius: 22 }}>
          <Text tone="secondary" style={{ display: 'block' }}>
            Sidebar filters
          </Text>
        </Surface>
      }
      content={
        <Surface elevation="card" style={{ padding: 18, borderRadius: 22 }}>
          <Text tone="secondary" style={{ display: 'block' }}>
            Main content
          </Text>
        </Surface>
      }
      inspector={
        <Surface elevation="raised" style={{ padding: 18, borderRadius: 22 }}>
          <Text tone="secondary" style={{ display: 'block' }}>
            Inspector
          </Text>
        </Surface>
      }
    />
  )
}

function FormSectionPatternDemo() {
  return (
    <FormSection>
      <SectionTitle>Token Playground</SectionTitle>
      <Grid minItemWidth={220}>
        <TextField placeholder="Theme name" />
        <SelectField defaultValue="dark">
          <option value="dark">Dark</option>
          <option value="contrast">High Contrast</option>
        </SelectField>
      </Grid>
      <TextareaField rows={4} placeholder="Describe the intent of this preset" />
      <Inline gap={10}>
        <Button variant="secondary">Cancel</Button>
        <Button>Save preset</Button>
      </Inline>
    </FormSection>
  )
}

function DashboardGridPatternDemo() {
  return (
    <DashboardGrid>
      <MetricTile title="Adoption" value="42%" hint="Portal pages migrated to new subpaths." />
      <MetricTile title="Coverage" value="24" hint="Documented component and pattern entries." />
      <MetricTile title="Templates" value="6" hint="Generic docs-only reference pages." />
    </DashboardGrid>
  )
}

function ListDetailPatternDemo() {
  return (
    <ListDetailLayout>
      <Surface elevation="panel" style={{ padding: 16, borderRadius: 22 }}>
        <Stack gap={10}>
          <Text weight={700}>Entries</Text>
          <Button variant="secondary">Auth</Button>
          <Button variant="secondary">Dashboard</Button>
          <Button variant="secondary">Settings</Button>
        </Stack>
      </Surface>
      <Surface elevation="raised" style={{ padding: 18, borderRadius: 22 }}>
        <Stack gap={10}>
          <Heading level={3}>Detail View</Heading>
          <Text tone="secondary" style={{ display: 'block' }}>
            Use list-detail when the left column remains a stable collection and the right column owns the primary
            editing or preview workflow.
          </Text>
        </Stack>
      </Surface>
    </ListDetailLayout>
  )
}

function SettingsShellPatternDemo() {
  return (
    <Stack gap={16}>
      <SettingsShell>
        <AppSidebar>
          <SidebarSection>
            <Button variant="secondary">General</Button>
            <Button variant="secondary">Account</Button>
            <Button variant="secondary">Project</Button>
          </SidebarSection>
        </AppSidebar>
        <SectionPanel>
          <Heading level={3}>SettingsShell</Heading>
          <Text tone="secondary" style={{ display: 'block' }}>
            Use for stable settings navigation with a detail editor on the right.
          </Text>
        </SectionPanel>
      </SettingsShell>
      <InspectorLayout>
        <SectionPanel>
          <Heading level={3}>Primary Content</Heading>
          <Text tone="secondary" style={{ display: 'block' }}>
            Main working region for forms, data views, or logs.
          </Text>
        </SectionPanel>
        <SectionPanel>
          <Heading level={3}>Inspector</Heading>
          <Text tone="secondary" style={{ display: 'block' }}>
            Secondary metadata, actions, or field details.
          </Text>
        </SectionPanel>
      </InspectorLayout>
      <SplitPanelShell>
        <SectionPanel>
          <Text weight={700}>Left Panel</Text>
        </SectionPanel>
        <SectionPanel>
          <Text weight={700}>Right Panel</Text>
        </SectionPanel>
      </SplitPanelShell>
    </Stack>
  )
}

export const showcaseEntries: ShowcaseEntry[] = [
  {
    id: 'overview',
    section: 'foundations',
    group: 'overview',
    title: 'Overview',
    description: 'Semantic tokens, typography, spacing, and surface rules that define the system.',
    tags: ['tokens', 'theme'],
    states: ['default'],
    related: ['colors', 'typography', 'theming'],
    component: FoundationsOverviewDemo,
  },
  {
    id: 'colors',
    section: 'foundations',
    group: 'color',
    title: 'Color',
    description: 'Canvas, surface, border, and semantic accent tokens.',
    tags: ['foundations', 'color'],
    states: ['default', 'dark'],
    related: ['backgrounds', 'theming'],
    component: ColorDemo,
  },
  {
    id: 'typography',
    section: 'foundations',
    group: 'typography',
    title: 'Typography',
    description: 'Display, heading, body, and metadata scales for dense operational products.',
    tags: ['foundations', 'type'],
    states: ['default'],
    related: ['spacing', 'overview'],
    component: TypographyDemo,
  },
  {
    id: 'spacing',
    section: 'foundations',
    group: 'spacing',
    title: 'Spacing',
    description: 'Standard gap and padding rhythm used by primitives and patterns.',
    tags: ['foundations', 'layout'],
    states: ['default'],
    related: ['typography', 'backgrounds'],
    component: SpacingDemo,
  },
  {
    id: 'backgrounds',
    section: 'foundations',
    group: 'backgrounds',
    title: 'Backgrounds',
    description: 'Surface elevations and shell backgrounds for the dark theme.',
    tags: ['foundations', 'surfaces'],
    states: ['panel', 'raised', 'card'],
    related: ['colors', 'theming'],
    component: BackgroundsDemo,
  },
  {
    id: 'theming',
    section: 'foundations',
    group: 'theming',
    title: 'Theming',
    description: 'Theme provider, global style, and migration-safe token aliases.',
    tags: ['foundations', 'theming'],
    states: ['portalDark'],
    related: ['overview', 'backgrounds'],
    component: ThemingDemo,
  },
  {
    id: 'brand',
    section: 'foundations',
    group: 'brand',
    title: 'Brand',
    description: 'Official Ingradient logos, favicon assets, and shared brand entry points.',
    tags: ['foundations', 'brand'],
    states: ['default', 'mark', 'wordmark'],
    related: ['theming', 'icon-gallery'],
    component: BrandDemo,
  },
  {
    id: 'button',
    section: 'components',
    group: 'inputs',
    title: 'Button',
    description: 'Primary, secondary, accent, and icon action affordances.',
    tags: ['components', 'inputs'],
    states: ['default', 'disabled'],
    related: ['text-field', 'toolbar'],
    component: ButtonsDemo,
  },
  {
    id: 'text-field',
    section: 'components',
    group: 'inputs',
    title: 'Text Field',
    description: 'Single-line, search, and multiline input controls.',
    tags: ['components', 'inputs'],
    states: ['default', 'focus'],
    related: ['select', 'form-section'],
    component: TextFieldsDemo,
  },
  {
    id: 'select',
    section: 'components',
    group: 'inputs',
    title: 'Select',
    description: 'Native and custom dropdown inputs for choice-heavy workflows.',
    tags: ['components', 'inputs'],
    states: ['default', 'open'],
    related: ['text-field', 'toolbar'],
    component: SelectsDemo,
  },
  {
    id: 'checkbox-switch',
    section: 'components',
    group: 'inputs',
    title: 'Checkbox & Switch',
    description: 'Boolean controls for forms, settings, and workspace toggles.',
    tags: ['components', 'inputs'],
    states: ['checked', 'unchecked'],
    related: ['form-section'],
    component: BooleanControlsDemo,
  },
  {
    id: 'avatar-badge',
    section: 'components',
    group: 'data-display',
    title: 'Avatar & Badge',
    description: 'Identity, small metadata pills, and lightweight tags.',
    tags: ['components', 'data-display'],
    states: ['default'],
    related: ['status-pill'],
    component: IdentityDemo,
  },
  {
    id: 'data-grid',
    section: 'components',
    group: 'data-display',
    title: 'Data Grid',
    description: 'Simple table pattern for lists, templates, and metadata.',
    tags: ['components', 'data-display'],
    states: ['default'],
    related: ['progress', 'data-list'],
    component: TablesDemo,
  },
  {
    id: 'image-grid',
    section: 'components',
    group: 'data-display',
    title: 'Image Grid',
    description: 'Reusable thumbnail grid for gallery-style browsing, selection, and metadata chips.',
    tags: ['components', 'data-display', 'media'],
    states: ['default', 'selected'],
    related: ['data-grid', 'catalog'],
    component: ImageGridDemo,
  },
  {
    id: 'charts',
    section: 'components',
    group: 'charts',
    title: 'Charts',
    description: 'Styled chart wrappers for metrics, trends, and status distribution views.',
    tags: ['components', 'charts'],
    states: ['default', 'loading', 'empty'],
    related: ['dashboard-grid', 'monitoring'],
    component: ChartsDemo,
  },
  {
    id: 'progress',
    section: 'components',
    group: 'data-display',
    title: 'Progress & Skeleton',
    description: 'Asynchronous progress bars and loading placeholders.',
    tags: ['components', 'data-display'],
    states: ['loading', 'partial', 'complete'],
    related: ['alert', 'empty-loading'],
    component: ProgressDemo,
  },
  {
    id: 'workspace-blocks',
    section: 'components',
    group: 'data-display',
    title: 'Workspace Blocks',
    description: 'Stat cards, assignment rows, progress blocks, preview cards, and hover cards for operational screens.',
    tags: ['components', 'data-display', 'workspace'],
    states: ['default', 'preview', 'assignment'],
    related: ['image-grid', 'dashboard-grid'],
    component: WorkspaceBlocksDemo,
  },
  {
    id: 'alert',
    section: 'components',
    group: 'feedback',
    title: 'Alert',
    description: 'Inline system messages and semantic state banners.',
    tags: ['components', 'feedback'],
    states: ['info', 'success', 'warning'],
    related: ['empty-loading', 'dialog'],
    component: AlertDemo,
  },
  {
    id: 'empty-loading',
    section: 'components',
    group: 'feedback',
    title: 'Empty & Loading',
    description: 'Fallback surfaces for empty, loading, and error states.',
    tags: ['components', 'feedback'],
    states: ['empty', 'loading'],
    related: ['alert', 'data-grid'],
    component: StateDemo,
  },
  {
    id: 'card',
    section: 'components',
    group: 'surfaces',
    title: 'Card',
    description: 'Highlight surfaces and tab-ready content modules.',
    tags: ['components', 'surfaces'],
    states: ['default', 'tabbed'],
    related: ['accordion', 'dashboard-grid'],
    component: CardDemo,
  },
  {
    id: 'accordion',
    section: 'components',
    group: 'surfaces',
    title: 'Accordion',
    description: 'Progressive disclosure surface for docs and settings.',
    tags: ['components', 'surfaces'],
    states: ['collapsed', 'open'],
    related: ['card', 'form-section'],
    component: AccordionDemo,
  },
  {
    id: 'navigation',
    section: 'components',
    group: 'navigation',
    title: 'Navigation',
    description: 'Breadcrumbs, pagination, step progression, and animated top-level tabs.',
    tags: ['components', 'navigation'],
    states: ['default', 'active', 'underline-tabs'],
    related: ['app-shell'],
    component: NavigationDemo,
  },
  {
    id: 'icon-gallery',
    section: 'components',
    group: 'icons',
    title: 'Icons',
    description: 'Curated icon registry for navigation, status, media, and workspace actions.',
    tags: ['components', 'icons'],
    states: ['default'],
    related: ['brand', 'navigation'],
    component: IconsDemo,
  },
  {
    id: 'dialog',
    section: 'components',
    group: 'overlays',
    title: 'Dialog',
    description: 'Reusable modal shell for confirmation and form flows.',
    tags: ['components', 'overlays'],
    states: ['closed', 'open'],
    related: ['drawer', 'alert'],
    component: DialogDemo,
  },
  {
    id: 'overlay-blocks',
    section: 'components',
    group: 'overlays',
    title: 'Dialogs & Menus',
    description: 'Shared dialog shell, confirm dialog, menu popover, hover card, and section panel building blocks.',
    tags: ['components', 'overlays'],
    states: ['menu', 'dialog', 'confirm'],
    related: ['dialog', 'tooltip'],
    component: OverlayBlocksDemo,
  },
  {
    id: 'drawer',
    section: 'components',
    group: 'overlays',
    title: 'Drawer',
    description: 'Side sheet for filters, settings, and supporting context.',
    tags: ['components', 'overlays'],
    states: ['closed', 'open'],
    related: ['dialog', 'split-layout'],
    component: DrawerDemo,
  },
  {
    id: 'tooltip',
    section: 'components',
    group: 'overlays',
    title: 'Tooltip',
    description: 'Compact explanatory overlays for dense interfaces.',
    tags: ['components', 'overlays'],
    states: ['default'],
    related: ['alert'],
    component: TooltipDemo,
  },
  {
    id: 'app-shell',
    section: 'patterns',
    title: 'App Shell',
    description: 'Top bar, page header, and content region composition.',
    tags: ['patterns', 'chrome'],
    states: ['desktop', 'mobile'],
    related: ['navigation', 'dashboard'],
    component: AppShellPatternDemo,
  },
  {
    id: 'sidebar-shell',
    section: 'patterns',
    title: 'Sidebar Shell',
    description: 'Shared desktop sidebar and mobile navigation drawer containers.',
    tags: ['patterns', 'navigation'],
    states: ['desktop', 'mobile'],
    related: ['app-shell', 'navigation'],
    component: SidebarShellPatternDemo,
  },
  {
    id: 'toolbar',
    section: 'patterns',
    title: 'Toolbar & Filter Bar',
    description: 'Reusable control rows for search, actions, and dataset filters.',
    tags: ['patterns', 'controls'],
    states: ['default', 'wrapped'],
    related: ['button', 'select'],
    component: ToolbarPatternDemo,
  },
  {
    id: 'split-layout',
    section: 'patterns',
    title: 'Split Layout',
    description: 'Three-column composition for sidebar, main content, and inspector.',
    tags: ['patterns', 'layout'],
    states: ['sidebar', 'inspector'],
    related: ['drawer', 'catalog'],
    component: SplitLayoutPatternDemo,
  },
  {
    id: 'form-section',
    section: 'patterns',
    title: 'Form Section',
    description: 'Structured form surface with title, fields, and primary actions.',
    tags: ['patterns', 'forms'],
    states: ['default', 'loading'],
    related: ['text-field', 'create-form'],
    component: FormSectionPatternDemo,
  },
  {
    id: 'dashboard-grid',
    section: 'patterns',
    title: 'Dashboard Grid',
    description: 'Responsive metric and widget layout for operational dashboards.',
    tags: ['patterns', 'layout'],
    states: ['default'],
    related: ['card', 'dashboard'],
    component: DashboardGridPatternDemo,
  },
  {
    id: 'list-detail',
    section: 'patterns',
    title: 'List Detail',
    description: 'Collection on the left, primary editor or inspector on the right.',
    tags: ['patterns', 'layout'],
    states: ['desktop', 'stacked'],
    related: ['settings', 'data-list'],
    component: ListDetailPatternDemo,
  },
  {
    id: 'settings-shell',
    section: 'patterns',
    title: 'Settings & Inspector Shells',
    description: 'SettingsShell, InspectorLayout, and SplitPanelShell for multi-pane workflows.',
    tags: ['patterns', 'layout'],
    states: ['settings', 'inspector'],
    related: ['list-detail', 'sidebar-shell'],
    component: SettingsShellPatternDemo,
  },
]

export const sectionOrder: ShowcaseSection[] = ['foundations', 'components', 'patterns']

export const sectionLabels: Record<ShowcaseSection, string> = {
  foundations: 'Foundations',
  components: 'Components',
  patterns: 'Patterns',
}

export const componentGroupLabels: Record<string, string> = {
  inputs: 'Inputs',
  'data-display': 'Data Display',
  charts: 'Charts',
  feedback: 'Feedback',
  icons: 'Icons',
  surfaces: 'Surfaces',
  navigation: 'Navigation',
  overlays: 'Overlays',
}

export function getEntryPath(entry: ShowcaseEntry): string {
  if (entry.section === 'foundations') return `/foundations/${entry.id}`
  if (entry.section === 'components') return `/components/${entry.group}/${entry.id}`
  return `/patterns/${entry.id}`
}

export function findEntry(section: ShowcaseSection, id: string, group?: string) {
  return showcaseEntries.find(
    (entry) => entry.section === section && entry.id === id && (section !== 'components' || entry.group === group)
  )
}

export function getEntriesBySection(section: ShowcaseSection) {
  return showcaseEntries.filter((entry) => entry.section === section)
}

export function getComponentGroups() {
  return Array.from(
    new Set(showcaseEntries.filter((entry) => entry.section === 'components').map((entry) => entry.group).filter(Boolean))
  ) as ShowcaseGroup[]
}

export function getEntryMap() {
  return new Map(showcaseEntries.map((entry) => [entry.id, entry]))
}
