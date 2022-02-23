import * as tradier from '@penny/tradier'
import { getUnderlying } from '@penny/option-symbol-parser'
import { MultilegOptionLeg, Spread } from '@penny/tradier'


export const closeSpreads = async (spreadsToClose: Spread[]) : Promise<void> => {
  for (let x = 0; x < spreadsToClose.length; x++) {
    const spread = spreadsToClose[x]
    const underlying = getUnderlying(spread.short)
    const legs: MultilegOptionLeg[] = [
      {
        symbol: spread.short,
        side: 'buy_to_close',
        quantity: 1
      },
      {
        symbol: spread.long,
        side: 'sell_to_close',
        quantity: 1
      },
    ]
    await tradier.multilegOptionOrder(underlying, 'market', legs)
  }
}