/**
 * Compute the `object-fit: cover` square crop region in normalized image coords.
 * Returns the (vx, vy, vw, vh) slice of the [0, 1] image that is visible after
 * the thumbnail crops to a square.
 *
 * - landscape (ar > 1): horizontal slice (width 1/ar centered)
 * - portrait (ar < 1): vertical slice (height ar centered)
 * - square or unknown: full [0, 1] view
 */
export function coverCropRegion(imageWidth: number, imageHeight: number) {
  const ar = imageWidth > 0 && imageHeight > 0 ? imageWidth / imageHeight : 1
  let vx = 0
  let vy = 0
  let vw = 1
  let vh = 1
  if (ar > 1) {
    vw = 1 / ar
    vx = (1 - vw) / 2
  } else if (ar < 1) {
    vh = ar
    vy = (1 - vh) / 2
  }
  return { vx, vy, vw, vh }
}
