import * as tradier from '@penny/tradier'
import { isOption } from '@penny/option-symbol-parser'
import { getSpreadOutcomes } from '@penny/spread-outcome'
import { MultilegOptionLeg } from '@penny/tradier'


export const createGTCShortOrders = async () => {
  const positions = await tradier.getPositions()
  const openOptions = positions.filter(x => isOption(x.symbol))

  const today = new Date().toISOString().split('T')[0]
  const optionsToCheck = openOptions.filter(opt => opt.date_acquired !== today)

  const orders = await tradier.getOrders()
  const openOrders = orders.filter(ord => ord.status === 'open' && ord.class === 'multileg')
  const orderLegs = openOrders.reduce((acc, ord) => ord.leg ? [ ...acc, ...ord.leg ] : acc, [])
  const orderSymbols = orderLegs.map(leg => leg.option_symbol)

  const shortSpreads = getSpreadOutcomes(optionsToCheck).filter(outcome => outcome.side === 'short')

  const spreadsWithoutOrders = shortSpreads.filter(spread =>
    !spread.positions.some(pos => orderSymbols.includes(pos.symbol))
  )

  for (let x = 0; x < spreadsWithoutOrders.length; x++) {
    const spread = spreadsWithoutOrders[x]
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

    await tradier.multilegOptionOrder(underlying, 'debit', legs, spread.maxGain / 2)
  }
}