export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function clamp01(value: number) {
  return clamp(value, 0, 1)
}

export function normalize(value: number, max: number, min: number) {
  return (value - min) / (max - min);
}

export function normalize01(value: number) {
  return normalize(value, 0, 1)
}