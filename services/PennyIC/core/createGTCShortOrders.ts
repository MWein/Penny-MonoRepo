// TODO Possible Removal
// May actually want to keep around but modified

import * as tradier from '@penny/tradier'
import { isOption } from '@penny/option-symbol-parser'
import { getSpreadOutcomes } from '@penny/spread-outcome'
import { MultilegOptionLeg } from '@penny/tradier'


export const createGTCShortOrders = async () => {
  // TODO Make setting
  const shortProfitTarget = 50


  const positions = await tradier.getPositions()
  if (positions.length === 0) {
    return
  }

  const openOptions = positions.filter(x => isOption(x.symbol))

  const today = new Date().toISOString().split('T')[0]
  const optionsToCheck = openOptions.filter(opt => opt.date_acquired !== today)
  const shortSpreads = getSpreadOutcomes(optionsToCheck).filter(outcome => outcome.side === 'short')

  if (shortSpreads.length === 0) {
    return
  }

  const orders = await tradier.getOrders()
  const openOrders = orders.filter(ord => ord.status === 'open' && ord.class === 'multileg')

  const orderSymbols = openOrders.reduce((acc, ord) => {
    const symbolKeys = Object.keys(ord).filter(key => key.includes('option_symbol['))
    const symbols = symbolKeys.map(key => ord[key])
    return [ ...acc, ...symbols ]
  }, [])

  const spreadsWithoutOrders = shortSpreads.filter(spread =>
    !spread.positions.some(pos => orderSymbols.includes(pos.symbol))
  )

  for (let x = 0; x < spreadsWithoutOrders.length; x++) {
    const spread = spreadsWithoutOrders[x]
    const profitTarget = spread.maxGain - (spread.maxGain * (shortProfitTarget / 100))
    const underlying = spread.ticker
    const positions = spread.positions

    const legs: MultilegOptionLeg[] = positions.map(pos => {
      const side = pos.quantity > 0 ? 'sell_to_close' : 'buy_to_close'
      return {
        symbol: pos.symbol,
        side,
        quantity: 1
      }
    })

    await tradier.multilegOptionOrder(underlying, 'debit', legs, profitTarget)
  }
}