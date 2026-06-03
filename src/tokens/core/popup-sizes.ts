// Popup / dropdown / dialog 차원 — JSX inline style 안 width / minWidth / maxWidth 등.
export const popupSizes = {
  '3xs': '80px',
  '2xs': '140px',
  '2xsPlus': '160px',
  xs: '220px',
  sm: '280px',
  md: '320px',
  lg: '360px',
  xl: '480px',
} as const

// Numeric variant — JSX inline style 객체 안 prop value 로 들어가는 경우.
export const popupSizeNumbers = {
  '3xs': 80,
  '2xs': 140,
  '2xsPlus': 160,
  xs: 220,
  sm: 280,
  md: 320,
  lg: 360,
  xl: 480,
} as const
