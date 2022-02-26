import * as tradier from '@penny/tradier'
import { getUnderlying, isOption } from '@penny/option-symbol-parser'
import { MultilegOptionLeg } from '@penny/tradier'


export const createGTCOrders = async () => {
  // TODO Market open

  const today = new Date().toISOString().split('T')[0]
  const positions = await tradier.getPositions()
  const optionPositions = positions.filter(x => isOption(x.symbol) && x.date_acquired.split('T')[0] !== today)
  const spreadResults = tradier.groupOptionsIntoSpreads(optionPositions)
  const allSpreads = [ ...spreadResults.call.spreads, ...spreadResults.put.spreads ]

  const orders = await tradier.getOrders()
  const openOrders = orders.filter(x => [ 'open', 'pending' ].includes(x.status))

  for (let x = 0; x < allSpreads.length; x++) {
    const spread = allSpreads[x]
    const optTickers = [ spread.long, spread.short ]
    const hasExistingOrders = openOrders.some(x => x?.leg.some(x => optTickers.includes(x.option_symbol)))

    if (!hasExistingOrders) {
      const longPosition = positions.find(x => x.symbol === spread.long)
      const shortPosition = positions.find(x => x.symbol === spread.short)
      const overallCostBasis = (shortPosition.cost_basis / shortPosition.quantity) - (longPosition.cost_basis / longPosition.quantity)
      const target = Number((overallCostBasis / 2).toFixed(0))
      const legs: MultilegOptionLeg[] = [
        {
          symbol: spread.long,
          side: 'sell_to_close',
          quantity: 1
        },
        {
          symbol: spread.short,
          side: 'buy_to_close',
          quantity: 1
        },
      ]

      await tradier.multilegOptionOrder(getUnderlying(spread.long), 'debit', legs, target)
    }
  }
}