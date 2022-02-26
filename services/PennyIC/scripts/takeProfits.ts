import * as tradier from '@penny/tradier'
import { uniq } from 'lodash'


// TODO Rework into script


export const takeProfits = async () => {
  // TODO Is market open

  const positions = await tradier.getPositions()

  const positionsOpenedTuesday = positions.filter(x => x.date_acquired.split('T')[0] === '2022-02-24')

  const spreads = tradier.groupOptionsIntoSpreads(positionsOpenedTuesday)

  // TODO Add price map function to Tradier
  const allSpreads = [ ...spreads.call.spreads, ...spreads.put.spreads ]
  const allSpreadSymbols = uniq(allSpreads.reduce((acc, x) => [ ...acc, x.short, x.long ], []))
  const prices = await tradier.getPrices(allSpreadSymbols)
  const priceMap = prices.reduce((acc, x) => ({ ...acc, [x.symbol]: x.price }), {})

  const spreadStandings = allSpreads.map(spread => {
    const shortPosition = positions.find(x => x.symbol === spread.short)
    const longPosition = positions.find(x => x.symbol === spread.long)

    const shortCostBasis = shortPosition.cost_basis / shortPosition.quantity
    const longCostBasis = longPosition.cost_basis / longPosition.quantity

    const maximumProfit = shortCostBasis - longCostBasis

    const shortPrice = priceMap[spread.short]
    const longPrice = priceMap[spread.long]
    const currentPrice = (shortPrice - longPrice) * 100

    const profit = Number((maximumProfit - currentPrice).toFixed(0))
    const percent = Number(((profit / maximumProfit) * 100).toFixed(0))

    return {
      ...spread,
      profit,
      maximumProfit,
      percent
    }
  })

  console.log(spreadStandings)

  const currentProfit = spreadStandings.reduce((acc, spread) => acc + spread.profit, 0)

  console.log(currentProfit)
}