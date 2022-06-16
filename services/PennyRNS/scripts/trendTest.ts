import * as tradier from '@penny/tradier'
import { RNSModel, PriceHistoryModel } from "@penny/db-models"
import { uniq } from 'lodash'


type TimeSeries = {
  date: string,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
}

const getHistoricalData = async (ticker, start, end): Promise<TimeSeries[]> => {
  const url = `markets/history?symbol=${ticker}&interval=daily&start=${start}&end=${end}`
  const timeSeries = await tradier.callTradierHelper(url, 'history', 'day', true)
  return timeSeries
}


const testForDate = async (date: string) => {
  const filter = {
    perc: { $lte: 1 },
    price: { $gte: 10 },
    type: 'put',
    premium: { $lte: 1000, $gte: 20 },
    date,
  }
  //console.log('Getting calls')
  const calls = await RNSModel.find(filter).sort({ perc: 1 }).lean()
  
  const callsToCheck = []
  //if (calls.length > 0) console.log('Getting history')
  for (let x = 0; x < calls.length; x++) {
    const call = calls[x]

    const history = await getHistoricalData(call.underlying, '2022-02-01', call.date)
    const previous2Days = history.slice(-3).slice(0, 2)

    const priceHistory = previous2Days.reduce((acc, timeSeries) => [ ...acc, timeSeries.open, timeSeries.close ], [])
    const isUptrend = priceHistory.reduce((acc, num, index) => {
        if (index === 0) {
          return acc
        }

        return priceHistory[index - 1] < num ? false : acc
      }, true)

    if (isUptrend) {
      callsToCheck.push(call)
    }
  }

  //console.log(callsToCheck)

  //if (callsToCheck.length > 0) console.log('Getting price data since purchase')

  const selectedResults = []
  for (let x = 0; x < callsToCheck.length; x++) {
    const call = callsToCheck[x]
    const symbol = call.symbol
    const priceHistory = await PriceHistoryModel.find({ symbol }).lean()


    const dayPriceHistory = priceHistory.filter(x => x.date.toISOString().split('T')[0] === date)

    if (dayPriceHistory.length > 0) {
      const lastPrice = dayPriceHistory.reverse()[0]
      selectedResults.push({
        symbol: symbol,
        premium: call.premium,
        endOfDay: lastPrice.price,
        profit: lastPrice.price - call.premium,
        win: lastPrice.price > call.premium
      })
    }
  }

  const winners = selectedResults.filter(x => x.win).length
  const losers = selectedResults.filter(x => !x.win).length
  const totalProfit = selectedResults.reduce((acc, x) => acc + x.profit, 0)
  const totalPremium = selectedResults.reduce((acc, x) => acc + x.premium, 0)

  console.log(`${date}\t\t${winners}\t\t${losers}\t\t${totalPremium}\t\t$${totalProfit}`)
}


export const trendTest = async () => {
  const allDates = await RNSModel.find({}, 'date').lean()
  const dates = uniq(allDates.map(x => x.date)).reverse()

  
  for (let x = 0; x < dates.length; x++) {

    await testForDate(dates[x])
  }

}
