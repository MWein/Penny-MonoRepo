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
  console.log('-------------------')
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
  const positions = await tradier.getPositions()
  //const positions = allPositions.filter(x => ['TQQQ', 'SOXL', 'DUST', 'ERX', 'FAS', 'FAZ', 'JNUG', 'LABD', 'LABU', 'NUGT', 'SDS', 'TNA', 'UPRO', 'YINN'].includes(getUnderlying(x.symbol)))
  const optionTickers = positions.map(x => x.symbol)

  const prices = await tradier.getPrices(optionTickers)

  await spreadStandings(positions)
  const totalCostBasis = positions.reduce((acc, x) => acc + x.cost_basis, 0) * -1


  // Total profit if closed out now
  const byTicker = {}
  const currentGainLoss = positions.reduce((acc: number, pos: tradier.Position) => {
    const underlying = getUnderlying(pos.symbol)
    if (!byTicker[underlying]) {
      byTicker[underlying] = 0
    }

    const price = prices.find(x => x.symbol === pos.symbol)?.price
    if (!price) {
      return acc
    }

    // Short position
    if (pos.quantity < 0) {
      const salePrice = Math.abs(pos.cost_basis)
      const currentBuyBackPrice = Number((price * 100).toFixed(0))
      const gainLoss = salePrice - currentBuyBackPrice
      byTicker[underlying] += gainLoss
      return acc + gainLoss
      //return acc
    }

    // Long position
    if (pos.quantity > 0) {
      const buyPrice = pos.cost_basis
      const currentSalePrice = Number((price * 100).toFixed(0))
      const gainLoss = currentSalePrice - buyPrice
      byTicker[underlying] += gainLoss
      return acc + gainLoss
      //return acc
    }
    return 0
  }, 0)


  console.log(`\nTotal Profit Potential $${totalCostBasis}`)
  console.log(`Total Profit if Closed Now $${currentGainLoss}\n`)

  // Analytics
  const bigThreeTickers = [ 'SPY', 'IWM', 'QQQ' ]
  const leveragedTickers = [ 'TQQQ', 'SOXL', 'DUST', 'ERX', 'FAS', 'FAZ', 'JNUG', 'LABD', 'LABU', 'NUGT', 'SDS', 'TNA', 'UPRO', 'YINN' ]
  const byTickerArr = Object.keys(byTicker).map(x => ({ ticker: x, gl: byTicker[x] }))
  const winning = byTickerArr.filter(x => x.gl > 0)
  const losing = byTickerArr.filter(x => x.gl < 0)

  const getSum = (set) => set.reduce((acc: number, x) => acc + x.gl, 0)
  const getAverage = (set) => Number((set.reduce((acc: number, x) => acc + x.gl, 0) / set.length).toFixed(2))
  console.log(`Number Winning: ${winning.length} | Number Losing: ${losing.length}`)
  console.log(`Average Win: $${getAverage(winning)} | Average Loss: $${getAverage(losing)}`)
  console.log(`Total Win: $${getSum(winning)} | Total Loss: $${getSum(losing)}\n`)

  const formatForPrinting = (set) => set.map(x => `${x.ticker}: $${x.gl}`).join(' | ')

  // Big three
  const bigThree = formatForPrinting(byTickerArr.filter(x => bigThreeTickers.includes(x.ticker)))
  console.log('Big Three:', bigThree, '\n')

  // Leveraged
  const leveraged = formatForPrinting(byTickerArr.filter(x => leveragedTickers.includes(x.ticker)))
  console.log('Leveraged:', leveraged, '\n')

  // All others - winners
  const winningTickers = formatForPrinting(byTickerArr.filter(x => ![ ...bigThreeTickers, ...leveragedTickers ].includes(x.ticker) && x.gl > 0))
  console.log(`Winners:\n${winningTickers}\n`)

  // All others - losers
  const losingTickers = formatForPrinting(byTickerArr.filter(x => ![ ...bigThreeTickers, ...leveragedTickers ].includes(x.ticker) && x.gl < 0))
  console.log(`Losers:\n${losingTickers}`)
}


getStandings()