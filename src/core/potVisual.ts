export interface PotVisualState {
  scale: number
  hue: number
  distort: number
  distortSpeed: number
  bloom: number
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

// Maps pot fill + deadline pressure to a self-contained visual state.
// fill drives scale/bloom; pressure drives hue (green->red) and surface speed.
export function potVisual(potValue: number, maxValue: number, deadlinePressure: number): PotVisualState {
  const fill = clamp01(maxValue > 0 ? potValue / maxValue : 0)
  const pressure = clamp01(deadlinePressure)
  return {
    scale: 1 + fill,
    hue: 130 - pressure * 110,
    distort: 0.2 + fill * 0.4,
    distortSpeed: pressure * 3,
    bloom: 0.2 + fill * 0.8,
  }
}
