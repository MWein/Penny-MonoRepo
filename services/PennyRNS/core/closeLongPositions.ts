import { isOption } from '@penny/option-symbol-parser'
import * as tradier from '@penny/tradier'

const closeLongPositions = async () => {
  const positions = await tradier.getPositions()
  const longOptionPositions = positions.filter(pos => isOption(pos.symbol) && pos.quantity > 0)

  if (longOptionPositions.length === 0) {
    return
  }

  await tradier.closePositionsIndividual(longOptionPositions)
}

export {
  closeLongPositions,
}