import * as tradier from '@penny/tradier'
import { getExpiration, isOption } from '@penny/option-symbol-parser'


export const closeExpiringPositions = async () => {
  const positions = await tradier.getPositions()
  const optionPositions = positions.filter(pos => isOption(pos.symbol))

  const today = new Date().toISOString().split('T')[0]
  const expiringToday = optionPositions.filter(pos => getExpiration(pos.symbol) === today)

  if (expiringToday.length === 0) {
    return
  }

  await tradier.closePositionsIndividual(expiringToday)
}