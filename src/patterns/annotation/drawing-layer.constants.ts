export const HANDLE_PX = 4
export const POINT_PX = 5
export const POINT_SELECTED_PX = 7
export const STROKE_PX = 1.5
export const STROKE_SELECTED_PX = 2.5
export const LABEL_FONT_PX = 11
export const LABEL_PAD_X = 6
export const LABEL_PAD_Y = 3
export const LABEL_HEIGHT = LABEL_FONT_PX + LABEL_PAD_Y * 2
export const LABEL_RADIUS = 3

/** Estimate text width in pixels — wider chars (CJK, uppercase) get more space. */
export function estimateLabelWidth(text: string): number {
  let w = 0
  for (const ch of text) {
    const code = ch.charCodeAt(0)
    if (code > 0x2E80) w += LABEL_FONT_PX * 1.0       // CJK / full-width
    else if (ch >= 'A' && ch <= 'Z') w += LABEL_FONT_PX * 0.68  // uppercase
    else if (ch >= 'a' && ch <= 'z') w += LABEL_FONT_PX * 0.55  // lowercase
    else if (ch >= '0' && ch <= '9') w += LABEL_FONT_PX * 0.6   // digits
    else w += LABEL_FONT_PX * 0.5                                // space, punct
  }
  return w + LABEL_PAD_X * 2
}
