import * as network from './network'
import * as logUtil from '@penny/logger'

// Failover function
export const _nextStrikeDates = (maxWeeksOut: number = 4): string[] => {
  const date = new Date()
  const dates = []

  while(dates.length < maxWeeksOut) {
    const day = date.getDay()
    if (day === 5) {
      date.setDate(date.getDate() + 7) // Off to next friday
    } else if (day === 6) {
      date.setDate(date.getDate() + 6)
    } else {
      date.setDate(date.getDate() + (5 - day))
    }
    // ISO string returns zulu time and can screw up the date
    const offset = date.getTimezoneOffset()
    const actualDate = new Date(date.getTime() - (offset*60*1000))
    dates.push(actualDate.toISOString().split('T')[0])
  }

  return dates
}


export const getExpirations = async (symbol: string, limit: number = 2): Promise<string[]> => {
  try {
    if (limit === 0) {
      return []
    }

    const url = `/markets/options/expirations?symbol=${symbol}`
    const response = await network.get(url)

    // Tradier has this annoying tendency to return a single object rather than an array if there is one return value
    // This should never happen with expirations, so I'm not doing the usual Array.isArray thing
    const currentDate = new Date().toISOString().split('T')[0]
    const dates = response.expirations.date.filter(x => x != currentDate)

    // These symbols have multiple expirations per week
    if ([ 'SPY', 'IWM', 'QQQ' ].includes(symbol)) {
      return [ dates[0] ]
    }

    return dates.slice(0, limit)
  } catch (e) {
    logUtil.log({
      type: 'error',
      message: e.toString()
    })

    return _nextStrikeDates(limit)
  }
}
