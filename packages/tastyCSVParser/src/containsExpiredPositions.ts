import { TastyPosition } from './groupPositions'

export const containsExpiredPositions = (positions: TastyPosition[]) => {
  const today = new Date().toISOString().split('T')[0]
  return positions
    .flatMap(
      pos => pos.legs
        .filter(leg => leg.state === 'Open'))
        .some(leg => new Date(leg.expiration).valueOf() < new Date(today).valueOf()
    )
}