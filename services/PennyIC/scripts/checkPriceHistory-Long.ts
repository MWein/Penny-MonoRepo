// Check the price history for the current cycle throughout the week
// Used to see if going long and selling same or next day would work

require('dotenv').config({ path: '../../../.env' })
import * as tradier from '@penny/tradier'


const getNextDates = startDate => {
  const dates = []
  const today = new Date().toISOString().split('T')[0]

  let current = startDate
  dates.push(current)
  while (current !== today) {
    const next = new Date(current)
    next.setDate(next.getDate() + 1)

    // Handle weird bug where date increment results in the same date
    if (next.toISOString().split('T')[0] === current) {
      next.setDate(next.getDate() + 1)
    }

    current = next.toISOString().split('T')[0]
    dates.push(current)
  }
  return dates
}


const checkPriceHistory = async () => {
  // open, high, low, close
  const keyToUse = 'close'

  const positions = await tradier.getPositions()

  const longPositions = positions.filter(x => x.quantity > 0)

  const longCostBasis = longPositions.reduce((acc: number, pos: tradier.Position) => acc + pos.cost_basis, 0)

  const earliestAquiredDate = longPositions.reduce((acc: string, pos: tradier.Position) => {
    const accDate = new Date(acc)
    const curDate = new Date(pos.date_acquired)
    return accDate > curDate ? curDate.toISOString().split('T')[0] : acc
  }, longPositions[0].date_acquired.split('T')[0])

  const datesToCalc = getNextDates(earliestAquiredDate)

  const positionsWithPriceHistory = []
  const today = new Date().toISOString().split('T')[0]

  for (let x = 0; x < longPositions.length; x++) {
    const position = longPositions[x]
    console.log('Fetching history for', position.symbol)
    const start = position.date_acquired.split('T')[0]
    const quotes = await tradier.getHistoricalQuote(position.symbol, start, today)
    positionsWithPriceHistory.push({
      ...position,
      quotes
    })

    const pos = {
      ...position,
      quotes
    }
    const quote = pos.quotes.find(x => x.date === '2022-03-22')
    if (!quote) {
      continue
    }
    const buyPrice = pos.cost_basis
    const currentSalePrice = Number((quote[keyToUse] * 100).toFixed(0))
    const gainLoss = currentSalePrice - buyPrice
    console.log(pos.symbol, gainLoss)
  }

  console.log(longCostBasis)
  
  datesToCalc.map(date => {
    const profitForDay = positionsWithPriceHistory.reduce((acc, pos) => {
      const quote = pos.quotes.find(x => x.date === date)
      if (!quote) {
        return acc
      }

      // Long position
      if (pos.quantity > 0) {
        const buyPrice = pos.cost_basis
        const currentSalePrice = Number((quote[keyToUse] * 100).toFixed(0))
        const gainLoss = currentSalePrice - buyPrice
        return acc + gainLoss
      }
    }, 0)

    console.log(date, profitForDay)
  })


}

checkPriceHistory()