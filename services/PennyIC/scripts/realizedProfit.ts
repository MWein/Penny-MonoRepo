require('dotenv').config({ path: '../../../.env' })


import * as tradier from '@penny/tradier'
import { getExpiration, getUnderlying } from '@penny/option-symbol-parser'


const realizedProfit = async () => {
  const gainLoss = await tradier.getGainLoss()

  const startDate = new Date('2022-02-21')
  const gainLossSinceStart = gainLoss.filter(x => {
    const openDate = new Date(x.open_date)
    return openDate > startDate
  }).map(x => ({ ...x, underlying: getUnderlying(x.symbol) }))
    .filter(x => x.open_date.split('T')[0] === '2022-02-24')

  console.log(gainLossSinceStart)

  const bigThreeOnly = gainLossSinceStart.filter(x => [ 'SPY', 'IWM', 'QQQ' ].includes(x.underlying))
  const withoutBigThree = gainLossSinceStart.filter(x => ![ 'SPY', 'IWM', 'QQQ' ].includes(x.underlying))


  const bigThreeGainLoss = bigThreeOnly.reduce((acc, x) => acc + x.gain_loss, 0)
  const withoutBigThreeGainLoss = withoutBigThree.reduce((acc, x) => acc + x.gain_loss, 0)
  const totalGainLoss = gainLossSinceStart.reduce((acc, x) => acc + x.gain_loss, 0)

  console.log('Total Gain/Loss', totalGainLoss)
  console.log('Big Three Gain/Loss', bigThreeGainLoss)
  console.log('Without Big Three Gain/Loss', withoutBigThreeGainLoss)
}

realizedProfit()