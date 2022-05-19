export function round(value: number, digits: number): number {
  const x = Math.pow(10, digits)
  return Math.round(value * x) / x
}
