require('dotenv').config({ path: '../../../.env' })


import * as tradier from '@penny/tradier'
import { getExpiration, getUnderlying } from '@penny/option-symbol-parser'
import { uniq } from 'lodash'

const realizedProfit = async () => {
  const gainLoss = await tradier.getGainLoss()

  const startDate = new Date('2022-03-06')
  const gainLossSinceStart = gainLoss.filter(x => {
    const openDate = new Date(x.open_date)
    return openDate > startDate
  }).map(x => ({ ...x, underlying: getUnderlying(x.symbol) }))
  //.filter(x => x.quantity > 0)
    //.filter(x => x.open_date.split('T')[0] === '2022-03-17')
    //.filter(x => x.close_date.split('T')[0] === '2022-03-16' || x.close_date.split('T')[0] === '2022-03-18')

  const bigThreeOnly = gainLossSinceStart.filter(x => [ 'SPY', 'IWM', 'QQQ' ].includes(x.underlying))
  const withoutBigThree = gainLossSinceStart.filter(x => ![ 'SPY', 'IWM', 'QQQ' ].includes(x.underlying))

  const bigThreeGainLoss = bigThreeOnly.reduce((acc, x) => acc + x.gain_loss, 0)
  const withoutBigThreeGainLoss = withoutBigThree.reduce((acc, x) => acc + x.gain_loss, 0)
  const totalGainLoss = gainLossSinceStart.reduce((acc, x) => acc + x.gain_loss, 0)

  console.log('Total Gain/Loss', totalGainLoss)
  console.log('Big Three Gain/Loss', bigThreeGainLoss)
  console.log('Without Big Three Gain/Loss', withoutBigThreeGainLoss)
  console.log('\n')

  let totalDiff = 0

  const allTickers = uniq(gainLossSinceStart.map(x => getUnderlying(x.symbol)))
  allTickers.map(ticker => {
    const gainLossWithTicker = gainLossSinceStart.filter(x => getUnderlying(x.symbol) === ticker)

    const proceeds = gainLossWithTicker.filter(x => x.quantity < 0).reduce((acc, x) => acc + x.proceeds, 0)
    const cost = gainLossWithTicker.filter(x => x.quantity > 0).reduce((acc, x) => acc + x.cost, 0)
    const potentialProfit = proceeds - cost

    const tickerGainLoss = gainLossWithTicker.reduce((acc, x) => acc + x.gain_loss, 0)

    const diff = potentialProfit < 15 ? 15 - potentialProfit : 0
    const numPositions = gainLossWithTicker.length / 2
    const missingPositionMakeup = numPositions === 1 ? 15 : 0
    totalDiff += diff + missingPositionMakeup

    console.log(ticker, tickerGainLoss)
  })

  console.log('Diff with missing positions and minimum of $15:', totalDiff)
  console.log('With diff:', totalGainLoss + totalDiff)
}

realizedProfit()