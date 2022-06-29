import * as tradier from '@penny/tradier'
import { getATMOptions } from './getATMOptions'
import { evalAndPurchase } from './evalAndPurchase'
import { RNSModel } from '@penny/db-models'
const symbols = require('../core/weeklyTickers.json')


const evaluateOption = (option) =>
  option.perc <= 1 && option.price >= 10 && option.premium >= 30 && option.premium < 1000


// TODO Refactor
const determineTrend = (prices: number[]) => {
  const isUptrend = prices.reduce((acc, num, index) => {
    if (index === 0) {
      return acc
    }
    return prices[index - 1] > num ? false : acc
  }, true)

  if (isUptrend) {
    return 'uptrend'
  }

  const isDowntrend = prices.reduce((acc, num, index) => {
    if (index === 0) {
      return acc
    }
    return prices[index - 1] < num ? false : acc
  }, true)
  if (isDowntrend) {
    return 'downtrend'
  }

  return null
} 


export const saveAndPurchase = async () => {
  const open = await tradier.isMarketOpen()
  if (!open) {
    return
  }

  const date = new Date().toISOString().split('T')[0]

  for (let x = 0; x < symbols.length; x++) {
    const symbol = symbols[x]
    console.log(symbol)
    const prices = await tradier.getPrices([symbol])
    const atmOpts = await getATMOptions(symbol, prices)
    if (atmOpts) {
      if (evaluateOption(atmOpts.put) || evaluateOption(atmOpts.call)) {
        // Get price history
        // TODO Come up with date that doesnt go back several months
        const history = await tradier.getHistory(symbol, '2022-06-10', date)
        const previous2Days = history.slice(-2).slice(0, 2)
        const priceHistory = previous2Days.reduce((acc, timeSeries) => [ ...acc, timeSeries.open, timeSeries.close ], [])

        const trend = determineTrend(priceHistory)

        if (trend === 'uptrend') {
          await evalAndPurchase(atmOpts.call)
        } else if (trend === 'downtrend') {
          await evalAndPurchase(atmOpts.put)
        }
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
