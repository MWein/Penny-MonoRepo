import { RNSModel, PriceHistoryModel } from "@penny/db-models"
import * as tradier from '@penny/tradier'
import { uniq } from 'lodash'


export const checkThemTest = async () => {
  const date = '2022-05-25'

  const strategy: 'long' | 'short' | 'both' = 'long'

  const matchingOptions = []

  if ([ 'both', 'short' ].includes(strategy)) {
        const filter = {
        perc: { $gte: 5 },
        price: { $gte: 10 },
        type: 'put',
        premium: { $lte: 1000 },
        date,
      }
      const matching = await RNSModel.find(filter).sort({ perc: -1 }).lean()
      matchingOptions.push(...matching)
  }

  if ([ 'both', 'long' ].includes(strategy)) {
    const filter = {
      perc: { $lte: 1 },
      price: { $gte: 10 },
      //type: 'call',
      premium: { $lte: 1000, $gte: 20 },
      date,
    }
    const matching = await RNSModel.find(filter).sort({ perc: 1 }).lean()
    matchingOptions.push(...matching)
  }

  const tradierPrices = await tradier.getPrices(matchingOptions.map(x => x.symbol))

  console.log(tradierPrices)

  const currentPrices = tradierPrices.map(x => ({ ...x, price: Number((x.price * 100).toFixed(0)) }))

  const optionsWithProfit = matchingOptions.map(opt => {
    const currentPrice = currentPrices.find(x => x.symbol === opt.symbol)?.price || opt.premium
    const profit = currentPrice - opt.premium

    return {
      ...opt,
      currentPrice,
      profit,
    }
  })

  console.log(optionsWithProfit)

  console.log(`Premium $${optionsWithProfit.reduce((acc, x) => acc + x.premium, 0)}`)
  console.log(`Profit: $${optionsWithProfit.reduce((acc, x) => acc + x.profit, 0)}`)
}


export const checkDayTrading = async () => {
  const dates = [ '2022-05-23', '2022-05-24', '2022-05-25', '2022-05-26' ]

  for (let x = 0; x < dates.length; x++) {
    let todayGainLoss = 0
    const date = dates[x]
    const filter = {
      perc: { $lte: 1 },
      price: { $gte: 10 },
      //type: 'call',
      premium: { $lte: 1000, $gte: 20 },
      date,
    }
    const matching = await RNSModel.find(filter).sort({ perc: 1 }).lean()

    // Get EOD prices
    for (let y = 0; y < matching.length; y++) {
      const current = matching[y]
      const priceHistory = await PriceHistoryModel.find({ symbol: current.symbol }).lean()
      const currentDatePriceHistory = priceHistory.filter(x => x.date.toISOString().split('T')[0] === date)
      const lastEntry = currentDatePriceHistory[currentDatePriceHistory.length - 1]
      const gainLoss = lastEntry.price - current.premium
      todayGainLoss += gainLoss
    }

    console.log(date, todayGainLoss)
  }


}