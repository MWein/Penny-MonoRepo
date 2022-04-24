import * as tradier from '@penny/tradier'
import { useCache } from '../utils/cache'
import { getICPositions } from '../services/getICPositions'
import * as logger from '@penny/logger'

const getSunday = (d) => {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 0)
  return new Date(d.setDate(diff))
}

const retrieveGainLoss = async (start: string): Promise<{ gainLoss: number, percReturn: number, totalRisked: number }> => {
  const gainLossResult = await tradier.getGainLoss(1, 20000, start)
  const gainLoss = Number(gainLossResult.reduce((acc, gl) => acc + gl.gain_loss, 0).toFixed(2))

  const totalRisked = Math.abs(
    gainLossResult.reduce((acc, gl) => acc + (gl.quantity > 0 ? gl.cost : gl.proceeds * -1), 0)
  )
  const percReturn = Number(((gainLoss / totalRisked) * 100).toFixed(2))

  return {
    gainLoss,
    totalRisked,
    percReturn,
  }
}

const retrieveEquity = async () => {
  const balances = await tradier.getBalances()
  return balances.total_equity
}

const showcaseController = async (req, res) => {
  const positions = await useCache('positions', getICPositions, [], 840)
  const equity = await useCache('equity', retrieveEquity, 0)

  const today = new Date()
  const monthNum = today.getUTCMonth() + 1

  const firstOfYear = `${today.getFullYear()}-01-01`
  const firstOfMonth = `${today.getFullYear()}-${monthNum < 10 ? `0${monthNum}` : monthNum}-01`
  const firstOfWeek = getSunday(today).toISOString().split('T')[0]

  const monthResult = await useCache('monthEarnings', () => retrieveGainLoss(firstOfMonth), 0)
  const { gainLoss: monthEarnings, percReturn: monthPercReturn } = monthResult

  const yearResult = await useCache('yearEarnings', () => retrieveGainLoss(firstOfYear), 0)
  const { gainLoss: yearEarnings, percReturn: yearPercReturn } = yearResult

  // TODO Make service for this
  const theft = Math.max(0, yearEarnings * 0.22)

  const weekResult = await useCache('realizedWeekEarnings', () => retrieveGainLoss(firstOfWeek), 0)
  const { gainLoss: realizedWeekEarnings, totalRisked: realizedWeekTotalRisked } = weekResult

  const unrealizedWeekEarnings = positions.reduce((acc, pos) => {
    const gl = pos.gainLoss
    return gl > pos.maxGain || gl < pos.maxLoss ? acc : acc + gl
  }, 0)
  const unrealizedWeekTotalRisked = positions.reduce((acc, pos) => acc + pos.maxLoss, 0) * -1

  const weekEarnings = unrealizedWeekEarnings + realizedWeekEarnings
  const weekPercReturn = Number(((weekEarnings / (realizedWeekTotalRisked + unrealizedWeekTotalRisked)) * 100).toFixed(2))

  logger.log({
    message: `Week Earnings: $${weekEarnings} of $${(realizedWeekTotalRisked + unrealizedWeekTotalRisked)}`
  })


  // Long and Short Values

  const currentValueLong = 110
  const currentValueShort = 120

  // Long and Short Values


  res.json({
    equity,
    weekEarnings,
    currentValueLong,
    currentValueShort,
    weekPercReturn: isNaN(weekPercReturn) ? 0 : weekPercReturn,
    monthEarnings,
    monthPercReturn: isNaN(monthPercReturn) ? 0 : monthPercReturn,
    yearEarnings,
    yearPercReturn: isNaN(yearPercReturn) ? 0 : yearPercReturn,
    theft,
    lastYearTheft: 0,
    positions
  })
}

export {
  showcaseController
}