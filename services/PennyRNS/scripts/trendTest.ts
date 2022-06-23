import * as tradier from '@penny/tradier'
import { RNSModel, PriceHistoryModel } from "@penny/db-models"
import { uniq } from 'lodash'


const testForDate = async (date: string) => {
  const filter = {
    perc: { $lte: 1 },
    price: { $gte: 10 },
    type: 'put',
    premium: { $lte: 500, $gte: 20 },
    date,
  }
  //console.log('Getting calls')
  const calls = await RNSModel.find(filter).sort({ perc: 1 }).lean()
  
  const callsToCheck = []
  //if (calls.length > 0) console.log('Getting history')
  for (let x = 0; x < calls.length; x++) {
    const call = calls[x]

    const history = await tradier.getHistory(call.underlying, '2022-02-01', call.date)
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

    const dateObj = new Date(date)
    const nextDate = new Date(date)
    if (dateObj.getDay() === 4) {
      nextDate.setDate(nextDate.getDate() + 3)
    } else {
      nextDate.setDate(nextDate.getDate() + 1)
    }
    //const nextDate = new Date(date).setDate(new Date(date).getDate() + 1)
    const nextDateStr = nextDate.toISOString().split('T')[0]
    //console.log(date, nextDateStr)
    const dayPriceHistory = priceHistory.filter(x => x.date.toISOString().split('T')[0] === nextDateStr)

    if (dayPriceHistory.length > 0) {
      const lastPrice = dayPriceHistory[0]
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

  const skipDates = []//[ '2022-06-22', '2022-06-21', '2022-06-20', '2022-06-17', '2022-06-16', '2022-06-15', '2022-06-14', '2022-06-13', '2022-06-10', '2022-06-09', '2022-06-08', '2022-06-07', '2022-06-06' ]
  const checkDates = dates.filter(x => !skipDates.includes(x))

  for (let x = 0; x < checkDates.length; x++) {

    await testForDate(checkDates[x])
  }

}
