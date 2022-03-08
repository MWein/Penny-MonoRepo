require('dotenv').config({ path: '../../../.env' })

import * as tradier from '@penny/tradier'
import { uniq } from 'lodash'
import { getUnderlying, getType, getStrike } from '@penny/option-symbol-parser'
import { Spread } from '@penny/tradier'


const getSpreadStanding = (spread: Spread, prices) => {
  const type = getType(spread.short)
  const symbol = getUnderlying(spread.short)

  const currentPrice = prices.find(x => x.symbol === symbol)?.price
  if (!currentPrice) {
    return null
  }

  const targetPriceSortFunc = type === 'call' ? (a, b) => a - b : (a, b) => b - a
  const targetPrice = Object.values(spread).map(x => getStrike(x)).sort(targetPriceSortFunc)[0]
  const winning = type === 'call' ? currentPrice < targetPrice : currentPrice > targetPrice

  return {
    symbol,
    type,
    spread,
    currentPrice,
    targetPrice,
    winning,
  }
}


const printResult = (title, numberWinning, numberLosing, total) => {
  console.log(`\n------ ${title} ------`)
  console.log('Winning', numberWinning, `${((numberWinning / total) * 100).toFixed(2)}%`)
  console.log('Losing', numberLosing, `${((numberLosing / total) * 100).toFixed(2)}%`)
  console.log('-------------------\n')
}


const spreadStandings = async (positions) => {
  const spreads = tradier.groupOptionsIntoSpreads(positions)

  const allTickers = uniq([ ...spreads.put.spreads, ...spreads.call.spreads ].map(x => getUnderlying(x.short)))
  const currentPrices = await tradier.getPrices(allTickers)

  const standings = [ ...spreads.put.spreads, ...spreads.call.spreads ].map(x => getSpreadStanding(x, currentPrices))

  const total = standings.length
  const numberWinning = standings.filter(x => x.winning).length
  const numberLosing = standings.filter(x => !x.winning).length

  const putStandings = standings.filter(x => x.type === 'put')
  const numberPutsWinning = putStandings.filter(x => x.winning).length
  const numberPutsLosing = putStandings.filter(x => !x.winning).length

  const callStandings = standings.filter(x => x.type === 'call')
  const numberCallsWinning = callStandings.filter(x => x.winning).length
  const numberCallsLosing = callStandings.filter(x => !x.winning).length

  printResult('Total', numberWinning, numberLosing, total)
  printResult('Puts', numberPutsWinning, numberPutsLosing, putStandings.length)
  printResult('Calls', numberCallsWinning, numberCallsLosing, callStandings.length)
}


const getStandings = async () => {
  // const gainLoss = await tradier.getGainLoss()

  // const startDate = new Date('2022-02-19')
  // const gainLossSinceStart = gainLoss.filter(x => {
  //   const openDate = new Date(x.open_date)
  //   return openDate > startDate
  // })

  // console.log(gainLossSinceStart)

  const positions = await tradier.getPositions()


  await spreadStandings(positions)
  const totalCostBasis = positions.reduce((acc, x) => acc + x.cost_basis, 0) * -1

  //const totalCostBasisClosed = gainLossSinceStart.reduce((acc, x) => acc + (x.cost * x.quantity * -1), 0)

  console.log(`Total Current Profit Potential $${totalCostBasis}\n`)


  const tickers = uniq(positions.map(x => getUnderlying(x.symbol)))
  tickers.map(ticker => {
    const positionsWithTicker = positions.filter(x => getUnderlying(x.symbol) === ticker)
    const costBasis = positionsWithTicker.reduce((acc, x) => acc + x.cost_basis, 0) * -1
    console.log(ticker, costBasis, 100 - costBasis)
  })
}


getStandings()