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
  Spinner,
  ContextMenuBackdrop,
  ContextMenuList,
  ContextMenuItem,
  ContextMenuButton,
  ContextMenuSub,
  ContextMenuSubItem,
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
  DialogCloseButton,
  NotificationBadge,
  VerticalTabs,
} from '@ingradient/ui/components'
import { BrandLogo, BrandMark } from '@ingradient/ui/brand'
import { Grid, Heading, Inline, Stack, Surface, Text } from '@ingradient/ui/primitives'
import {
  AppShell,
  AppSidebar,
  DashboardGrid,
  FieldGroup,
  FieldHint,
  FieldLabel,
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
        <Button tone="danger">Delete</Button>
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
      <NotificationBadge value={4}>
        <IconButton variant="secondary" aria-label="Notice">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </IconButton>
      </NotificationBadge>
    </Inline>
  )
}

function NotificationBadgeDemo() {
  return (
    <Inline gap={16} align="center">
      <NotificationBadge value={12}>
        <IconButton variant="secondary" aria-label="Open notices">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </IconButton>
      </NotificationBadge>
      <NotificationBadge value="3" tone="accent">
        <Button variant="secondary">Messages</Button>
      </NotificationBadge>
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
  const [verticalTab, setVerticalTab] = useState('general')
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
      <div style={{ maxWidth: 240 }}>
        <VerticalTabs
          radius="xs"
          value={verticalTab}
          onChange={setVerticalTab}
          items={[
            { value: 'general', label: 'General' },
            { value: 'notices', label: 'Notices', badge: '4' },
            { value: 'members', label: 'Members' },
            { value: 'advanced', label: 'Advanced' },
          ]}
        />
      </div>
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
              <Inline align="center" justify="space-between">
                <ModalTitle>Publish token changes</ModalTitle>
                <DialogCloseButton onClick={() => setOpen(false)} />
              </Inline>
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
        <FieldGroup>
          <FieldLabel htmlFor="theme-name">Theme name</FieldLabel>
          <TextField id="theme-name" placeholder="Theme name" />
        </FieldGroup>
        <FieldGroup>
          <FieldLabel htmlFor="theme-mode">Mode</FieldLabel>
          <SelectField id="theme-mode" defaultValue="dark">
            <option value="dark">Dark</option>
            <option value="contrast">High Contrast</option>
          </SelectField>
        </FieldGroup>
      </Grid>
      <FieldGroup>
        <FieldLabel htmlFor="theme-notes">Notes</FieldLabel>
        <TextareaField id="theme-notes" rows={4} placeholder="Describe the intent of this preset" />
        <FieldHint>FieldGroup and FieldLabel keep labeled forms visually consistent across settings and create flows.</FieldHint>
      </FieldGroup>
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
  const [tab, setTab] = useState('general')
  return (
    <Stack gap={16}>
      <SettingsShell>
        <VerticalTabs
          radius="xs"
          value={tab}
          onChange={setTab}
          items={[
            { value: 'general', label: 'General' },
            { value: 'account', label: 'Account' },
            { value: 'project', label: 'Project', badge: '2' },
            { value: 'advanced', label: 'Advanced' },
          ]}
        />
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

function SpinnerDemo() {
  return (
    <Stack gap={14}>
      <Inline gap={16}>
        <Spinner size="sm" tone="accent" />
        <Spinner size="md" tone="accent" />
        <Spinner size="lg" tone="accent" />
      </Inline>
      <Inline gap={16}>
        <Spinner size="md" tone="accent" aria-label="accent tone" />
        <Spinner size="md" tone="white" aria-label="white tone" />
        <Spinner size="md" tone="muted" aria-label="muted tone" />
      </Inline>
    </Stack>
  )
}

function ContextMenuDemo() {
  const [open, setOpen] = useState(false)
  const [subOpen, setSubOpen] = useState(false)
  return (
    <Stack gap={14}>
      <Text size="12px" tone="soft">Click the button to open a context menu. In production, open on right-click.</Text>
      <Inline gap={10}>
        <Button size="sm" variant="secondary" type="button" onClick={() => setOpen(true)}>
          Open context menu
        </Button>
      </Inline>
      {open && (
        <>
          <ContextMenuBackdrop onClick={() => { setOpen(false); setSubOpen(false) }} aria-hidden />
          <ContextMenuList
            $x={200}
            $y={180}
            onClick={(e) => e.stopPropagation()}
          >
            <ContextMenuButton type="button" $danger onClick={() => setOpen(false)}>
              Delete
            </ContextMenuButton>
            <ContextMenuItem
              onMouseEnter={() => setSubOpen(true)}
              onMouseLeave={() => setSubOpen(false)}
            >
              <ContextMenuButton as="div" style={{ cursor: 'default' }}>
                Set class ›
              </ContextMenuButton>
              {subOpen && (
                <ContextMenuSub $left={330} $top={180}>
                  {['Cat A', 'Cat B', 'Cat C'].map((label) => (
                    <ContextMenuSubItem
                      key={label}
                      type="button"
                      onClick={() => { setOpen(false); setSubOpen(false) }}
                    >
                      {label}
                    </ContextMenuSubItem>
                  ))}
                </ContextMenuSub>
              )}
            </ContextMenuItem>
          </ContextMenuList>
        </>
      )}
    </Stack>
  )
}

export {
  AccordionDemo,
  AlertDemo,
  AppShellPatternDemo,
  BackgroundsDemo,
  BooleanControlsDemo,
  BrandDemo,
  ButtonsDemo,
  CardDemo,
  ChartsDemo,
  ColorDemo,
  DialogDemo,
  DrawerDemo,
  FoundationsOverviewDemo,
  FormSectionPatternDemo,
  IconsDemo,
  IdentityDemo,
  ImageGridDemo,
  ListDetailPatternDemo,
  NavigationDemo,
  NotificationBadgeDemo,
  OverlayBlocksDemo,
  ProgressDemo,
  SelectsDemo,
  SettingsShellPatternDemo,
  SidebarShellPatternDemo,
  SpacingDemo,
  SplitLayoutPatternDemo,
  StateDemo,
  TablesDemo,
  TextFieldsDemo,
  ThemingDemo,
  ToolbarPatternDemo,
  TooltipDemo,
  TypographyDemo,
  WorkspaceBlocksDemo,
  DashboardGridPatternDemo,
  SpinnerDemo,
  ContextMenuDemo,
}
