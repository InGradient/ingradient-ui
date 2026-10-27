/**
 * Layout sizes for page structure (side panels, form widths, table columns, grid cells).
 * Pages used popup-size tokens for these, so resizing popups also resized sidebars and tables.
 * Values equal the popup sizes they replace; moving them here changes no pixels. A few table
 * columns (116px, 124px, 190px) are off the 4px grid and are listed as debt in DESIGN.md.
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
  tableColDataset: '190px',
  tableColSequence: '140px',
  tableColPattern: '104px',
  tableColSync: '116px',
  tableColCreated: '124px',
  tableColLabeled: '80px',
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
