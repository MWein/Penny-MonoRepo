import * as tradier from '@penny/tradier'
import { getSpreadOutcomes, SpreadOutcome } from '@penny/spread-outcome'
import { isOption } from '@penny/option-symbol-parser'

type SidesToClose = 'long' | 'short' | 'all'


const getSpreadsToClose = (spreads: SpreadOutcome[], type: SidesToClose) =>
  type === 'all' ? spreads : spreads.filter(spread => spread.side === type)


export const nuke = async (sideToClose: SidesToClose) => {
  const positions = await tradier.getPositions()
  const optionPositions = positions.filter(pos => isOption(pos.symbol))

  if (optionPositions.length === 0) {
    return
  }

  const spreads = getSpreadOutcomes(optionPositions)
  const spreadsToClose = getSpreadsToClose(spreads, sideToClose)
  const positionsToClose = spreadsToClose.reduce((acc, spread) => [ ...acc, ...spread.positions ], [])

  await tradier.closePositions(positionsToClose)
}