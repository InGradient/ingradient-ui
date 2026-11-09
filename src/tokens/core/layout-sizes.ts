/**
 * Layout sizes for page structure (side panels, form widths, table columns, grid cells).
 * Pages used popup-size tokens for these, so resizing popups also resized sidebars and tables.
 * Values equal the popup sizes they replace, except the two 190px widths, which were rounded to
 * 192px so every layout size sits on the 4px grid (enforced by layout-sizes.test.ts).
 */
export const layoutSizes = {
  sidePanel: '320px',
  sidePanelMin: '220px',
  sidePanelMax: '480px',
  classListPanel: '280px',
  classInfoPanel: '300px',
  formNarrow: '420px',
  form: '720px',
  fieldMax: '280px',
  searchMax: '220px',
  gridCellMin: '140px',
  previewWidth: '320px',
  previewHeight: '240px',
  statePanelMinHeight: '320px',
  dropZoneMinHeight: '220px',
  tableMinWidth: '1200px',
  tableColThumb: '80px',
  tableColName: '280px',
  tableColDataset: '192px',
  tableColSequence: '140px',
  tableColPattern: '104px',
  tableColSync: '116px',
  tableColCreated: '124px',
  tableColLabeled: '80px',
  mobileBottomSheetOffset: '60px',
  commentListMaxHeight: '80px',
  /** Field widths inside panels and the Settings modal (minimums for inputs and selects). */
  fieldXs: '104px',
  fieldSm: '160px',
  fieldSmPlus: '192px',
  fieldMd: '200px',
  fieldLg: '240px',
  fieldXl: '260px',
  /** Minimum width of tables inside the Settings modal before they scroll. */
  tableMinCompact: '640px',
  /** Minimum width of wider grid cells (stat cards, member columns). */
  cellMinWide: '220px',
  settingsNavWidth: '220px',
  tableColActions: '120px',
} as const

/** Numeric variant for props that take numbers (e.g. ResizableColumn widths). */
export const layoutSizeNumbers = Object.fromEntries(
  Object.entries(layoutSizes).map(([k, v]) => [k, Number.parseInt(v, 10)]),
) as { [K in keyof typeof layoutSizes]: number }

const kebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

/** `--ig-layout-size-*` CSS variables. */
export const layoutSizeVars: Record<string, string> = Object.fromEntries(
  Object.entries(layoutSizes).map(([k, v]) => [`--ig-layout-size-${kebab(k)}`, v]),
)
