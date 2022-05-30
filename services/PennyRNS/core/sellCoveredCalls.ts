import { getType, getUnderlying, isOption } from '@penny/option-symbol-parser'
import * as tradier from '@penny/tradier'

const sellCoveredCalls = async () => {
  const positions = await tradier.getPositions()
  const optionableStockPositions = positions.filter(pos => !isOption(pos.symbol) && pos.quantity > 100)
  const existingCoveredCalls = positions.filter(pos =>
    isOption(pos.symbol) && getType(pos.symbol) === 'call' && pos.quantity < 0
  )

  if (optionableStockPositions.length === 0) {
    return
  }

  const positionsWithNumOptions = optionableStockPositions.map(pos => {
    const numAllowedOptions = Math.floor(pos.quantity / 100)
    const coveredCallsForSymbol = existingCoveredCalls.filter(cc => getUnderlying(cc.symbol) === pos.symbol).length
    const numOptionsToSell = numAllowedOptions - coveredCallsForSymbol

    return {
      ...pos,
      numOptionsToSell
    }
  })


  for (let x = 0; x < positionsWithNumOptions.length; x++) {
    const position = positionsWithNumOptions[x]
    const expirations = await tradier.getExpirations(position.symbol, 1)
    if (expirations.length === 0) {
      return
    }
    const optionChain = await tradier.getOptionChain(position.symbol, expirations[0])
    const callOptions = optionChain.filter(opt => opt.type === 'call')

    const MAX_DELTA = 0.4
    const DELTA_TARGET = 0.30
    const closestDeltaOpt = callOptions.filter(opt => opt.delta < MAX_DELTA).reduce((acc, opt) =>
      (DELTA_TARGET - opt.delta) < (DELTA_TARGET - acc.delta) ? opt : acc,
      { symbol: '', delta: 10 }
    )

    if (closestDeltaOpt.symbol === '') {
      return
    }

    await tradier.sellToOpen(position.symbol, closestDeltaOpt.symbol, position.numOptionsToSell)
  }
}

export {
  sellCoveredCalls,
}