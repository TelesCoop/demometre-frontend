function getLeftValue(
  index: number,
  percentageOfSpaceAlreadyTaken: number,
  totalLine: number
): number {
  return (
    percentageOfSpaceAlreadyTaken +
    ((1 - percentageOfSpaceAlreadyTaken) * index) / (totalLine - 1)
  )
}
export function getLeftStyle(
  index: number,
  percentageOfSpaceAlreadyTaken: number,
  totalLine: number,
  gapSize: number,
  percentageSize: number,
  leftBaseMargin = 1
): string {
  const leftValue = getLeftValue(
    index,
    percentageOfSpaceAlreadyTaken,
    totalLine
  )
  return `left: calc((100% - ${gapSize}rem - ${percentageSize}px) * ${leftValue} + ${leftBaseMargin}rem)`
}
