import * as tradier from '@penny/tradier'
import { getATMOptions } from './getATMOptions'
import { evalAndPurchase } from './evalAndPurchase'
import { RNSModel } from '@penny/db-models'
const symbols = require('../core/weeklyTickers.json')


export const saveAndPurchase = async () => {
  const open = await tradier.isMarketOpen()
  if (!open) {
    return
  }

  for (let x = 0; x < symbols.length; x++) {
    const symbol = symbols[x]
    console.log(symbol)
    const prices = await tradier.getPrices([symbol])
    const atmOpts = await getATMOptions(symbol, prices)
    if (atmOpts) {
      const diff = atmOpts.put.diff ?? atmOpts.call.diff

      // If the diff is negative, buy the put
      if (diff < 0) {
        await evalAndPurchase(atmOpts.put)
      } else {
        await evalAndPurchase(atmOpts.call)
      }

      // Save to DB
      const putModel = new RNSModel(atmOpts.put)
      const callModel = new RNSModel(atmOpts.call)
      await Promise.all([
        putModel.save(),
        callModel.save(),
      ])
    }
  }
}