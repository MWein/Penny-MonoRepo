import * as tradier from '@penny/tradier'
import { getExpiration, isOption } from '@penny/option-symbol-parser'
import { getSpreadOutcomes } from '@penny/spread-outcome'

export const closeOldShortPositions = async () => {
  const positions = await tradier.getPositions()
  if (positions.length === 0) {
    return
  }

  const openOptions = positions.filter(x => isOption(x.symbol))
  const shortSpreads = getSpreadOutcomes(openOptions).filter(spread => spread.side === 'short')
  const shortPositions = shortSpreads.reduce((acc, spread) => [ ...acc, ...spread.positions ], [])

  const today = new Date()
  const oldShortPositions = shortPositions.filter(pos => {
    const expiration = getExpiration(pos.symbol)
    const timeUntil = new Date(expiration).valueOf() - today.valueOf()
    return timeUntil <= 8.64e+7 * 9 // 9 days
  })

  if (oldShortPositions.length === 0) {
    return
  }

  await tradier.closePositions(oldShortPositions)
}