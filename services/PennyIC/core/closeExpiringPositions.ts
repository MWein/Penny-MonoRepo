import * as tradier from '@penny/tradier'
import { getExpiration, isOption } from '@penny/option-symbol-parser'
import { closePositions } from '../common/closePositions'


export const closeExpiringPositions = async () => {
  const positions = await tradier.getPositions()
  const optionPositions = positions.filter(pos => isOption(pos.symbol))

  const today = new Date().toISOString().split('T')[0]
  const expiringToday = optionPositions.filter(pos => getExpiration(pos.symbol) === today)

  await closePositions(expiringToday)
}