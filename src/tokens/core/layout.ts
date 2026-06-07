export const layoutScale = {
  // 일반 layout dimensions
  pageMaxWidth: '1280px',
  topbarHeight: '80px',
  sidebarHeader: '72px',
  sidebarCollapse: '100px',
  panelMinHeight: '300px',
  loadingPanelHeight: '180px',
  // Shadow offsets (modal/dialog floating shadow 정의)
  shadowYOffset: '40px',
  shadowBlur: '80px',
  // Form-specific (label column width in vertical form layout)
  formLabelCol: '140px',
  formLabelColWide: '160px',
  // Domain-specific (capture/log/dataset-card/histogram — UI feature dimension)
  captureBar: '100px',
  captureGrid: '100px',
  histogramWidth: '224px',
  histogramHeight: '84px',
  datasetCardMinHeight: '112px',
  datasetCardRecentMinHeight: '108px',
  logTimeMin: '45px',
  logDetailLeft: '254px',
  logDetailTop: '58px',
  logDetailWidth: '272px',
} as const
