import * as tradier from '@penny/tradier'
import { getType, isOption } from '@penny/option-symbol-parser'
import { getSpreadOutcomes, SpreadSide } from '@penny/spread-outcome'

type ICPosition = {
  ticker: string,
  side: SpreadSide,
  gainLoss: number,
  maxLoss: number,
  maxGain: number,
  hasPut?: boolean,
  hasCall?: boolean,
}

const roundedNumber = (num: number) => Number(num.toFixed(0))

const getICPositions = async (): Promise<ICPosition[]> => {
  const positions = await tradier.getPositions()
  const optionPositions = positions.filter(pos => isOption(pos.symbol))

  const optionTickers = optionPositions.map(x => x.symbol)
  const prices = await tradier.getPrices(optionTickers)

  const spreads = getSpreadOutcomes(optionPositions)

  return spreads.map(spread => {
    const positions = spread.positions

    const gainLoss = positions.reduce((acc, pos) => {
      const price = prices.find(x => x.symbol === pos.symbol)?.price
      if (!price) {
        return acc
      }

      const quantity = Math.abs(pos.quantity)

      // Short position
      if (pos.quantity < 0) {
        const salePrice = Math.abs(pos.cost_basis)
        const currentBuyBackPrice = Number((price * 100 * quantity).toFixed(0))
        const gainLoss = salePrice - currentBuyBackPrice
        return acc + gainLoss
      }

      // Long position
      if (pos.quantity > 0) {
        const buyPrice = pos.cost_basis
        const currentSalePrice = Number((price * 100 * quantity).toFixed(0))
        const gainLoss = currentSalePrice - buyPrice
        return acc + gainLoss
      }
    }, 0)

    const hasCall = positions.some(pos => getType(pos.symbol) === 'call')
    const hasPut = positions.some(pos => getType(pos.symbol) === 'put')

    return {
      ticker: spread.ticker,
      side: spread.side,
      gainLoss: roundedNumber(gainLoss),
      maxLoss: roundedNumber(spread.maxLoss),
      maxGain: roundedNumber(spread.maxGain),
      hasPut,
      hasCall,
    }
  })
}


export {
  getICPositions
}