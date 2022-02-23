import * as tradier from '@penny/tradier'
import { getExpiration } from '@penny/option-symbol-parser'
import { closeSpreads } from '../common/closeSpreads'


export const closeExpiringPositions = async () => {
  const positions = await tradier.getPositions()
  const spreads = tradier.groupOptionsIntoSpreads(positions)
  const allSpreads = [ ...spreads.call.spreads, ...spreads.put.spreads ]

  const today = new Date().toISOString().split('T')[0]
  const expiringToday = allSpreads.filter(spread => getExpiration(spread.short) === today)

  await closeSpreads(expiringToday)
}