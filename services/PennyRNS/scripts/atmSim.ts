import * as tradier from '@penny/tradier'


type TimeSeries = {
  date: string,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
}

type Week = {
  first: TimeSeries,
  last: TimeSeries,
}

type BuySellEvent = {
  type: 'buy' | 'sell',
  amount: number,
}



const getHistoricalData = async (ticker, start): Promise<TimeSeries[]> => {
  const url = `markets/history?symbol=${ticker}&interval=daily&start=${start}`
  const timeSeries = await tradier.callTradierHelper(url, 'history', 'day', true)
  return timeSeries
}


const organizedByWeek = (historicalData: TimeSeries[]): Week[] =>
  historicalData.reduce((acc, timeSeries, index) =>
    index === 0 ? [[ timeSeries ]] :
      new Date(historicalData[index].date).valueOf() - new Date(historicalData[index - 1].date).valueOf() > 86400000 ?
        [ ...acc, [ timeSeries ] ]
          : [ ...acc.slice(0, -1), [ ...acc[acc.length - 1], timeSeries ] ], [])
            .map(fullWeek => ({ first: fullWeek[0], last: fullWeek[fullWeek.length - 1] }))



const printTitleRow = () => {
  console.log(`Week \t\t Type \t PPS \t Premium \t Assigned\n`)
}

const printEventRow = (first: string, type: 'Call' | 'Put', sharePrice: number, premium: number, assigned: boolean) => {
  console.log(`${first} \t ${type} \t ${sharePrice} \t ${premium} \t\t ${assigned}`)
}


const simAtmWithData = (weeks: Week[], premiumPerc: number) => {
  printTitleRow()

  let premiumMade = 0
  const buySellEvents: BuySellEvent[] = []

  let ownShares = false

  for (let x = 0; x < weeks.length; x++) {
    const week = weeks[x]

    // if (!ownShares) {
    //   ownShares = true
    //   buySellEvents.push({
    //     type: 'buy',
    //     amount: week.first.open
    //   })
    // }

    // Sell Call
    if (ownShares) {
      const price = Math.floor(week.first.open + 4)
      const premium = Number(((price * 100) * premiumPerc).toFixed(0))
      premiumMade += premium
      
      const assigned = week.last.close > price

      if (assigned) {
        ownShares = false
        buySellEvents.push({
          type: 'sell',
          amount: price
        })
      }

      printEventRow(week.first.date, 'Call', price, premium, assigned)
      continue
    }

    // Sell Put
    if (!ownShares) {
      const price = Math.floor(week.first.open - 4)
      const premium = Number(((price * 100) * premiumPerc).toFixed(0))
      premiumMade += premium

      const assigned = week.last.close < price

      if (assigned) {
        ownShares = true
        buySellEvents.push({
          type: 'buy',
          amount: price
        })
      }

      printEventRow(week.first.date, 'Put', price, premium, assigned)
    }
  }

  const realizedLoss = buySellEvents.reduce((acc, event, index) => {
    // If the last one is a buy, don't count it
    if (index === buySellEvents.length - 1 && event.type === 'buy') {
      return acc
    }

    if (event.type === 'buy') {
      return acc - event.amount
    }
    return acc + event.amount
  }, 0) * 100

  console.log(`\nPremium Made: $${premiumMade}`)
  console.log(`Realized Loss: $${realizedLoss}`)
  console.log(`Overall: $${premiumMade + realizedLoss}`)
}


export const atmSim = async () => {
  const TICKER = 'IWM'
  const START = '2018-05-01'
  const PREMIUM_PERC = 0.003

  const historical = await getHistoricalData(TICKER, START)
  const organized = organizedByWeek(historical)

  simAtmWithData(organized, PREMIUM_PERC)
}