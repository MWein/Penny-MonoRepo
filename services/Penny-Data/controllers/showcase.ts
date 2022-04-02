import * as tradier from '@penny/tradier'
import { useCache } from '../utils/cache'


const getSunday = (d) => {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 0)
  return new Date(d.setDate(diff))
}

const retrieveGainLoss = async (start: string): Promise<number> => {
  const gainLoss = await tradier.getGainLoss(1, 20000, start)
  return Number(gainLoss.reduce((acc, gl) => acc + gl.gain_loss, 0).toFixed(2))
}

const retrieveEquity = async () => {
  const balances = await tradier.getBalances()
  return balances.total_equity
}

const showcaseController = async (req, res) => {
  const equity = await useCache('equity', retrieveEquity, 0)

  const today = new Date()
  const monthNum = today.getUTCMonth() + 1

  const firstOfYear = `${today.getFullYear()}-01-01`
  const firstOfMonth = `${today.getFullYear()}-${monthNum < 10 ? `0${monthNum}` : monthNum}-01`
  const firstOfWeek = getSunday(today).toISOString().split('T')[0]

  const monthEarnings = await useCache('monthEarnings', () => retrieveGainLoss(firstOfMonth), 0)
  const yearEarnings = await useCache('yearEarnings', () => retrieveGainLoss(firstOfYear), 0)

  const realizedWeekEarnings = await useCache('realizedWeekEarnings', () => retrieveGainLoss(firstOfWeek), 0)

  res.json({
    equity,
    weekEarnings: realizedWeekEarnings,
    monthEarnings,
    yearEarnings,
    theft: 4,
    lastYearTheft: 5,
    positions: []
  })
}

export {
  showcaseController
}