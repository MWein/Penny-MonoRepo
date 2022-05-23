import * as tradier from '@penny/tradier'
import { useCache } from '../utils/cache'
import { isOption } from '@penny/option-symbol-parser'

const getSunday = (d) => {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 0)
  return new Date(d.setDate(diff))
}

const retrieveGainLoss = async (start: string): Promise<number> => {
  const gainLossResult = await tradier.getGainLoss(1, 20000, start)
  const gainLoss = Number(gainLossResult.reduce((acc, gl) => acc + gl.gain_loss, 0).toFixed(2))

  return gainLoss
}

const retrieveEquity = async () => {
  const balances = await tradier.getBalances()
  return balances.total_equity
}

const getPositionsWithGainLoss = async (): Promise<(tradier.Position & { gainLoss: number })[]> => {
  const positions = await tradier.getPositions()
  const symbols = positions.map(x => x.symbol)
  const prices = await tradier.getPrices(symbols)
  const correctedPrices = prices.map(x => ({
    ...x,
    price: isOption(x.symbol) ? Number((x.price * 100).toFixed(0)) : x.price
  }))

  return positions.map(pos => {
    const price = correctedPrices.find(x => x.symbol === pos.symbol)?.price ?? 0
    const priceAdjustedForPositions = price * pos.quantity
    const gainLoss = priceAdjustedForPositions - pos.cost_basis

    return {
      ...pos,
      date_acquired: pos.date_acquired.split('T')[0],
      gainLoss,
    }
  })
}

const showcaseRNSController = async (req, res) => {
  const positions = await useCache('positions', getPositionsWithGainLoss, [], 840)
  const equity = await useCache('equity', retrieveEquity, 0)

  const today = new Date()
  const monthNum = today.getUTCMonth() + 1

  const firstOfYear = `${today.getFullYear()}-01-01`
  const firstOfMonth = `${today.getFullYear()}-${monthNum < 10 ? `0${monthNum}` : monthNum}-01`
  const firstOfWeek = getSunday(today).toISOString().split('T')[0]

  const monthEarnings = await useCache('monthEarnings', () => retrieveGainLoss(firstOfMonth), 0)
  const yearEarnings = await useCache('yearEarnings', () => retrieveGainLoss(firstOfYear), 0)

  // TODO Make service for this
  const theft = Math.max(0, yearEarnings * 0.22)

  const realizedWeekEarnings = await useCache('realizedWeekEarnings', () => retrieveGainLoss(firstOfWeek), 0)
  const unrealizedWeekEarnings = positions.reduce((acc, pos) => acc + pos.gainLoss, 0)

  const weekEarnings = unrealizedWeekEarnings + realizedWeekEarnings

  res.json({
    equity,
    weekEarnings,
    monthEarnings,
    yearEarnings,
    theft,
    lastYearTheft: 0,
    positions
  })
}

export {
  showcaseRNSController
}